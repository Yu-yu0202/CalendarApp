import { ResultSetHeader, RowDataPacket, Pool } from 'mysql2/promise';

export interface Setting extends RowDataPacket {
  id: number;
  access_auth_required: boolean;
  updated_by: number | null;
  updated_at: Date;
}

export class SettingModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async getSettings(): Promise<Setting | null> {
    const [rows] = await this.db.execute<Setting[]>('SELECT * FROM settings LIMIT 1');
    return rows.length ? rows[0] : null;
  }

  async updateSettings(settings: Partial<Omit<Setting, 'id' | 'updated_at'>>, updatedBy: number): Promise<boolean> {
    const sets: string[] = [];
    const values: any[] = [];

    Object.entries(settings).forEach(([key, value]) => {
      sets.push(`${key} = ?`);
      values.push(value);
    });

    if (sets.length === 0) return false;

    sets.push('updated_by = ?');
    values.push(updatedBy);

    // まず設定が存在するか確認
    const currentSettings = await this.getSettings();

    if (!currentSettings) {
      // 設定が存在しない場合は作成
      const columns = [...Object.keys(settings), 'updated_by'];
      const placeholders = Array(columns.length).fill('?').join(', ');

      const [result] = await this.db.execute<ResultSetHeader>(
        `INSERT INTO settings (${columns.join(', ')}) VALUES (${placeholders})`,
        values
      );
      return result.affectedRows > 0;
    } else {
      // 設定が存在する場合は更新
      const [result] = await this.db.execute<ResultSetHeader>(
        `UPDATE settings SET ${sets.join(', ')} WHERE id = ?`,
        [...values, currentSettings.id]
      );
      return result.affectedRows > 0;
    }
  }
}