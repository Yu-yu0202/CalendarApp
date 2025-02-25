// src/utils/pdf-generator.ts
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import vfs from 'pdfmake/build/vfs_fonts.pdfmake';
import { CalendarPdfData } from '../types/pdf-options';

pdfMake.vfs = vfs;

export class PdfGenerator {
  static async generateCalendarPdf(data: CalendarPdfData): Promise<Buffer> {
    const docDefinition = {
      pageSize: data.options.orientation === 'portrait' ? 'A4' : 'A3',
      pageMargins: [40, 60, 40, 60],
      background: undefined,
      header: function(currentPage: { toString: () => any; }, pageCount: { toString: () => any; }) {
        return {
          text: `カレンダー ${currentPage.toString()} / ${pageCount.toString()}`,
          alignment: 'center',
          margin: [40, 20, 40, 20]
        };
      },
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*'],
            body: this.generateCalendarBody(data.events)
          }
        }
      ],
      styles: {
        header: {
          fontSize: data.options.style.fontSize,
          bold: true,
          fillColor: data.options.style.colors.primary,
          color: 'white'
        }
      }
    };

    if (data.options.backgroundImage) {
      const imageBuffer = await this.loadImage(data.options.backgroundImage.path);
      // @ts-ignore
      docDefinition.background = {
        image: 'backgroundImage',
        width: 100,
        height: 100,
        opacity: data.options.backgroundImage.opacity || 0.3
      };
    }

    // @ts-ignore
    const pdfDoc = pdfMake.createPdf(docDefinition);
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      pdfDoc.on('data', (chunk: any) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
    });
  }

  private static generateCalendarBody(events: CalendarPdfData['events']): string[][] {
    const header = ['日付', '予定', '種類'];
    const body = events.map(event => [
      event.date,
      event.title,
      event.isHoliday ? '祝日' : '予定'
    ]);
    return [header, ...body];
  }

  private static async loadImage(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      fs.readFile(path, (err: any, data: Buffer<ArrayBufferLike> | PromiseLike<Buffer<ArrayBufferLike>>) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}