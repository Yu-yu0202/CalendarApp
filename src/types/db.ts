import mysql from 'mysql2/promise';

export interface Database {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
}

export class DatabaseUtil implements Database {
  constructor(private connection: mysql.Connection) {}

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const [results] = await this.connection.query(sql, params);
    return results as T[];
  }
}