import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Rate limiting configurations
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Çok fazla giriş denemesi yapıldı. 15 dakika sonra tekrar deneyin.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
};

export const apiRateLimit = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'API limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
    code: 'API_RATE_LIMIT_EXCEEDED'
  }
};

// Input validation middleware
export const validateInput = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Geçersiz veri formatı',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }
      next(error);
    }
  };
};

// SQL injection prevention
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/['";\\]/g, '')
        .replace(/(\b(DROP|DELETE|UPDATE|INSERT|SELECT|UNION|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '')
        .trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.keys(obj).forEach(key => {
        sanitized[key] = sanitize(obj[key]);
      });
      return sanitized;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};

// XSS prevention
export const preventXSS = (req: Request, res: Response, next: NextFunction) => {
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return escapeHtml(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      Object.keys(obj).forEach(key => {
        sanitized[key] = sanitizeObject(obj[key]);
      });
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function(body) {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    
    if (res.statusCode >= 400) {
      console.warn(`Security Alert: ${req.ip} - ${req.method} ${req.path} - Status: ${res.statusCode}`);
    }
    
    return originalSend.call(this, body);
  };

  next();
};

// File upload security
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const allowedMimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/csv'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (req.file) {
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Geçersiz dosya türü',
        allowedTypes: ['Excel (.xlsx, .xls)', 'CSV (.csv)']
      });
    }

    if (req.file.size > maxFileSize) {
      return res.status(400).json({
        error: 'Dosya çok büyük',
        maxSize: '10MB'
      });
    }

    const dangerousPatterns = [/\.exe$/, /\.bat$/, /\.cmd$/, /\.scr$/, /\.js$/, /\.php$/];
    if (dangerousPatterns.some(pattern => pattern.test(req.file!.originalname))) {
      return res.status(400).json({
        error: 'Güvenlik nedeniyle bu dosya türü kabul edilmiyor'
      });
    }
  }

  next();
};

// Permission middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Kimlik doğrulama gerekli' });
    }

    if (user.role === 'admin') {
      return next();
    }

    const rolePermissions: { [key: string]: string[] } = {
      'hr_manager': ['employees:read', 'employees:write', 'leaves:read', 'leaves:write', 'reports:read'],
      'employee': ['employees:read', 'leaves:read', 'leaves:write'],
      'viewer': ['employees:read', 'leaves:read', 'reports:read']
    };

    const userPermissions = rolePermissions[user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Bu işlem için yetkiniz bulunmuyor',
        required: permission,
        current: userPermissions
      });
    }

    next();
  };
};

// Audit logging
export const auditLog = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(body) {
      const user = (req as any).user;
      const logEntry = {
        timestamp: new Date().toISOString(),
        userId: user?.id || 'anonymous',
        action,
        resource,
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        status: res.statusCode,
        success: res.statusCode < 400
      };

      console.log('AUDIT LOG:', logEntry);
      return originalSend.call(this, body);
    };

    next();
  };
};

export default {
  authRateLimit,
  apiRateLimit,
  validateInput,
  sanitizeInput,
  preventXSS,
  requestLogger,
  validateFileUpload,
  requirePermission,
  auditLog
};