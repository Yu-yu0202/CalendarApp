import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { conditionalAuthMiddleware } from '../middlewares/conditional-auth.middleware';

export const createEventRoutes = (eventController: EventController): Router => {
  const router = Router();

  // 認証が必要か設定に基づいて判断
  router.get('/', conditionalAuthMiddleware, eventController.getAllEvents);
  router.get('/range', conditionalAuthMiddleware, eventController.getEventsByDateRange);
  router.get('/:id', conditionalAuthMiddleware, eventController.getEventById);

  // 管理機能は常に認証が必要
  router.post('/', authMiddleware, adminMiddleware, eventController.createEvent);
  router.put('/:id', authMiddleware, adminMiddleware, eventController.updateEvent);
  router.delete('/:id', authMiddleware, adminMiddleware, eventController.deleteEvent);

  return router;
};