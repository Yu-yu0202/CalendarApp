// src/components/AdminPanel.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Holiday {
  id: string;
  title: string;
  date: string;
}

export const AdminPanel: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHoliday, setNewHoliday] = useState({
    title: '',
    date: ''
  });

  const fetchHolidays = async () => {
    const response = await axios.get('/api/holidays');
    setHolidays(response.data);
  };

  const addHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/holidays', newHoliday);
    setNewHoliday({ title: '', date: '' });
    await fetchHolidays();
  };

  return (
    <div className="admin-panel">
      <h1>管理パネル</h1>
      <form onSubmit={addHoliday}>
        <input
          type="text"
          value={newHoliday.title}
          onChange={(e) => setNewHoliday({...newHoliday, title: e.target.value})}
          placeholder="祝日名"
        />
        <input
          type="date"
          value={newHoliday.date}
          onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
        />
        <button type="submit">追加</button>
      </form>
      <div className="holiday-list">
        {holidays.map(holiday => (
          <div key={holiday.id} className="holiday-item">
            <span>{holiday.title}</span>
            <span>{holiday.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};