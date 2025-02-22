require('dotenv').config();

import {createConnection} from 'mysql2/promise';

export const initDB = async () => {
    const connection = await createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'calendar'
    });

    await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        is_admin BOOLEAN DEFAULT FALSE,
        enabled BOOLEAN DEFAULT TRUE
    );`);

    await connection.execute(`
    CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT,
        is_holiday BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`);

    await connection.execute(`
    CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(255) PRIMARY KEY,
        auth_required BOOLEAN DEFAULT TRUE,
        last_updated_by VARCHAR(255),
        last_updated_at DATETIME
    );`);
}