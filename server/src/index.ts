import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// モデルのインポート
import { UserModel } from './models/user.model';
import { EventModel } from './models/event.model';
import { SettingModel } from './models/setting.model';

// コントローラーのインポート
import { AuthController } from './controllers/auth.controller';
import { EventController } from './controllers/event.controller';
import { SettingController } from './controllers/setting.controller';

// ルートのインポート
import { createAuthRoutes } from './routes/auth.routes';
import { createEventRoutes } from './routes/event.routes';
import { createSettingRoutes } from './routes/setting.routes';

// ミドルウェアのインポート
import { setSettingModel } from './middlewares/conditional-auth.middleware';

// 環境変数の読み込み
dotenv.config();

// データベース接続
const createDbConnection = async () => {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'calendar_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

// アプリケーションの初期化
const initApp = async () => {
  const app = express();
  const port = process.env.PORT || 3000;
  const jwtSecret = process.env.JWT_SECRET || 'default_secret';

  // データベース接続
  const db = await createDbConnection();

  // モデルのインスタンス化
  const userModel = new UserModel(db);
  const eventModel = new EventModel(db);
  const settingModel = new SettingModel(db);

  // 条件付き認証ミドルウェアにSettingModelを設定
  setSettingModel(settingModel);

  // コントローラーのインスタンス化
  const authController = new AuthController(userModel, settingModel, jwtSecret);
  const eventController = new EventController(eventModel);
  const settingController = new SettingController(settingModel);

  // ミドルウェアの設定
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ルートの設定
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/events', createEventRoutes(eventController));
  app.use('/api/settings', createSettingRoutes(settingController));

  // サーバー起動
  app.listen(port, () => {
    console.log(`サーバーが起動しました: http://localhost:${port}`);
  });

  // 初期管理者ユーザーの作成（存在しない場合）
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const admin = await userModel.findByUsername(adminUsername);

    if (!admin) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.default.hash(adminPassword, 10);
      await userModel.create(adminUsername, hashedPassword, true);
      console.log(`初期管理者ユーザーが作成されました: ${adminUsername}`);
    }
  } catch (error) {
    console.error('初期管理者ユーザー作成エラー:', error);
  }
};

// アプリケーションの起動
initApp().catch(error => {
  console.error('アプリケーション起動エラー:', error);
});