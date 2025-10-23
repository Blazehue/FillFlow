/**
 * PDFPreview Component
 * Real-time preview of filled form on PDF background
 */

import React, { useRef, useEffect } from 'react';
import { useTemplate, useFields, useFormData } from '../context/FormContext';
import { wrapText } from '../utils/fontLoader';
import './PDFPreview.css';

export const PDFPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { template } = useTemplate();
  const { fields } = useFields();
  const { formData } = useFormData();

  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = template.pdfDimensions.width;
    canvas.height = template.pdfDimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render fields function
    const renderFieldsOnCanvas = (context: CanvasRenderingContext2D) => {
      fields.forEach((field) => {
        const value = formData[field.id];
        if (value === undefined || value === null || value === '') return;

        // Set font properties
        context.font = `${field.fontWeight} ${field.fontSize}px ${field.fontFamily}`;
        context.fillStyle = field.color;
        context.textAlign = field.alignment as CanvasTextAlign;

        const valueStr = String(value);

        // Calculate x position based on alignment
        let x = field.x;
        if (field.alignment === 'center' && field.maxWidth) {
          x = field.x + field.maxWidth / 2;
        } else if (field.alignment === 'right' && field.maxWidth) {
          x = field.x + field.maxWidth;
        }

        // Handle different field types
        if (field.type === 'checkbox') {
          const isChecked = value === true || value === 'true' || value === '1';
          if (isChecked) {
            context.fillText('✓', x, field.y + field.fontSize);
          }
        } else if (field.maxWidth && field.multiline) {
          // Wrap text for multiline fields
          const lines = wrapText(valueStr, field.maxWidth, field.fontSize, field.fontFamily);
          const lineHeight = field.fontSize * 1.2;

          lines.forEach((line, i) => {
            context.fillText(line, x, field.y + field.fontSize + i * lineHeight);
          });
        } else {
          // Single line text
          context.save();
          if (field.maxWidth) {
            // Clip text if it exceeds max width
            context.beginPath();
            context.rect(field.x, field.y, field.maxWidth, field.fontSize * 1.5);
            context.clip();
          }
          context.fillText(valueStr, x, field.y + field.fontSize);
          context.restore();
        }
      });
    };

    // Draw background image
    if (template.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderFieldsOnCanvas(ctx);
      };
      img.src = template.backgroundImage;
    } else {
      // Just render fields on white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      renderFieldsOnCanvas(ctx);
    }
  }, [template, fields, formData]);

  if (!template) {
    return (
      <div className="pdf-preview-empty">
        <p>No template loaded</p>
      </div>
    );
  }

  return (
    <div className="pdf-preview">
      <div className="preview-header">
        <h3>Live Preview</h3>
      </div>
      <div className="preview-canvas-container">
        <canvas ref={canvasRef} className="preview-canvas" />
      </div>
    </div>
  );
};
