// src/components/Calendar.tsx
import React, { useState } from 'react';
import axios from 'axios';


export const Calendar: React.FC = () => {
  const [pdfOptions, setPdfOptions] = useState({
    orientation: 'portrait',
    backgroundImage: null,
    style: {
      fontSize: 12,
      fontFamily: 'Helvetica',
      colors: {
        primary: '#2196F3',
        secondary: '#9E9E9E',
        holiday: '#FF5722'
      }
    }
  });

  const handleExport = async () => {
    const formData = new FormData();
    if (pdfOptions.backgroundImage) {
      formData.append('backgroundImage', pdfOptions.backgroundImage);
    }
    formData.append('options', JSON.stringify(pdfOptions));

    try {
      const response = await axios.post('/api/calendar/pdf', formData, {
        responseType: 'blob'
      });
      // @ts-ignore
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'calendar.pdf';
      link.click();
    } catch (error) {
      console.error('PDF出力エラー:', error);
    }
  };
  interface BackgroundImage {
    position: 'background' | 'overlay' | 'sidebar';
  }

  interface PdfOptions {
    backgroundImage?: BackgroundImage;
  }

  const [pdfOptions, setPdfOptions] = useState<PdfOptions>({
    backgroundImage: undefined
  });
  return (
    <div className="calendar-container">
      <div className="calendar-settings">
        <select
          value={pdfOptions.orientation}
          onChange={(e) => setPdfOptions({...pdfOptions, orientation: e.target.value})}
        >
          <option value="portrait">縦向き</option>
          <option value="landscape">横向き</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              // @ts-ignore
              setPdfOptions({
                ...pdfOptions,
                backgroundImage: e.target.files[0]
              });
            }
          }}
        />

        <select
          value= {pdfOptions.backgroundImage?.position ?? 'background'}
          onChange={(e) => {
            const newPosition = e.target.value as 'background' | 'overlay' | 'sidebar';
            setPdfOptions(prev => ({
              ...prev,
              backgroundImage: prev.backgroundImage ? {
                ...prev.backgroundImage,
                position: newPosition
              } : { position: newPosition }
            }));
          }}
        >
          <option value="background">背景</option>
          <option value="overlay">上部</option>
          <option value="sidebar">左側</option>
        </select>
      </div>

      <button onClick={handleExport}>PDF出力</button>
    </div>
  );
};