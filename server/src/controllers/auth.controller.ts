import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { SettingModel } from '../models/setting.model';

export class AuthController {
  private userModel: UserModel;
  private settingModel: SettingModel;
  private jwtSecret: string;

  constructor(userModel: UserModel, settingModel: SettingModel, jwtSecret: string) {
    this.userModel = userModel;
    this.settingModel = settingModel;
    this.jwtSecret = jwtSecret;
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: 'ユーザー名とパスワードが必要です' });
        return;
      }

      const user = await this.userModel.findByUsername(username);

      if (!user) {
        res.status(401).json({ message: 'ユーザー名またはパスワードが無効です' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: 'ユーザー名またはパスワードが無効です' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.is_admin },
        this.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.is_admin
        }
      });
    } catch (error) {
      console.error('ログインエラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password, isAdmin = false } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: 'ユーザー名とパスワードが必要です' });
        return;
      }

      const existingUser = await this.userModel.findByUsername(username);

      if (existingUser) {
        res.status(409).json({ message: 'ユーザー名が既に使用されています' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await this.userModel.create(username, hashedPassword, isAdmin);

      res.status(201).json({
        message: 'ユーザーが作成されました',
        user: {
          id: userId,
          username,
          isAdmin
        }
      });
    } catch (error) {
      console.error('登録エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };

  checkAuthRequired = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await this.settingModel.getSettings();
      const authRequired = settings ? settings.access_auth_required : true; // デフォルトは認証が必要

      res.status(200).json({ authRequired });
    } catch (error) {
      console.error('認証設定取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  };
}