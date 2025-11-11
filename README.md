# PDF Form Filler Application

> 🚧 **Work In Progress**: This application is under active development. The UI/UX design is being refined, and many exciting features are coming soon! Stay tuned for updates.(design options will be issued soon)

A powerful, browser-based PDF form filler built with React that allows users to input data into forms and automatically generates filled PDFs with exact positioning, fonts, and formatting matching the original PDF template.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)]()
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)]()

---

## 🎯 Overview

PDF Form Filler eliminates the tedious process of manually filling PDF forms. Whether you're processing job applications, contracts, or government forms, this tool streamlines your workflow with an intuitive visual editor and automated PDF generation.

### Why Use This?

- ✅ **No Server Required**: Everything runs in your browser - your data stays private
- ✅ **Visual Editor**: See exactly where your data will appear on the PDF
- ✅ **Template Reuse**: Configure once, use forever with saved templates
- ✅ **Batch Processing**: Fill multiple forms with different data (coming soon)
- ✅ **Professional Output**: Generate pixel-perfect PDFs that look hand-filled

---

## ✨ Core Features

### 📄 PDF Processing
- **PDF Background Upload**: Upload PDF files or images as form backgrounds
- **Auto-Field Detection**: Intelligent detection of potential form fields from uploaded PDFs
- **Multi-Page Support**: Handle multi-page PDF documents (coming soon)
- **PDF Analysis**: Extract text, fonts, and structural information from PDFs

### 🎨 Visual Field Mapping
- **Interactive Canvas**: Drag-and-drop field positioning directly on PDF preview
- **Grid System**: Optional grid overlay for precise pixel-perfect alignment
- **Zoom Controls**: Zoom in/out (50%-200%) for detailed field positioning
- **Field Visualization**: Real-time preview of field boundaries and positions
- **Snap-to-Grid**: Automatic alignment to grid lines (coming soon)

### 📝 Field Types Supported

| Field Type | Description | Use Case |
|------------|-------------|----------|
| **Text** | Single-line text input | Names, addresses, short answers |
| **Number** | Numeric input with validation | Quantities, IDs, phone numbers |
| **Date** | Date picker with formatting | Birth dates, application dates |
| **Text Area** | Multi-line text input | Comments, descriptions, paragraphs |
| **Checkbox** | Boolean yes/no selection | Agreements, preferences |
| **Dropdown** | Selection from predefined options | Countries, states, categories |

### 🎯 Advanced Field Configuration
- **Font Customization**: Family, size, weight, style, and color
- **Alignment Options**: Left, center, right, justify
- **Text Wrapping**: Automatic text wrapping with max width control
- **Validation Rules**: Required fields, pattern matching, min/max values
- **Conditional Logic**: Show/hide fields based on other field values (coming soon)
- **Calculated Fields**: Auto-calculate based on other fields (coming soon)

### 💾 Template Management
- **Browser Storage**: Save templates to localStorage for quick access
- **Import/Export**: Share templates as JSON files
- **Template Library**: Built-in library of common form templates (coming soon)
- **Version Control**: Track template changes and revisions
- **Template Marketplace**: Community-shared templates (planned)

### 📤 Export Options
- **Multiple Formats**: Export as PDF, PNG, or JPG
- **Quality Control**: Adjustable quality settings (1-100%)
- **Background Toggle**: Include or exclude background in exports
- **Batch Export**: Process multiple entries at once (coming soon)
- **Cloud Export**: Direct export to Google Drive, Dropbox (planned)

### 🔥 Coming Soon
- 🎨 **UI/UX Redesign**: Modern, intuitive interface with improved workflows
- 📊 **Data Import**: Import data from CSV, Excel, or JSON
- 🔄 **Batch Processing**: Fill multiple forms with different data sets
- 🌐 **Multi-Language**: Support for international characters and RTL languages
- 🔐 **Digital Signatures**: Add digital signatures to forms
- 📱 **Mobile Optimization**: Enhanced mobile experience
- 🤖 **AI Field Detection**: ML-powered field detection and classification
- ☁️ **Cloud Sync**: Sync templates across devices
- 👥 **Collaboration**: Share and collaborate on templates with team members

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pdf-form-filler.git

# Navigate to the project directory
cd pdf-form-filler

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

### Docker Installation (Coming Soon)

```bash
docker pull pdfformfiller/app:latest
docker run -p 3000:3000 pdfformfiller/app
```

---

## 📖 Usage Guide

### Step 1: Upload Your PDF

1. Click the **upload area** or **drag-and-drop** your PDF file
2. Supported formats: PDF, PNG, JPG, JPEG
3. The application will automatically:
   - Render the PDF as a canvas
   - Analyze the document structure
   - Suggest potential form fields (for PDFs with forms)

### Step 2: Add Form Fields

**Method A: Click to Add**
```
1. Click anywhere on the PDF canvas
2. A new field appears at the clicked position
3. Configure the field properties in the right panel
```

**Method B: Auto-Detection**
```
1. Upload a PDF with an embedded form
2. Review auto-detected fields in the Field List
3. Adjust positions and properties as needed
```

**Method C: Manual Configuration**
```
1. Use the "Add Field" button
2. Enter exact X/Y coordinates
3. Set all properties via the Field Properties panel
```

### Step 3: Configure Field Properties

Select any field to edit:

| Property | Description | Example |
|----------|-------------|---------|
| **Label** | Display name in form | "Full Name", "Date of Birth" |
| **Type** | Field input type | text, number, date, etc. |
| **Position** | X/Y coordinates on canvas | x: 100, y: 250 |
| **Font Family** | Font to use for text | Helvetica, Times, Courier |
| **Font Size** | Text size in points | 12, 14, 16 |
| **Font Weight** | Normal or bold | normal, bold |
| **Color** | Text color (hex) | #000000, #FF0000 |
| **Alignment** | Text alignment | left, center, right |
| **Max Width** | Maximum text width (px) | 200, 300, 400 |
| **Required** | Whether field is mandatory | true, false |

### Step 4: Fill the Form

1. Switch to the **"Form Data"** tab
2. Fill in values for each field
3. See **live preview** in the right panel
4. Red indicators show required empty fields

### Step 5: Export Your PDF

1. Click **"Export PDF"** button
2. Configure export settings:
   ```
   - File name: my-filled-form.pdf
   - Format: PDF / PNG / JPG
   - Quality: 100% (for best results)
   - Include background: Yes
   ```
3. Click **"Download"**
4. Your filled PDF downloads automatically

### Step 6: Save Your Template

**Option A: Browser Storage**
```
1. Click "Save Template"
2. Template saved to localStorage
3. Access via "Load Template" dropdown
```

**Option B: Export as File**
```
1. Click "Export Template"
2. Downloads as JSON file
3. Share with team or backup
```

**Option C: Import Template**
```
1. Click "Import Template"
2. Select JSON file
3. Template loads with all configurations
```

---

## 🏗️ Project Structure

```
pdf-form-filler/
├── public/
│   ├── fonts/                    # Custom fonts directory
│   │   ├── helvetica/
│   │   ├── times/
│   │   └── courier/
│   ├── backgrounds/              # Background images storage
│   └── templates/                # Sample templates
├── src/
│   ├── components/               # React components
│   │   ├── BackgroundUpload.tsx      # PDF/image upload handler
│   │   ├── FieldMapper.tsx           # Visual field positioning
│   │   ├── FormEditor.tsx            # Form data input
│   │   ├── PDFPreview.tsx            # Live PDF preview
│   │   ├── PDFExporter.tsx           # Export functionality
│   │   ├── Notifications.tsx         # Toast notifications
│   │   └── TemplateManager.tsx       # Template CRUD operations
│   ├── context/                  # State management
│   │   └── FormContext.tsx           # Global form state
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePDFGeneration.ts       # PDF generation logic
│   │   ├── useFieldDetection.ts      # Auto-field detection
│   │   └── useTemplateStorage.ts     # Template persistence
│   ├── types/                    # TypeScript definitions
│   │   ├── index.ts                  # Main type definitions
│   │   └── pdf.ts                    # PDF-specific types
│   ├── utils/                    # Utility functions
│   │   ├── coordinateConverter.ts    # Coordinate transformations
│   │   ├── fontLoader.ts             # Font loading utilities
│   │   ├── fontMatcher.ts            # Font matching algorithm
│   │   ├── pdfParser.ts              # PDF parsing logic
│   │   ├── templateSaver.ts          # Template I/O operations
│   │   └── validators.ts             # Input validation
│   ├── styles/                   # CSS and styling
│   │   ├── global.css
│   │   └── components/
│   ├── App.tsx                   # Main application component
│   ├── index.tsx                 # Application entry point
│   └── config.ts                 # App configuration
├── tests/                        # Test files
│   ├── unit/
│   └── integration/
├── docs/                         # Documentation
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── EXAMPLES.md
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, TypeScript, HTML5 Canvas |
| **PDF Processing** | pdf-lib, PDF.js, jsPDF |
| **UI Components** | React Draggable, React Modal |
| **Styling** | CSS3, CSS Modules |
| **State Management** | React Context API, Custom Hooks |
| **File Handling** | File Saver, Papa Parse |
| **Build Tools** | Webpack, Babel |
| **Testing** | Jest, React Testing Library |
| **Code Quality** | ESLint, Prettier, Husky |

---

## 📚 API Reference

### Template Object

```typescript
interface Template {
  id: string;                    // Unique identifier
  templateName: string;          // User-defined name
  pdfDimensions: {              // PDF canvas dimensions
    width: number;
    height: number;
  };
  backgroundImage: string;       // Base64 encoded background
  fields: Field[];              // Array of form fields
  metadata: {
    createdAt: string;          // ISO timestamp
    updatedAt: string;          // ISO timestamp
    version: string;            // Template version
    author?: string;            // Template creator
    description?: string;       // Template description
  };
}
```

### Field Object

```typescript
interface Field {
  id: string;                                    // Unique field ID
  label: string;                                 // Display label
  type: FieldType;                              // Field type
  x: number;                                     // X coordinate
  y: number;                                     // Y coordinate
  width?: number;                                // Field width
  height?: number;                               // Field height
  fontSize: number;                              // Font size (pt)
  fontFamily: string;                            // Font family name
  fontWeight: 'normal' | 'bold';                // Font weight
  fontStyle?: 'normal' | 'italic';              // Font style
  color: string;                                 // Text color (hex)
  backgroundColor?: string;                      // Background color
  maxWidth?: number;                             // Max text width
  alignment: 'left' | 'center' | 'right';       // Text alignment
  required?: boolean;                            // Is required?
  placeholder?: string;                          // Placeholder text
  defaultValue?: string | number | boolean;     // Default value
  options?: string[];                            // Dropdown options
  validation?: {                                 // Validation rules
    pattern?: string;                           // Regex pattern
    minLength?: number;                         // Min length
    maxLength?: number;                         // Max length
    min?: number;                               // Min value
    max?: number;                               // Max value
  };
}

type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'dropdown' 
  | 'checkbox' 
  | 'textarea';
```

---

## 💡 Tips & Best Practices

### 🎯 Accurate Positioning
- Use the **grid overlay** for precise alignment
- **Zoom in** (150-200%) when positioning small text fields
- Use **arrow keys** for fine-tuned positioning (coming soon)
- Set exact coordinates in Field Properties for pixel-perfect placement

### 🔤 Font Matching
- Try to match fonts from the original PDF for seamless integration
- Use **font detection** feature to identify PDF fonts
- Fallback to web-safe fonts: Helvetica, Times, Courier
- Test font rendering before batch processing

### 📏 Text Field Sizing
- Set **max width** to prevent text overflow
- Use **text area** fields for multi-line content
- Enable **word wrap** for long text fields
- Test with longest expected input

### 💾 Template Management
- **Save templates** frequently during configuration
- Use **descriptive names**: "Job-Application-Form-v2" not "template1"
- **Export templates** as backup before major changes
- **Version your templates** for tracking changes

### 📤 Export Quality
- Use **PDF format** for best quality and smallest file size
- Set quality to **95-100%** for professional documents
- Use **PNG** for forms with transparency
- Use **JPG** for image-heavy forms to reduce size

### ⚡ Performance Optimization
- Keep field count under 50 per page for best performance
- Optimize background images (max 2MB recommended)
- Clear localStorage periodically to free up space
- Use template export for archiving old templates

---

## 🐛 Troubleshooting

### PDF Not Loading

**Symptoms**: Blank canvas, error messages, or loading spinner stuck

**Solutions**:
- ✅ Verify PDF file is not corrupted (try opening in Adobe Reader)
- ✅ Check file size (max 10MB recommended)
- ✅ Try converting PDF to image (PNG) first
- ✅ Check browser console for detailed error messages
- ✅ Ensure PDF is not password-protected
- ✅ Try a different browser (Chrome recommended)

### Fields Not Positioning Correctly

**Symptoms**: Fields appear in wrong location, misaligned, or off-canvas

**Solutions**:
- ✅ Verify PDF dimensions in template settings
- ✅ Use Field Properties tab for exact positioning
- ✅ Enable grid for alignment assistance
- ✅ Check zoom level (100% recommended for positioning)
- ✅ Clear browser cache and reload
- ✅ Re-upload PDF if dimensions changed

### Export Quality Issues

**Symptoms**: Blurry text, pixelated images, or poor PDF quality

**Solutions**:
- ✅ Increase quality setting to 95-100%
- ✅ Ensure background image is high resolution (300 DPI)
- ✅ Use PDF format instead of image formats
- ✅ Check font rendering in preview before export
- ✅ Verify text color has sufficient contrast
- ✅ Use standard fonts for better rendering

### Template Import Errors

**Symptoms**: Template fails to load or fields missing

**Solutions**:
- ✅ Verify JSON file is valid (check with JSON validator)
- ✅ Ensure template version is compatible
- ✅ Check that all required fields are present in JSON
- ✅ Clear browser storage and try again
- ✅ Re-export template from source application

### Performance Issues

**Symptoms**: Slow rendering, laggy interface, or browser freezing

**Solutions**:
- ✅ Reduce number of fields per template
- ✅ Optimize background image size
- ✅ Close unnecessary browser tabs
- ✅ Clear browser cache and localStorage
- ✅ Disable grid overlay if not needed
- ✅ Use Chrome for best performance

---

## 🎬 Available Scripts

### Development

```bash
# Start development server with hot reload
npm start

# Start on custom port
PORT=3001 npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- FieldMapper.test.tsx
```

### Build

```bash
# Build for production
npm run build

# Build and analyze bundle size
npm run build -- --stats

# Preview production build locally
npm run serve
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Other

```bash
# Eject from Create React App (⚠️ irreversible)
npm run eject

# Generate component
npm run generate:component ComponentName

# Clean build artifacts
npm run clean
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository
- 🎨 Share UI/UX improvement ideas

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

---

## 🌟 Roadmap

### Version 1.0 (Current - WIP)
- [x] Basic PDF upload and rendering
- [x] Visual field mapper
- [x] Template saving/loading
- [x] PDF export functionality
- [ ] UI/UX polish and refinement
- [ ] Comprehensive documentation

### Version 1.5 (Q1 2026)
- [ ] Batch processing with CSV import
- [ ] Multi-page PDF support
- [ ] Advanced field validation
- [ ] Calculated fields
- [ ] Template marketplace

### Version 2.0 (Q2 2026)
- [ ] Cloud synchronization
- [ ] Collaboration features
- [ ] AI-powered field detection
- [ ] Mobile app (iOS/Android)
- [ ] Digital signature support
- [ ] API for integrations

---

## 📞 Support

- 📧 Email: support@pdfformfiller.com
- 💬 Discord: [Join our community](https://discord.gg/pdfformfiller)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pdf-form-filler/issues)
- 📖 Docs: [Full Documentation](https://docs.pdfformfiller.com)
- 🎥 Tutorials: [YouTube Channel](https://youtube.com/pdfformfiller)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering engine
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation
- All our amazing [contributors](https://github.com/yourusername/pdf-form-filler/graphs/contributors)

---

## ⭐ Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐦 Sharing on social media
- 📝 Writing a blog post
- 💰 Sponsoring the project

---

<div align="center">

**Built with ❤️ using React and TypeScript**

[Website](https://pdfformfiller.com) • [Documentation](https://docs.pdfformfiller.com) • [Demo](https://demo.pdfformfiller.com)

</div>
