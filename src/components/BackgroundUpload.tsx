/**
 * BackgroundUpload Component
 * Handles PDF/image upload and background display
 */

import React, { useRef, useState } from 'react';
import { useTemplate, useNotifications } from '../context/FormContext';
import { analyzePDFForFields } from '../utils/pdfParser';
import './BackgroundUpload.css';

interface BackgroundUploadProps {
  onFieldsDetected?: (fields: any[]) => void;
}

export const BackgroundUpload: React.FC<BackgroundUploadProps> = ({
  onFieldsDetected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { template, updateTemplate } = useTemplate();
  const { addNotification } = useNotifications();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isPDF && !isImage) {
      addNotification('error', 'Please upload a PDF or image file');
      return;
    }

    setIsProcessing(true);

    try {
      if (isPDF) {
        await handlePDFUpload(file);
      } else {
        await handleImageUpload(file);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      addNotification('error', 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      const analysis = await analyzePDFForFields(file);

      updateTemplate({
        pdfDimensions: analysis.dimensions,
        backgroundImage: analysis.backgroundImage,
      });

      addNotification(
        'success',
        `PDF loaded successfully! Found ${analysis.suggestedFields.length} potential fields.`
      );

      if (onFieldsDetected && analysis.suggestedFields.length > 0) {
        onFieldsDetected(analysis.suggestedFields);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleImageUpload = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          updateTemplate({
            pdfDimensions: {
              width: img.width,
              height: img.height,
            },
            backgroundImage: e.target?.result as string,
          });

          addNotification('success', 'Background image loaded successfully!');
          resolve();
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({
          target: fileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="background-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {!template?.backgroundImage ? (
        <div
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleBrowseClick}
        >
          {isProcessing ? (
            <div className="processing">
              <div className="spinner"></div>
              <p>Processing file...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <h3>Upload PDF Template</h3>
              <p>Drag and drop a PDF or image file here, or click to browse</p>
              <p className="file-types">Supported: PDF, PNG, JPG</p>
            </>
          )}
        </div>
      ) : (
        <div className="background-preview">
          <div className="preview-header">
            <h4>Background Loaded</h4>
            <button onClick={handleBrowseClick} className="change-btn">
              Change Background
            </button>
          </div>
          <div className="preview-info">
            <span>
              Dimensions: {template.pdfDimensions.width} × {template.pdfDimensions.height}px
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
