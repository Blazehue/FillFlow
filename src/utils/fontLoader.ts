/**
 * Font Loader Utility
 * Handles loading custom fonts and making them available for PDF generation
 */

import { Font } from '../types';
import { jsPDF } from 'jspdf';

export class FontLoader {
  private fonts: Map<string, Font> = new Map();
  private loadedFonts: Set<string> = new Set();

  /**
   * Load a font from a URL or file path
   */
  async loadFont(fontConfig: Omit<Font, 'loaded'>): Promise<Font> {
    try {
      const fontFace = new FontFace(fontConfig.family, `url(${fontConfig.path})`);
      await fontFace.load();
      document.fonts.add(fontFace);

      const font: Font = {
        ...fontConfig,
        loaded: true,
      };

      this.fonts.set(fontConfig.name, font);
      this.loadedFonts.add(fontConfig.name);

      return font;
    } catch (error) {
      console.error(`Failed to load font ${fontConfig.name}:`, error);
      
      const font: Font = {
        ...fontConfig,
        loaded: false,
      };

      this.fonts.set(fontConfig.name, font);
      return font;
    }
  }

  /**
   * Load multiple fonts
   */
  async loadFonts(fontConfigs: Omit<Font, 'loaded'>[]): Promise<Font[]> {
    const promises = fontConfigs.map(config => this.loadFont(config));
    return Promise.all(promises);
  }

  /**
   * Get a loaded font by name
   */
  getFont(name: string): Font | undefined {
    return this.fonts.get(name);
  }

  /**
   * Get all loaded fonts
   */
  getAllFonts(): Font[] {
    return Array.from(this.fonts.values());
  }

  /**
   * Check if a font is loaded
   */
  isFontLoaded(name: string): boolean {
    return this.loadedFonts.has(name);
  }

  /**
   * Load font for jsPDF (requires base64 encoded font)
   */
  async loadFontForPDF(
    pdf: jsPDF,
    fontName: string,
    fontPath: string,
    fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal'
  ): Promise<void> {
    try {
      const response = await fetch(fontPath);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = this.arrayBufferToBase64(arrayBuffer);

      // Add font to jsPDF
      pdf.addFileToVFS(`${fontName}.ttf`, base64);
      pdf.addFont(`${fontName}.ttf`, fontName, fontStyle);
    } catch (error) {
      console.error(`Failed to load font ${fontName} for PDF:`, error);
      throw error;
    }
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return btoa(binary);
  }

  /**
   * Load system fonts (fallbacks)
   */
  loadSystemFonts(): Font[] {
    const systemFonts: Font[] = [
      {
        name: 'Helvetica',
        family: 'Helvetica',
        path: '',
        loaded: true,
      },
      {
        name: 'Times',
        family: 'Times New Roman',
        path: '',
        loaded: true,
      },
      {
        name: 'Courier',
        family: 'Courier New',
        path: '',
        loaded: true,
      },
      {
        name: 'Arial',
        family: 'Arial',
        path: '',
        loaded: true,
      },
    ];

    systemFonts.forEach(font => {
      this.fonts.set(font.name, font);
      this.loadedFonts.add(font.name);
    });

    return systemFonts;
  }

  /**
   * Preload fonts from the public/fonts directory
   */
  async preloadCustomFonts(fontPaths: string[]): Promise<Font[]> {
    const fontConfigs: Omit<Font, 'loaded'>[] = fontPaths.map(path => {
      const fileName = path.split('/').pop() || '';
      const fontName = fileName.replace(/\.(ttf|otf|woff|woff2)$/, '');
      
      return {
        name: fontName,
        family: fontName,
        path: path,
      };
    });

    return this.loadFonts(fontConfigs);
  }

  /**
   * Get font family with fallbacks
   */
  getFontFamilyWithFallbacks(fontFamily: string): string {
    const fallbacks = ['Arial', 'Helvetica', 'sans-serif'];
    return `${fontFamily}, ${fallbacks.join(', ')}`;
  }

  /**
   * Clear all loaded fonts
   */
  clear(): void {
    this.fonts.clear();
    this.loadedFonts.clear();
  }
}

// Singleton instance
let fontLoaderInstance: FontLoader | null = null;

/**
 * Get the FontLoader singleton instance
 */
export const getFontLoader = (): FontLoader => {
  if (!fontLoaderInstance) {
    fontLoaderInstance = new FontLoader();
    fontLoaderInstance.loadSystemFonts();
  }
  return fontLoaderInstance;
};

/**
 * Helper function to measure text width
 */
export const measureTextWidth = (
  text: string,
  fontSize: number,
  fontFamily: string
): number => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return 0;

  context.font = `${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(text);
  
  return metrics.width;
};

/**
 * Helper function to split text into lines based on max width
 */
export const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string
): string[] => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return [text];

  context.font = `${fontSize}px ${fontFamily}`;

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};
