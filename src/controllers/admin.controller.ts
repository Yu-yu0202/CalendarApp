import { Database } from '../types/db';
import { DatabaseUtil } from '../utils/db.util';

export class AdminController {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAdminPassword(): Promise<string | null> {
    const [result] = await this.db.query<{ password_hash: string }>(
      'SELECT password_hash FROM users WHERE is_admin = TRUE LIMIT 1'
    );
    return result?.password_hash || null;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const [result] = await this.db.query<{ is_admin: boolean }>(
      'SELECT is_admin FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    return result?.is_admin || false;
  }
}