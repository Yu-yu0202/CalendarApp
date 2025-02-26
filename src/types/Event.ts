// src/types/Event.ts
export interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  userId: number;
  type: 'event' | 'holiday' | 'appointment';
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent extends Event {
  isAllDay: boolean;
  recurrenceRule?: string;
  color?: string;
}

export interface Holiday extends Event {
  name: string;
  isNationalHoliday: boolean;
}
