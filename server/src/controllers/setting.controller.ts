import { Request, Response } from 'express';
import { SettingModel } from '../models/setting.model';

export class SettingController {
  private settingModel: SettingModel;

  constructor(settingModel: SettingModel) {
    this.settingModel = settingModel;
  }

  getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.settingModel.getSettings();
      res.status(200).json(settings || { access_auth_required: true });
    } catch (error) {
      console.error('設定取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { accessAuthRequired } = req.body;
      const userId = (req as any).user.id; // 認証ミドルウェアからユーザーID取得

      if (accessAuthRequired === undefined) {
        res.status(400).json({ message: '更新する設定値が必要です' });
        return;
      }

      const updateData = {
        access_auth_required: accessAuthRequired
      };

      const success = await this.settingModel.updateSettings(updateData, userId);

      if (!success) {
        res.status(500).json({ message: '設定の更新に失敗しました' });
        return;
      }

      res.status(200).json({ message: '設定が更新されました' });
    } catch (error) {
      console.error('設定更新エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };
}