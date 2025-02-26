// src/types/PdfExport.ts
export interface LayoutSettings {
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter' | 'B5';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface StyleSettings {
  backgroundColor?: string;
  backgroundImage?: {
    url: string;
    position: 'background' | 'top' | 'left';
    opacity?: number;
  };
  fontFamily: string;
  fontSize: number;
}

export interface PdfExportSettings {
  layout: LayoutSettings;
  style: StyleSettings;
  includeEvents: boolean;
  includeHolidays: boolean;
}