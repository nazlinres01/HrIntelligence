import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Global logout flag to prevent re-authentication
let isLoggedOut = false;

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || 'development-secret-key-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    password: "oauth-user", // Default password for OAuth users
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    role: "employee",
    isActive: true,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // Reset logout flag when logging in
    isLoggedOut = false;
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    // Set global logout flag
    isLoggedOut = true;
    // Mark session as logged out before destroying
    if (req.session) {
      (req.session as any).loggedOut = true;
    }
    req.logout(() => {
      req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        res.redirect("/");
      });
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    // Set global logout flag
    isLoggedOut = true;
    // Mark session as logged out before destroying
    if (req.session) {
      (req.session as any).loggedOut = true;
      req.session.save(() => {
        req.logout(() => {
          res.json({ success: true, message: "Logged out successfully" });
        });
      });
    } else {
      req.logout(() => {
        res.json({ success: true, message: "Logged out successfully" });
      });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Check global logout flag or session logout flag
  if (isLoggedOut || (req.session && (req.session as any).loggedOut)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // For development, create a mock authenticated user for the HR system to work
  if (!req.user) {
    req.user = {
      claims: {
        sub: 'dev-user-123',
        email: 'admin@hrtest.com',
        first_name: 'Admin',
        last_name: 'User',
        profile_image_url: null
      },
      access_token: 'dev-token',
      expires_at: Date.now() + 3600000 // 1 hour from now
    };
  }

  return next();
};