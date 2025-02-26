// src/controller/UserController.ts
import { Database } from 'mysql2/promise';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserController {
  private db: Database;

  constructor(dbConfig: any) {
    this.db = dbConfig;
  }

  async login(username: string, password: string): Promise<any> {
    const [user] = await this.db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const isValidPassword = await compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('パスワードが正しくありません');
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      token: this.generateToken(user)
    };
  }

  private generateToken(user: any): string {
    const payload = {
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24時間
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}