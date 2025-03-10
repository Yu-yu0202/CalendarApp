import { ResultSetHeader, RowDataPacket, Pool } from 'mysql2/promise';

export interface Event extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  start_date: Date;
  end_date: Date | null;
  is_holiday: boolean;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export class EventModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async findAll(): Promise<Event[]> {
    const [rows] = await this.db.execute<Event[]>('SELECT * FROM events');
    return rows;
  }

  async findById(id: number): Promise<Event | null> {
    const [rows] = await this.db.execute<Event[]>(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );
    return rows.length ? rows[0] : null;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    const [rows] = await this.db.execute<Event[]>(
      'SELECT * FROM events WHERE start_date BETWEEN ? AND ?',
      [startDate, endDate]
    );
    return rows;
  }

  async create(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO events (title, description, start_date, end_date, is_holiday, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [event.title, event.description, event.start_date, event.end_date, event.is_holiday, event.created_by]
    );
    return result.insertId;
  }

  async update(id: number, event: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const sets: string[] = [];
    const values: any[] = [];

    Object.entries(event).forEach(([key, value]) => {
      sets.push(`${key} = ?`);
      values.push(value);
    });

    if (sets.length === 0) return false;

    values.push(id);

    const [result] = await this.db.execute<ResultSetHeader>(
      `UPDATE events SET ${sets.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.execute<ResultSetHeader>(
      'DELETE FROM events WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}