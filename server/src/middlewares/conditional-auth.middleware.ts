import { Request, Response, NextFunction } from 'express';
import { SettingModel } from '../models/setting.model';
import { authMiddleware } from './auth.middleware';

// データベース接続を持つSettingModelのインスタンス
let settingModel: SettingModel;

export const setSettingModel = (model: SettingModel): void => {
  settingModel = model;
};

export const conditionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 設定を取得
    const settings = await settingModel.getSettings();
    const authRequired = settings ? settings.access_auth_required : true; // デフォルトは認証が必要

    if (authRequired) {
      // 認証が必要な場合は認証ミドルウェアを呼び出す
      authMiddleware(req, res, next);
    } else {
      // 認証が不要な場合は次のミドルウェアへ
      next();
    }
  } catch (error) {
    console.error('条件付き認証エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};