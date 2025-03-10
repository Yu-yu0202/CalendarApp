import { ResultSetHeader, RowDataPacket, Pool } from 'mysql2/promise';

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.db.execute<User[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length ? rows[0] : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [rows] = await this.db.execute<User[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows.length ? rows[0] : null;
  }

  async create(username: string, hashedPassword: string, isAdmin: boolean = false): Promise<number> {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
      [username, hashedPassword, isAdmin]
    );
    return result.insertId;
  }

  // 他のメソッド（更新、削除など）
}