import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    (req as any).user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);
      (req as any).user = decoded;
    }

    next();
  } catch (error) {
    next();
  }
}
