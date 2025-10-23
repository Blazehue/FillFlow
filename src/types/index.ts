/**
 * Type definitions for PDF Form Filler Application
 */

export type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea';

export type TextAlignment = 'left' | 'center' | 'right';

export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface PDFDimensions {
  width: number;
  height: number;
}

export interface FieldPosition {
  x: number;
  y: number;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: FontWeight;
  color: string;
  maxWidth?: number;
  alignment: TextAlignment;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: string[]; // For dropdown fields
  multiline?: boolean; // For text areas
  maxLength?: number;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    errorMessage?: string;
  };
}

export interface Template {
  id: string;
  templateName: string;
  pdfDimensions: PDFDimensions;
  backgroundImage: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface FormData {
  [fieldId: string]: string | number | boolean;
}

export interface PDFSettings {
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom';
  orientation: 'portrait' | 'landscape';
  customDimensions?: PDFDimensions;
  quality: number; // 1-100
  dpi: number;
}

export interface Font {
  name: string;
  family: string;
  path: string;
  loaded: boolean;
  variants?: {
    normal?: string;
    bold?: string;
    italic?: string;
    boldItalic?: string;
  };
}

export interface ZoomState {
  level: number; // 0.1 to 5
  offsetX: number;
  offsetY: number;
}

export interface GridSettings {
  enabled: boolean;
  size: number; // Grid cell size in pixels
  snapToGrid: boolean;
  showGuides: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg';
  quality: number;
  filename: string;
  includeBackground: boolean;
}

export interface BatchRecord {
  id: string;
  data: FormData;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface AppState {
  currentTemplate: Template | null;
  formData: FormData;
  selectedFieldId: string | null;
  zoom: ZoomState;
  grid: GridSettings;
  pdfSettings: PDFSettings;
  fonts: Font[];
  isPreviewVisible: boolean;
  isLoading: boolean;
  notifications: NotificationMessage[];
}

export interface TextItem {
  str: string; // Text content
  transform: number[]; // Transformation matrix [a, b, c, d, e, f]
  width: number;
  height: number;
  fontName: string;
  dir: string; // Text direction (ltr/rtl)
}

export interface ExtractedFieldData {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
}

// Coordinate conversion types
export type CoordinateSystem = 'pdf' | 'canvas' | 'screen';

export interface Coordinates {
  x: number;
  y: number;
  system: CoordinateSystem;
}
