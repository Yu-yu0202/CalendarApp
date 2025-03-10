import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/login', authController.login);
  router.post('/register', authMiddleware, adminMiddleware, authController.register); // 管理者のみ新規ユーザー登録可能
  router.get('/check-auth-required', authController.checkAuthRequired);

  return router;
};