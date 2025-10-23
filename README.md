# PDF Form Filler Application

A powerful React-based PDF form filler that allows users to input data into forms and automatically generates filled PDFs with exact positioning, fonts, and formatting matching the original PDF template.

## Features

### ✨ Core Features

- **PDF Background Upload**: Upload PDF files or images as form backgrounds
- **Visual Field Mapper**: Interactive drag-and-drop field positioning on PDF canvas
- **Dynamic Form Generation**: Automatically generated input forms based on configured fields
- **Live Preview**: Real-time preview of filled form on PDF background
- **PDF Export**: Generate high-quality PDFs with exact positioning and formatting
- **Template Management**: Save, load, import, and export form templates

### 🎨 Field Types Supported

- Text Input
- Number Input
- Date Input
- Text Area (multi-line)
- Checkbox
- Dropdown/Select

### 🛠️ Advanced Features

- **Auto-Detection**: Automatically detect potential form fields from uploaded PDFs
- **Precise Positioning**: Pixel-perfect field positioning with coordinate system
- **Custom Fonts**: Support for custom font loading and rendering
- **Grid System**: Optional grid overlay for precise alignment
- **Zoom Controls**: Zoom in/out for detailed field positioning
- **Field Properties**: Extensive field customization (font, size, color, alignment, etc.)
- **Export Formats**: Export as PDF, PNG, or JPG
- **Template Import/Export**: Share templates as JSON files
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Installation

1. **Navigate to the project directory**
```bash
cd pdf-form-filler
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Usage Guide

### 1. Upload a Background

- Click the upload area or drag-and-drop a PDF or image file
- Supported formats: PDF, PNG, JPG
- The PDF will be analyzed for potential form fields

### 2. Add Fields

**Method 1: Click to Add**
- Click anywhere on the PDF canvas to add a new field
- The field will appear at the clicked position

**Method 2: Auto-Detection** (for PDFs)
- When uploading a PDF, the app will automatically detect potential fields
- Review and adjust the suggested fields

### 3. Position Fields

- **Drag & Drop**: Click and drag fields to reposition them
- **Grid**: Enable grid overlay for precise alignment
- **Zoom**: Use zoom controls for detailed positioning
- **Properties**: Use Field Properties tab to set exact X/Y coordinates

### 4. Configure Fields

Select a field and edit its properties:
- **Label**: Display name in the form
- **Type**: text, number, date, textarea, checkbox, dropdown
- **Position**: X, Y coordinates
- **Font**: Family, size, weight, color
- **Alignment**: Left, center, right
- **Max Width**: Maximum text width (for wrapping)
- **Required**: Mark field as required

### 5. Fill the Form

- Switch to "Form Data" tab
- Fill in the values for each field
- See live preview in the right panel

### 6. Export

- Configure export settings:
  - File name
  - Format (PDF, PNG, JPG)
  - Quality (for images)
  - Include background option
- Click "Export PDF" button
- File will be downloaded automatically

### 7. Save Template

- Click "Save Template" to save to browser localStorage
- Click "Export Template" to download as JSON file
- Click "Import Template" to load a saved template

## Project Structure

```
pdf-form-filler/
├── public/
│   ├── fonts/              # Custom fonts directory
│   └── backgrounds/        # Background images storage
├── src/
│   ├── components/         # React components
│   │   ├── BackgroundUpload.tsx
│   │   ├── FieldMapper.tsx
│   │   ├── FormEditor.tsx
│   │   ├── PDFPreview.tsx
│   │   ├── PDFExporter.tsx
│   │   └── Notifications.tsx
│   ├── context/           # React Context for state management
│   │   └── FormContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── usePDFGeneration.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── coordinateConverter.ts
│   │   ├── fontLoader.ts
│   │   ├── fontMatcher.ts
│   │   ├── pdfParser.ts
│   │   └── templateSaver.ts
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Application entry point
└── package.json
```

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **jsPDF**: PDF generation
- **PDF.js**: PDF parsing and text extraction
- **pdf-lib**: PDF manipulation
- **react-draggable**: Drag-and-drop functionality
- **file-saver**: File download utility
- **papaparse**: CSV parsing (for batch processing)

## API Reference

### Template Object
```typescript
interface Template {
  id: string;
  templateName: string;
  pdfDimensions: { width: number; height: number };
  backgroundImage: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
  version: string;
}
```

### Field Object
```typescript
interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea';
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  color: string;
  maxWidth?: number;
  alignment: 'left' | 'center' | 'right';
  required?: boolean;
  placeholder?: string;
  options?: string[]; // For dropdown
}
```

## Tips & Best Practices

1. **Accurate Positioning**: Use the grid and zoom features for precise field placement
2. **Font Matching**: Try to match fonts from the original PDF for best results
3. **Max Width**: Set max width for text fields to prevent overflow
4. **Template Reuse**: Save templates for forms you use frequently
5. **Quality Settings**: Use higher quality (90-100%) for professional documents

## Troubleshooting

### PDF Not Loading
- Ensure the PDF file is not corrupted
- Try converting the PDF to an image first
- Check browser console for errors

### Fields Not Positioning Correctly
- Verify coordinate system matches your expectations
- Use the Field Properties tab for exact positioning
- Enable grid for alignment assistance

### Export Quality Issues
- Increase quality setting in export options
- Ensure background image is high resolution
- Use PDF format for best quality

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation!**

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React and TypeScript**
