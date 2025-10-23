/**
 * PDFExporter Component
 * Handles PDF export with various options
 */

import React, { useState } from 'react';
import { useTemplate, useFormData, useNotifications } from '../context/FormContext';
import { usePDFGeneration } from '../hooks/usePDFGeneration';
import { ExportOptions } from '../types';
import './PDFExporter.css';

export const PDFExporter: React.FC = () => {
  const { template } = useTemplate();
  const { formData } = useFormData();
  const { addNotification } = useNotifications();
  const { exportPDF, isGenerating, progress } = usePDFGeneration();

  const [exportOptions, setExportOptions] = useState<Partial<ExportOptions>>({
    format: 'pdf',
    quality: 95,
    filename: 'filled-form',
    includeBackground: true,
  });

  const handleExport = async () => {
    if (!template) {
      addNotification('error', 'No template loaded');
      return;
    }

    const success = await exportPDF(template, formData, exportOptions);

    if (success) {
      addNotification('success', 'PDF exported successfully!');
    } else {
      addNotification('error', 'Failed to export PDF');
    }
  };

  const updateOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="pdf-exporter">
      <h3>Export Settings</h3>

      <div className="export-options">
        <div className="option-group">
          <label>File Name</label>
          <input
            type="text"
            value={exportOptions.filename}
            onChange={(e) => updateOption('filename', e.target.value)}
            className="option-input"
          />
        </div>

        <div className="option-group">
          <label>Format</label>
          <select
            value={exportOptions.format}
            onChange={(e) =>
              updateOption('format', e.target.value as ExportOptions['format'])
            }
            className="option-select"
          >
            <option value="pdf">PDF</option>
            <option value="png">PNG Image</option>
            <option value="jpg">JPG Image</option>
          </select>
        </div>

        {(exportOptions.format === 'png' || exportOptions.format === 'jpg') && (
          <div className="option-group">
            <label>Quality ({exportOptions.quality}%)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={exportOptions.quality}
              onChange={(e) => updateOption('quality', parseInt(e.target.value))}
              className="option-range"
            />
          </div>
        )}

        <div className="option-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={exportOptions.includeBackground}
              onChange={(e) => updateOption('includeBackground', e.target.checked)}
            />
            Include Background Image
          </label>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={isGenerating || !template}
        className="export-button"
      >
        {isGenerating ? `Exporting... ${Math.round(progress)}%` : '📥 Export PDF'}
      </button>

      {isGenerating && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
