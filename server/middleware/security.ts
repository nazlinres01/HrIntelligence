import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Rate limiting store (in production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security middleware for rate limiting
export const rateLimiter = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (data.resetTime < windowStart) {
        rateLimitStore.delete(ip);
      }
    }
    
    const clientData = rateLimitStore.get(clientIP);
    
    if (!clientData) {
      rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({ 
        message: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
};

// Authentication middleware with enhanced security
export const authenticate = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.session?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token bulunamadı' });
    }
    
    // Verify session token
    const session = await storage.getActiveSession(token);
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Unauthorized - Session süresi dolmuş' });
    }
    
    // Get user with company details
    const user = await storage.getUserWithCompany(session.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Unauthorized - Kullanıcı aktif değil' });
    }
    
    // Update last activity
    await storage.updateSessionActivity(session.id);
    
    req.user = user;
    req.session = session;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized - Authentication failed' });
  }
};

// Role-based authorization middleware
export const authorize = (requiredRoles: string[] = [], requiredPermissions: string[] = []) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const user = req.user;
      
      // Check role requirement
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Forbidden - Yeterli yetki yok',
          required: requiredRoles,
          current: user.role
        });
      }
      
      // Check specific permissions
      if (requiredPermissions.length > 0) {
        const userPermissions = await storage.getUserPermissions(user.id, user.companyId);
        const hasPermission = requiredPermissions.every(permission => 
          userPermissions.some(p => p.permission === permission && p.isActive)
        );
        
        if (!hasPermission) {
          return res.status(403).json({ 
            message: 'Forbidden - Yeterli izin yok',
            required: requiredPermissions
          });
        }
      }
      
      next();
      
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(403).json({ message: 'Forbidden - Authorization failed' });
    }
  };
};

// Input validation middleware
export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: 'Geçersiz veri formatı',
          errors: result.error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      req.body = result.data;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Validation error' });
    }
  };
};

// SQL injection protection
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.replace(/[<>]/g, '').trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };
  
  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  next();
};

// XSS protection
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

// Audit logging middleware
export const auditLog = (action: string, resource: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    const startTime = Date.now();
    
    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // Log the action
      if (req.user) {
        storage.createAuditLog({
          userId: req.user.id,
          action,
          resource,
          resourceId: req.params.id || null,
          details: {
            method: req.method,
            url: req.originalUrl,
            statusCode,
            responseTime,
            userAgent: req.get('User-Agent'),
            body: req.method !== 'GET' ? req.body : undefined
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          companyId: req.user.companyId
        }).catch(console.error);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Company isolation middleware
export const companyIsolation = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Add company filter to query
    req.companyId = req.user.companyId;
    next();
    
  } catch (error) {
    console.error('Company isolation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Şifre en az 8 karakter olmalıdır' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Şifre en az bir büyük harf içermelidir' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Şifre en az bir küçük harf içermelidir' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Şifre en az bir rakam içermelidir' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Şifre en az bir özel karakter içermelidir' };
  }
  
  return { valid: true };
};

// Generate secure tokens
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// CORS configuration
export const corsConfig = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

export default {
  rateLimiter,
  authenticate,
  authorize,
  validateInput,
  sanitizeInput,
  xssProtection,
  auditLog,
  companyIsolation,
  validatePasswordStrength,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  corsConfig
};