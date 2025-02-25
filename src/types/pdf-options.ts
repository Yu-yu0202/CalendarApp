// src/types/pdf-options.ts
export interface PdfOptions {
  orientation: 'portrait' | 'landscape';
  backgroundImage: {
    path: string;
    position: 'background' | 'overlay' | 'sidebar';
    opacity?: number;
  };
  style: {
    fontSize: number;
    fontFamily: string;
    colors: {
      primary: string;
      secondary: string;
      holiday: string;
    };
  };
}

export interface CalendarPdfData {
  events: Array<{
    id: string;
    title: string;
    date: string;
    isHoliday: boolean;
  }>;
  options: PdfOptions;
}