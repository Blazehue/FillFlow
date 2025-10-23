/**
 * Main App Component
 * Integrates all components with responsive layout
 */

import React, { useEffect } from 'react';
import { FormProvider } from './context/FormContext';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { BackgroundUpload } from './components/BackgroundUpload';
import { FieldMapper } from './components/FieldMapper';
import { FormEditor } from './components/FormEditor';
import { PDFPreview } from './components/PDFPreview';
import { PDFExporter } from './components/PDFExporter';
import { Notifications } from './components/Notifications';
import { useTemplate, useNotifications } from './context/FormContext';
import { getTemplateSaver } from './utils/templateSaver';
import './App.css';

const AppContent: React.FC = () => {
  const { template, setTemplate } = useTemplate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Create a default template on initial load
    if (!template) {
      const templateSaver = getTemplateSaver();
      const newTemplate = templateSaver.createNewTemplate('Untitled Form', 794, 1123);
      setTemplate(newTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveTemplate = () => {
    if (!template) return;

    const templateSaver = getTemplateSaver();
    try {
      templateSaver.saveTemplate(template);
      addNotification('success', 'Template saved successfully!');
    } catch (error) {
      addNotification('error', 'Failed to save template');
    }
  };

  const handleExportTemplate = () => {
    if (!template) return;

    const templateSaver = getTemplateSaver();
    try {
      templateSaver.exportTemplate(template);
      addNotification('success', 'Template exported successfully!');
    } catch (error) {
      addNotification('error', 'Failed to export template');
    }
  };

  const handleImportTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const templateSaver = getTemplateSaver();
    try {
      const importedTemplate = await templateSaver.importTemplate(file);
      setTemplate(importedTemplate);
      addNotification('success', 'Template imported successfully!');
    } catch (error) {
      addNotification('error', 'Failed to import template');
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title-row">
            <h1>🌊 FillFlow</h1>
            <ThemeToggle />
          </div>
          <p className="subtitle">Create and fill PDF forms with pixel-perfect precision</p>
        </div>
        <div className="header-actions">
          <button onClick={handleSaveTemplate} className="header-btn">
            💾 Save Template
          </button>
          <button onClick={handleExportTemplate} className="header-btn">
            📤 Export Template
          </button>
          <label className="header-btn import-btn">
            📥 Import Template
            <input
              type="file"
              accept=".json"
              onChange={handleImportTemplate}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </header>

      <div className="app-body">
        {/* Left Panel - Configuration */}
        <div className="panel left-panel">
          <section className="panel-section">
            <BackgroundUpload />
          </section>

          <section className="panel-section">
            <FormEditor />
          </section>

          <section className="panel-section">
            <PDFExporter />
          </section>
        </div>

        {/* Center Panel - Field Mapper */}
        <div className="panel center-panel">
          <FieldMapper />
        </div>

        {/* Right Panel - Preview */}
        <div className="panel right-panel">
          <PDFPreview />
        </div>
      </div>

      <Notifications />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pdf-form-filler-theme">
      <FormProvider>
        <AppContent />
      </FormProvider>
    </ThemeProvider>
  );
}

export default App;
