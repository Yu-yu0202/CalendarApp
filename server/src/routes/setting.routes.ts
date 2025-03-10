import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

export const createSettingRoutes = (settingController: SettingController): Router => {
  const router = Router();

  router.get('/', authMiddleware, adminMiddleware, settingController.getSettings);
  router.put('/', authMiddleware, adminMiddleware, settingController.updateSettings);

  return router;
};