/**
 * Custom hook for PDF generation
 * Handles PDF export using jsPDF with custom fonts and exact positioning
 */

import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { Template, FormData, ExportOptions } from '../types';
import { CoordinateConverter } from '../utils/coordinateConverter';
import { wrapText } from '../utils/fontLoader';

export const usePDFGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate PDF from template and form data
   */
  const generatePDF = useCallback(
    async (
      template: Template,
      formData: FormData,
      options: Partial<ExportOptions> = {}
    ): Promise<Blob | null> => {
      setIsGenerating(true);
      setProgress(0);
      setError(null);

      try {
        const {
          format = 'pdf',
          quality = 95,
          includeBackground = true,
        } = options;

        // Calculate PDF dimensions (convert to mm for jsPDF)
        const pdfWidth = template.pdfDimensions.width * 0.264583; // px to mm
        const pdfHeight = template.pdfDimensions.height * 0.264583; // px to mm

        // Create PDF document
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight],
        });

        setProgress(20);

        // Add background image if available
        if (includeBackground && template.backgroundImage) {
          try {
            pdf.addImage(
              template.backgroundImage,
              'PNG',
              0,
              0,
              pdfWidth,
              pdfHeight,
              undefined,
              'FAST'
            );
          } catch (err) {
            console.warn('Failed to add background image:', err);
          }
        }

        setProgress(40);

        // Create coordinate converter
        const converter = new CoordinateConverter(
          template.pdfDimensions,
          template.pdfDimensions
        );

        // Add form fields
        template.fields.forEach((field, index) => {
          const value = formData[field.id];
          if (value === undefined || value === null || value === '') return;

          // Convert coordinates from canvas to PDF
          const pdfCoords = converter.canvasToPdf(field.x, field.y);
          const xMm = pdfCoords.x * 0.264583; // px to mm
          const yMm = pdfCoords.y * 0.264583; // px to mm

          // Set font
          pdf.setFont(field.fontFamily || 'helvetica', field.fontWeight);
          pdf.setFontSize(field.fontSize);
          pdf.setTextColor(field.color || '#000000');

          // Handle text wrapping
          const maxWidthMm = field.maxWidth
            ? field.maxWidth * 0.264583
            : pdfWidth - xMm;

          const valueStr = String(value);

          if (field.type === 'checkbox') {
            // Draw checkbox
            const isChecked = value === true || value === 'true' || value === '1';
            if (isChecked) {
              pdf.setFontSize(field.fontSize);
              pdf.text('✓', xMm, yMm);
            }
          } else if (field.maxWidth && field.multiline) {
            // Wrap text for multiline fields
            const lines = wrapText(
              valueStr,
              field.maxWidth,
              field.fontSize,
              field.fontFamily
            );

            const lineHeight = field.fontSize * 1.2 * 0.264583; // Convert to mm
            lines.forEach((line, i) => {
              pdf.text(line, xMm, yMm + i * lineHeight, {
                align: field.alignment || 'left',
                maxWidth: maxWidthMm,
              });
            });
          } else {
            // Single line text
            pdf.text(valueStr, xMm, yMm, {
              align: field.alignment || 'left',
              maxWidth: maxWidthMm,
            });
          }

          setProgress(40 + (index / template.fields.length) * 50);
        });

        setProgress(95);

        // Generate blob based on format
        let blob: Blob;

        if (format === 'pdf') {
          blob = pdf.output('blob');
        } else {
          // Convert to image
          const canvas = await pdfToCanvas(pdf, quality);
          blob = await canvasToBlob(canvas, format, quality);
        }

        setProgress(100);
        return blob;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to generate PDF: ${errorMessage}`);
        console.error('PDF generation error:', err);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  /**
   * Export PDF with download
   */
  const exportPDF = useCallback(
    async (
      template: Template,
      formData: FormData,
      options: Partial<ExportOptions> = {}
    ): Promise<boolean> => {
      const blob = await generatePDF(template, formData, options);

      if (!blob) return false;

      try {
        const filename = options.filename || 'filled-form';
        const extension = options.format || 'pdf';
        saveAs(blob, `${filename}.${extension}`);
        return true;
      } catch (err) {
        setError('Failed to download file');
        console.error('Export error:', err);
        return false;
      }
    },
    [generatePDF]
  );

  /**
   * Batch export multiple records
   */
  const batchExport = useCallback(
    async (
      template: Template,
      records: FormData[],
      options: Partial<ExportOptions> = {}
    ): Promise<{ success: number; failed: number }> => {
      let success = 0;
      let failed = 0;

      setIsGenerating(true);
      setProgress(0);

      for (let i = 0; i < records.length; i++) {
        try {
          const recordOptions = {
            ...options,
            filename: `${options.filename || 'form'}_${i + 1}`,
          };

          const blob = await generatePDF(template, records[i], recordOptions);

          if (blob) {
            saveAs(blob, `${recordOptions.filename}.${options.format || 'pdf'}`);
            success++;
          } else {
            failed++;
          }
        } catch (err) {
          console.error(`Failed to export record ${i + 1}:`, err);
          failed++;
        }

        setProgress(((i + 1) / records.length) * 100);
      }

      setIsGenerating(false);
      return { success, failed };
    },
    [generatePDF]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    generatePDF,
    exportPDF,
    batchExport,
    isGenerating,
    progress,
    error,
    reset,
  };
};

/**
 * Helper: Convert jsPDF to canvas
 */
async function pdfToCanvas(pdf: jsPDF, quality: number): Promise<HTMLCanvasElement> {
  const imgData = pdf.output('datauristring');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = quality / 100;

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.onerror = reject;
    img.src = imgData;
  });
}

/**
 * Helper: Convert canvas to blob
 */
async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const qualityRatio = quality / 100;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      mimeType,
      qualityRatio
    );
  });
}
