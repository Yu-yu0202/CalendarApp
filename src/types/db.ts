import mysql from 'mysql2/promise';

export interface Database {
  connection: mysql.Connection;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
}