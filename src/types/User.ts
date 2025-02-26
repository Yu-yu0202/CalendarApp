// src/types/User.ts
export interface User {
  id: number;
  username: string;
  passwordHash?: string;
  role: 'admin' | 'normal';
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessSettings {
  userId: number;
  calendarAccess: boolean;
  pdfExport: boolean;
  updatedAt: Date;
}

export interface LoginResponse {
  id: number;
  username: string;
  role: 'admin' | 'normal';
  token: string;
}