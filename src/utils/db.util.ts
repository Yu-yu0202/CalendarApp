import { Database } from '../types/db';
// @ts-ignore
import mysql from "mysql2/promise";

export class DatabaseUtil implements Database {
  connection: mysql.Connection;

  constructor(connection: mysql.Connection) {
    this.connection = connection;
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    return await this.connection.query(sql, params);
  }
}