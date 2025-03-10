import { Request, Response } from 'express';
import { EventModel } from '../models/event.model';

export class EventController {
  private eventModel: EventModel;

  constructor(eventModel: EventModel) {
    this.eventModel = eventModel;
  }

  getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.eventModel.findAll();
      res.status(200).json(events);
    } catch (error) {
      console.error('イベント取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  getEventsByDateRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        res.status(400).json({ message: '開始日と終了日が必要です' });
        return;
      }

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ message: '無効な日付形式です' });
        return;
      }

      const events = await this.eventModel.findByDateRange(startDate, endDate);
      res.status(200).json(events);
    } catch (error) {
      console.error('イベント範囲取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ message: '無効なイベントIDです' });
        return;
      }

      const event = await this.eventModel.findById(id);

      if (!event) {
        res.status(404).json({ message: 'イベントが見つかりません' });
        return;
      }

      res.status(200).json(event);
    } catch (error) {
      console.error('イベント詳細取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, startDate, endDate, isHoliday } = req.body;
      const userId = (req as any).user?.id; // 認証ミドルウェアからユーザーID取得

      if (!title || !startDate) {
        res.status(400).json({ message: 'タイトルと開始日は必須です' });
        return;
      }

      const newEvent = {
        title,
        description: description || null,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
        is_holiday: isHoliday || false,
        created_by: userId
      };

      const eventId = await this.eventModel.create(newEvent);
      res.status(201).json({
        message: 'イベントが作成されました',
        eventId
      });
    } catch (error) {
      console.error('イベント作成エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ message: '無効なイベントIDです' });
        return;
      }

      const { title, description, startDate, endDate, isHoliday } = req.body;
      const updateData: any = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (startDate !== undefined) updateData.start_date = new Date(startDate);
      if (endDate !== undefined) updateData.end_date = endDate ? new Date(endDate) : null;
      if (isHoliday !== undefined) updateData.is_holiday = isHoliday;

      const success = await this.eventModel.update(id, updateData);

      if (!success) {
        res.status(404).json({ message: 'イベントが見つかりません' });
        return;
      }

      res.status(200).json({ message: 'イベントが更新されました' });
    } catch (error) {
      console.error('イベント更新エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ message: '無効なイベントIDです' });
        return;
      }

      const success = await this.eventModel.delete(id);

      if (!success) {
        res.status(404).json({ message: 'イベントが見つかりません' });
        return;
      }

      res.status(200).json({ message: 'イベントが削除されました' });
    } catch (error) {
      console.error('イベント削除エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };
}