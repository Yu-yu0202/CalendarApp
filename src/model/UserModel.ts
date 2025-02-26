// src/model/UserModel.ts
import { Database } from 'mysql2/promise';

export class UserModel {
  private db: Database;

  constructor(dbConfig: any) {
    this.db = dbConfig;
  }

  async createUser(user: User): Promise<number> {
    const [result] = await this.db.execute(
      'INSERT INTO users SET ?',
      user
    );
    return result.insertId;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await this.db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return user[0] || null;
  }
}