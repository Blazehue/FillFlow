/**
 * Font Matcher Utility
 * Matches PDF fonts to available system/custom fonts and provides fallbacks
 */

import { Font } from '../types';

interface FontMapping {
  pdfFont: string;
  systemFont: string;
  fallbacks: string[];
}

/**
 * Common PDF font to system font mappings
 */
const FONT_MAPPINGS: FontMapping[] = [
  {
    pdfFont: 'Helvetica',
    systemFont: 'Arial',
    fallbacks: ['Helvetica', 'Arial', 'sans-serif'],
  },
  {
    pdfFont: 'Helvetica-Bold',
    systemFont: 'Arial',
    fallbacks: ['Helvetica', 'Arial', 'sans-serif'],
  },
  {
    pdfFont: 'Times-Roman',
    systemFont: 'Times New Roman',
    fallbacks: ['Times', 'Times New Roman', 'serif'],
  },
  {
    pdfFont: 'Times-Bold',
    systemFont: 'Times New Roman',
    fallbacks: ['Times', 'Times New Roman', 'serif'],
  },
  {
    pdfFont: 'Courier',
    systemFont: 'Courier New',
    fallbacks: ['Courier', 'Courier New', 'monospace'],
  },
  {
    pdfFont: 'Courier-Bold',
    systemFont: 'Courier New',
    fallbacks: ['Courier', 'Courier New', 'monospace'],
  },
  {
    pdfFont: 'Symbol',
    systemFont: 'Symbol',
    fallbacks: ['Symbol', 'serif'],
  },
  {
    pdfFont: 'ZapfDingbats',
    systemFont: 'Zapf Dingbats',
    fallbacks: ['Zapf Dingbats', 'serif'],
  },
];

/**
 * Font Matcher class
 */
export class FontMatcher {
  private customFonts: Map<string, Font>;
  private fontMappings: Map<string, FontMapping>;

  constructor(customFonts: Font[] = []) {
    this.customFonts = new Map(customFonts.map(font => [font.name.toLowerCase(), font]));
    this.fontMappings = new Map(FONT_MAPPINGS.map(m => [m.pdfFont.toLowerCase(), m]));
  }

  /**
   * Match a PDF font to the best available system font
   */
  matchFont(pdfFontName: string): string {
    const normalizedName = pdfFontName.toLowerCase();

    // First, check if we have a custom font with this exact name
    if (this.customFonts.has(normalizedName)) {
      const customFont = this.customFonts.get(normalizedName);
      return customFont?.family || pdfFontName;
    }

    // Check predefined mappings
    const mapping = this.fontMappings.get(normalizedName);
    if (mapping) {
      return mapping.systemFont;
    }

    // Try to extract base font name (remove -Bold, -Italic, etc.)
    const baseFontName = pdfFontName.replace(/-(Bold|Italic|BoldItalic|Oblique)/gi, '');
    const normalizedBaseName = baseFontName.toLowerCase();

    if (this.fontMappings.has(normalizedBaseName)) {
      const baseMapping = this.fontMappings.get(normalizedBaseName);
      return baseMapping?.systemFont || pdfFontName;
    }

    // If no match found, return the original name (browser will use fallback)
    return pdfFontName;
  }

  /**
   * Get font fallback chain
   */
  getFontFallbacks(pdfFontName: string): string[] {
    const normalizedName = pdfFontName.toLowerCase();
    const mapping = this.fontMappings.get(normalizedName);

    if (mapping) {
      return mapping.fallbacks;
    }

    // Default fallbacks based on font characteristics
    if (this.isSansSerif(pdfFontName)) {
      return ['Arial', 'Helvetica', 'sans-serif'];
    } else if (this.isMonospace(pdfFontName)) {
      return ['Courier New', 'Courier', 'monospace'];
    } else {
      return ['Times New Roman', 'Times', 'serif'];
    }
  }

  /**
   * Get complete font family string with fallbacks
   */
  getFontFamily(pdfFontName: string): string {
    const primaryFont = this.matchFont(pdfFontName);
    const fallbacks = this.getFontFallbacks(pdfFontName);
    
    // Remove duplicates and create font family string
    const uniqueFonts = Array.from(new Set([primaryFont, ...fallbacks]));
    return uniqueFonts.map(font => {
      // Quote font names with spaces
      return font.includes(' ') ? `"${font}"` : font;
    }).join(', ');
  }

  /**
   * Extract font weight from PDF font name
   */
  getFontWeight(pdfFontName: string): 'normal' | 'bold' {
    return pdfFontName.toLowerCase().includes('bold') ? 'bold' : 'normal';
  }

  /**
   * Extract font style from PDF font name
   */
  getFontStyle(pdfFontName: string): 'normal' | 'italic' | 'oblique' {
    const normalized = pdfFontName.toLowerCase();
    if (normalized.includes('italic')) return 'italic';
    if (normalized.includes('oblique')) return 'oblique';
    return 'normal';
  }

  /**
   * Check if font is sans-serif
   */
  private isSansSerif(fontName: string): boolean {
    const sansSerifPatterns = ['helvetica', 'arial', 'verdana', 'tahoma', 'trebuchet'];
    const normalized = fontName.toLowerCase();
    return sansSerifPatterns.some(pattern => normalized.includes(pattern));
  }

  /**
   * Check if font is monospace
   */
  private isMonospace(fontName: string): boolean {
    const monospacePatterns = ['courier', 'monaco', 'consolas', 'monospace'];
    const normalized = fontName.toLowerCase();
    return monospacePatterns.some(pattern => normalized.includes(pattern));
  }

  /**
   * Add custom font mapping
   */
  addFontMapping(pdfFont: string, systemFont: string, fallbacks: string[]): void {
    this.fontMappings.set(pdfFont.toLowerCase(), {
      pdfFont,
      systemFont,
      fallbacks,
    });
  }

  /**
   * Add custom font
   */
  addCustomFont(font: Font): void {
    this.customFonts.set(font.name.toLowerCase(), font);
  }

  /**
   * Calculate proper line height for a font
   */
  getLineHeight(fontSize: number, fontFamily: string): number {
    // Standard line height is typically 1.2 to 1.5 times the font size
    const lineHeightRatio = 1.2;
    return fontSize * lineHeightRatio;
  }

  /**
   * Estimate font metrics (ascent, descent, etc.)
   */
  getFontMetrics(fontSize: number): {
    ascent: number;
    descent: number;
    lineHeight: number;
  } {
    // These are approximate values
    const ascent = fontSize * 0.8;
    const descent = fontSize * 0.2;
    const lineHeight = fontSize * 1.2;

    return { ascent, descent, lineHeight };
  }
}

/**
 * Create a font matcher instance
 */
export const createFontMatcher = (customFonts: Font[] = []): FontMatcher => {
  return new FontMatcher(customFonts);
};

/**
 * Helper function to normalize font name
 */
export const normalizeFontName = (fontName: string): string => {
  return fontName.trim().replace(/\s+/g, ' ');
};

/**
 * Helper function to check if a font is available in the browser
 */
export const isFontAvailable = async (fontFamily: string): Promise<boolean> => {
  if (!document.fonts) return false;

  try {
    await document.fonts.load(`12px ${fontFamily}`);
    return document.fonts.check(`12px ${fontFamily}`);
  } catch (error) {
    console.error(`Error checking font availability for ${fontFamily}:`, error);
    return false;
  }
};
