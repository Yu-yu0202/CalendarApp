// @ts-ignore
import express from 'express';
// @ts-ignore
import mysql from 'mysql2/promise';
import { initializeDatabase } from './db/schema';
import { AuthService } from './auth/auth.service';
import { AdminController } from './controllers/admin.controller';
import path from 'path';
import multer from "multer";
import { PdfGenerator } from "./utils/pdf-generator";
import {CalendarPdfData} from "./types/pdf-options";

const app = express();
app.use(express.json());
app.use(express.static('public'))
const upload = multer({ dest: 'uploads/' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: 'calendar'
};

async function bootstrap() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await initializeDatabase(connection);

    const authService = new AuthService();
    const adminController = new AdminController(connection);

    // @ts-ignore
    app.post('/api/admin/login', async (req: { body: { username: string; password: string; }; }, res: { json: (arg0: { token: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
      try {
        const token = await adminController.login(req.body);
        res.json({ token });
      } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
    // 管理パネル用ルーティング
    app.get('/api/holidays', async (_req,res) => {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: 'team_calendar'
        });
        const [results] = await connection.execute('SELECT * FROM events WHERE is_holiday = TRUE');
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: 'データベースエラー' });
      }
    });
    app.post('/api/holidays', async (req, res) => {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: 'team_calendar'
        });
        const result = await connection.execute(
          'INSERT INTO events (title, date, is_holiday) VALUES (?, ?, TRUE)',
          [req.body.title, req.body.date]
        );
        // @ts-ignore
        res.json({ id: result[0].insertId, ...req.body });
      } catch (error) {
        res.status(500).json({ error: 'データベースエラー' });
      }
    });
    app.get('/api/events', async (req, res) => {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: 'team_calendar'
        });
        const [results] = await connection.execute(
          'SELECT * FROM events WHERE YEAR(date) = ? AND MONTH(date) = ?',
          [req.query.year, req.query.month]
        );
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: 'データベースエラー' });
      }
    });
    app.post('/api/calendar/pdf', upload.single('backgroundImage'), async (req, res) => {
      try {
        const data: CalendarPdfData = {
          events: await getEventsFromDatabase(),
          options: req.body.options
        };

        if (req.file) {
          data.options.backgroundImage = {
            path: req.file.path,
            position: req.body.position || 'background',
            opacity: req.body.opacity
          };
        }

        const pdfBuffer = await PdfGenerator.generateCalendarPdf(data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=calendar.pdf');
        res.send(pdfBuffer);
      } catch (error) {
        res.status(500).json({ error: 'PDF生成エラー' });
      }
    });

    function getEventsFromDatabase(): Promise<CalendarPdfData['events']> {
      // データベースから予定を取得するロジック
      return Promise.resolve([
        {
          id: '1',
          title: '新年',
          date: '2025-01-01',
          isHoliday: true
        }
      ]);
    }
    app.get('/admin', (_req, res) => {
      res.sendFile(path.join(__dirname, '../public/admin/index.html'));
    });
    app.get('/calendar', (_req, res) => {
      res.sendFile(path.join(__dirname, '../public/calendar/index.html'));
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('アプリケーション起動時にエラーが発生しました:', error);
    process.exit(1);
  }
}

bootstrap().then(() => {console.log('server is OK')});