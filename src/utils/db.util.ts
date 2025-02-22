import { Database } from '../types/db';

export class DatabaseUtil implements Database {
  connection: mysql.Connection;

  constructor(connection: mysql.Connection) {
    this.connection = connection;
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    return await this.connection.query(sql, params);
  }
}