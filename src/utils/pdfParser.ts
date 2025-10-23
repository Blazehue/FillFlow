/**
 * PDF Parser Utility
 * Extracts text positions and metadata from PDF files using PDF.js
 */

import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedFieldData, PDFDimensions } from '../types';

// Set up the worker - use local worker file from public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

/**
 * PDF Parser class
 */
export class PDFParser {
  /**
   * Load a PDF from a file
   */
  async loadPDF(file: File): Promise<pdfjsLib.PDFDocumentProxy> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      return pdf;
    } catch (error) {
      console.error('Error loading PDF:', error);
      throw new Error('Failed to load PDF file');
    }
  }

  /**
   * Get PDF dimensions
   */
  async getPDFDimensions(pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number = 1): Promise<PDFDimensions> {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.0 });
      
      return {
        width: viewport.width,
        height: viewport.height,
      };
    } catch (error) {
      console.error('Error getting PDF dimensions:', error);
      throw new Error('Failed to get PDF dimensions');
    }
  }

  /**
   * Extract text content with positions from a PDF page
   */
  async extractTextWithPositions(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNumber: number = 1
  ): Promise<ExtractedFieldData[]> {
    try {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });
      
      const extractedFields: ExtractedFieldData[] = [];

      textContent.items.forEach((item: any) => {
        if ('str' in item && item.str.trim()) {
          const transform = item.transform;
          
          // Extract position and font information
          const x = transform[4];
          const y = viewport.height - transform[5]; // Convert from PDF coords to canvas coords
          const fontSize = Math.abs(transform[3]); // Vertical scaling gives font size
          const width = item.width;
          const height = item.height;
          
          extractedFields.push({
            text: item.str,
            x,
            y,
            width,
            height,
            fontName: item.fontName || 'Unknown',
            fontSize,
          });
        }
      });

      return extractedFields;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Auto-detect form fields based on patterns
   */
  detectFormFields(extractedData: ExtractedFieldData[]): ExtractedFieldData[] {
    const formFields: ExtractedFieldData[] = [];
    
    // Common patterns for form field labels
    const labelPatterns = [
      /name/i,
      /address/i,
      /phone/i,
      /email/i,
      /date/i,
      /signature/i,
      /amount/i,
      /number/i,
      /city/i,
      /state/i,
      /zip/i,
      /country/i,
    ];

    extractedData.forEach((field) => {
      // Check if text matches any label pattern
      const isLabel = labelPatterns.some(pattern => pattern.test(field.text));
      
      if (isLabel) {
        formFields.push(field);
      }
    });

    return formFields;
  }

  /**
   * Group nearby text items (for multi-word labels)
   */
  groupNearbyText(
    extractedData: ExtractedFieldData[],
    maxDistance: number = 5
  ): ExtractedFieldData[] {
    const grouped: ExtractedFieldData[] = [];
    const processed = new Set<number>();

    extractedData.forEach((item, index) => {
      if (processed.has(index)) return;

      let group = [item];
      let currentY = item.y;

      // Look for nearby items on the same line
      for (let i = index + 1; i < extractedData.length; i++) {
        if (processed.has(i)) continue;

        const nextItem = extractedData[i];
        const yDiff = Math.abs(nextItem.y - currentY);

        if (yDiff <= maxDistance) {
          group.push(nextItem);
          processed.add(i);
        }
      }

      // Merge group into a single field
      if (group.length > 0) {
        const minX = Math.min(...group.map(g => g.x));
        const maxX = Math.max(...group.map(g => g.x + g.width));
        const avgY = group.reduce((sum, g) => sum + g.y, 0) / group.length;
        
        grouped.push({
          text: group.map(g => g.text).join(' '),
          x: minX,
          y: avgY,
          width: maxX - minX,
          height: item.height,
          fontName: item.fontName,
          fontSize: item.fontSize,
        });

        processed.add(index);
      }
    });

    return grouped;
  }

  /**
   * Convert PDF page to image (for background)
   */
  async convertPageToImage(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNumber: number = 1,
    scale: number = 2
  ): Promise<string> {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      } as any;

      await page.render(renderContext).promise;

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error converting PDF to image:', error);
      throw new Error('Failed to convert PDF page to image');
    }
  }

  /**
   * Get total number of pages
   */
  async getPageCount(pdf: pdfjsLib.PDFDocumentProxy): Promise<number> {
    return pdf.numPages;
  }

  /**
   * Extract metadata from PDF
   */
  async extractMetadata(pdf: pdfjsLib.PDFDocumentProxy): Promise<any> {
    try {
      const metadata = await pdf.getMetadata();
      return metadata.info;
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    }
  }
}

/**
 * Singleton instance
 */
let pdfParserInstance: PDFParser | null = null;

/**
 * Get the PDFParser singleton instance
 */
export const getPDFParser = (): PDFParser => {
  if (!pdfParserInstance) {
    pdfParserInstance = new PDFParser();
  }
  return pdfParserInstance;
};

/**
 * Helper function to analyze PDF and suggest field positions
 */
export const analyzePDFForFields = async (
  file: File
): Promise<{
  dimensions: PDFDimensions;
  suggestedFields: ExtractedFieldData[];
  backgroundImage: string;
}> => {
  const parser = getPDFParser();
  
  const pdf = await parser.loadPDF(file);
  const dimensions = await parser.getPDFDimensions(pdf);
  const extractedText = await parser.extractTextWithPositions(pdf);
  const groupedText = parser.groupNearbyText(extractedText);
  const suggestedFields = parser.detectFormFields(groupedText);
  const backgroundImage = await parser.convertPageToImage(pdf);

  return {
    dimensions,
    suggestedFields,
    backgroundImage,
  };
};
