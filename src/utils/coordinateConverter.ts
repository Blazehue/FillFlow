/**
 * Coordinate Converter Utility
 * Handles conversion between PDF, Canvas, and Screen coordinate systems
 */

import { CoordinateSystem, PDFDimensions } from '../types';

/**
 * Convert coordinates from one system to another
 * 
 * PDF coordinates: Origin at bottom-left, Y increases upward
 * Canvas coordinates: Origin at top-left, Y increases downward
 * Screen coordinates: Canvas coordinates with zoom/scale applied
 */

export class CoordinateConverter {
  private pdfDimensions: PDFDimensions;
  private canvasDimensions: PDFDimensions;
  private scale: number;
  private dpi: number;

  constructor(
    pdfDimensions: PDFDimensions,
    canvasDimensions: PDFDimensions,
    scale: number = 1,
    dpi: number = 72
  ) {
    this.pdfDimensions = pdfDimensions;
    this.canvasDimensions = canvasDimensions;
    this.scale = scale;
    this.dpi = dpi;
  }

  /**
   * Convert PDF coordinates to Canvas coordinates
   */
  pdfToCanvas(x: number, y: number): { x: number; y: number } {
    const scaleX = this.canvasDimensions.width / this.pdfDimensions.width;
    const scaleY = this.canvasDimensions.height / this.pdfDimensions.height;

    return {
      x: x * scaleX,
      y: this.canvasDimensions.height - (y * scaleY), // Flip Y axis
    };
  }

  /**
   * Convert Canvas coordinates to PDF coordinates
   */
  canvasToPdf(x: number, y: number): { x: number; y: number } {
    const scaleX = this.pdfDimensions.width / this.canvasDimensions.width;
    const scaleY = this.pdfDimensions.height / this.canvasDimensions.height;

    return {
      x: x * scaleX,
      y: (this.canvasDimensions.height - y) * scaleY, // Flip Y axis
    };
  }

  /**
   * Convert Canvas coordinates to Screen coordinates
   */
  canvasToScreen(x: number, y: number): { x: number; y: number } {
    return {
      x: x * this.scale,
      y: y * this.scale,
    };
  }

  /**
   * Convert Screen coordinates to Canvas coordinates
   */
  screenToCanvas(x: number, y: number): { x: number; y: number } {
    return {
      x: x / this.scale,
      y: y / this.scale,
    };
  }

  /**
   * Convert PDF coordinates to Screen coordinates
   */
  pdfToScreen(x: number, y: number): { x: number; y: number } {
    const canvas = this.pdfToCanvas(x, y);
    return this.canvasToScreen(canvas.x, canvas.y);
  }

  /**
   * Convert Screen coordinates to PDF coordinates
   */
  screenToPdf(x: number, y: number): { x: number; y: number } {
    const canvas = this.screenToCanvas(x, y);
    return this.canvasToPdf(canvas.x, canvas.y);
  }

  /**
   * Generic coordinate conversion
   */
  convert(
    x: number,
    y: number,
    from: CoordinateSystem,
    to: CoordinateSystem
  ): { x: number; y: number } {
    if (from === to) {
      return { x, y };
    }

    // Convert to canvas as intermediate step
    let canvasCoords: { x: number; y: number };

    switch (from) {
      case 'pdf':
        canvasCoords = this.pdfToCanvas(x, y);
        break;
      case 'screen':
        canvasCoords = this.screenToCanvas(x, y);
        break;
      default:
        canvasCoords = { x, y };
    }

    // Convert from canvas to target system
    switch (to) {
      case 'pdf':
        return this.canvasToPdf(canvasCoords.x, canvasCoords.y);
      case 'screen':
        return this.canvasToScreen(canvasCoords.x, canvasCoords.y);
      default:
        return canvasCoords;
    }
  }

  /**
   * Convert points to pixels (DPI conversion)
   */
  pointsToPixels(points: number): number {
    return (points * this.dpi) / 72;
  }

  /**
   * Convert pixels to points
   */
  pixelsToPoints(pixels: number): number {
    return (pixels * 72) / this.dpi;
  }

  /**
   * Snap coordinates to grid
   */
  snapToGrid(x: number, y: number, gridSize: number): { x: number; y: number } {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  }

  /**
   * Update scale (for zoom functionality)
   */
  updateScale(newScale: number): void {
    this.scale = newScale;
  }

  /**
   * Get current scale
   */
  getScale(): number {
    return this.scale;
  }

  /**
   * Calculate the scale factor to fit PDF in a container
   */
  static calculateFitScale(
    pdfDimensions: PDFDimensions,
    containerDimensions: PDFDimensions,
    padding: number = 20
  ): number {
    const scaleX = (containerDimensions.width - padding * 2) / pdfDimensions.width;
    const scaleY = (containerDimensions.height - padding * 2) / pdfDimensions.height;
    return Math.min(scaleX, scaleY);
  }
}

/**
 * Helper function to create a coordinate converter instance
 */
export const createCoordinateConverter = (
  pdfDimensions: PDFDimensions,
  canvasDimensions?: PDFDimensions,
  scale?: number,
  dpi?: number
): CoordinateConverter => {
  return new CoordinateConverter(
    pdfDimensions,
    canvasDimensions || pdfDimensions,
    scale,
    dpi
  );
};
