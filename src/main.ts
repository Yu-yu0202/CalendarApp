// @ts-ignore
import express from 'express';
// @ts-ignore
import mysql from 'mysql2/promise';
import { initializeDatabase } from './db/schema';
import { AuthService } from './auth/auth.service';
import { AdminController } from './controllers/admin.controller';
import { DatabaseUtil } from './utils/db.util';

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'team_calendar'
};

async function bootstrap() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await initializeDatabase(connection);

    const authService = new AuthService();
    const adminController = new AdminController(connection);

    app.post('/api/admin/login', async (req: { body: { username: string; password: string; }; }, res: { json: (arg0: { token: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
      try {
        const token = await adminController.login(req.body);
        res.json({ token });
      } catch (error) {
        res.status(401).json({ error: 'Invalid credentials' });
      }
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