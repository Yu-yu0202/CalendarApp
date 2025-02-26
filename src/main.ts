import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { UserController } from './controller/UserController';
import { HolidayController } from './controller/HolidayController';
import { CalendarController } from './controller/CalendarController';
import { PdfController } from './controller/PdfController';

const app = express();
const port = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// データベース接続
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'calendar_user',
  password: process.env.DB_PASSWORD || 'secure_password',
  database: process.env.DB_NAME || 'calendar_db'
};

// コントローラーの初期化
const userController = new UserController(dbConfig);
const holidayController = new HolidayController(dbConfig);
const calendarController = new CalendarController(dbConfig);
const pdfController = new PdfController(dbConfig);

// ルーティング
app.post('/api/login', async (req, res) => {
  try {
    const user = await userController.login(req.body);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'ログインに失敗しました' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await calendarController.getEvents(
      req.query.userId,
      req.query.startDate,
      req.query.endDate
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'イベントの取得に失敗しました' });
  }
});

// Reactアプリケーションのルーティング
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
});