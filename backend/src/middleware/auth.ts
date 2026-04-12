import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}

export function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ id: userId, email }, secret, {
    expiresIn: '24h' as any,
  });
}
