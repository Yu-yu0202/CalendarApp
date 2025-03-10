import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (!user || !user.isAdmin) {
    res.status(403).json({ message: 'この操作には管理者権限が必要です' });
    return;
  }

  next();
};