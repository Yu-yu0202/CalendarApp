import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: '認証が必要です' });
      return;
    }

    const token = authHeader.split(' ')[1]; // Bearer [token]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('認証エラー:', error);
    res.status(401).json({ message: '無効なトークンです' });
  }
};