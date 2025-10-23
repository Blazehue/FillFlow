/**
 * Template Saver Utility
 * Handles saving, loading, and managing PDF form templates
 */

import { Template, Field } from '../types';

const STORAGE_KEY_PREFIX = 'pdf_form_template_';
const TEMPLATES_LIST_KEY = 'pdf_form_templates_list';

/**
 * Template Manager class
 */
export class TemplateSaver {
  /**
   * Save a template to localStorage
   */
  saveTemplate(template: Template): void {
    try {
      const templateKey = `${STORAGE_KEY_PREFIX}${template.id}`;
      const templateData = JSON.stringify(template);
      
      localStorage.setItem(templateKey, templateData);
      this.addToTemplatesList(template.id, template.templateName);
      
      console.log(`Template "${template.templateName}" saved successfully`);
    } catch (error) {
      console.error('Failed to save template:', error);
      throw new Error('Failed to save template to local storage');
    }
  }

  /**
   * Load a template from localStorage
   */
  loadTemplate(templateId: string): Template | null {
    try {
      const templateKey = `${STORAGE_KEY_PREFIX}${templateId}`;
      const templateData = localStorage.getItem(templateKey);
      
      if (!templateData) {
        console.warn(`Template with ID "${templateId}" not found`);
        return null;
      }
      
      return JSON.parse(templateData) as Template;
    } catch (error) {
      console.error('Failed to load template:', error);
      return null;
    }
  }

  /**
   * Delete a template from localStorage
   */
  deleteTemplate(templateId: string): boolean {
    try {
      const templateKey = `${STORAGE_KEY_PREFIX}${templateId}`;
      localStorage.removeItem(templateKey);
      this.removeFromTemplatesList(templateId);
      
      console.log(`Template with ID "${templateId}" deleted successfully`);
      return true;
    } catch (error) {
      console.error('Failed to delete template:', error);
      return false;
    }
  }

  /**
   * Get all saved templates (metadata only)
   */
  getAllTemplates(): Array<{ id: string; name: string }> {
    try {
      const listData = localStorage.getItem(TEMPLATES_LIST_KEY);
      if (!listData) return [];
      
      return JSON.parse(listData);
    } catch (error) {
      console.error('Failed to get templates list:', error);
      return [];
    }
  }

  /**
   * Export template as JSON file
   */
  exportTemplate(template: Template): void {
    try {
      const dataStr = JSON.stringify(template, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.templateName.replace(/\s+/g, '_')}_template.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log(`Template "${template.templateName}" exported successfully`);
    } catch (error) {
      console.error('Failed to export template:', error);
      throw new Error('Failed to export template');
    }
  }

  /**
   * Import template from JSON file
   */
  async importTemplate(file: File): Promise<Template> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const template = JSON.parse(content) as Template;
          
          // Validate template structure
          if (!this.validateTemplate(template)) {
            reject(new Error('Invalid template format'));
            return;
          }
          
          // Update timestamps
          template.updatedAt = new Date().toISOString();
          
          resolve(template);
        } catch (error) {
          reject(new Error('Failed to parse template file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read template file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Validate template structure
   */
  private validateTemplate(template: any): template is Template {
    if (!template || typeof template !== 'object') return false;
    
    const requiredFields = ['id', 'templateName', 'pdfDimensions', 'fields'];
    const hasRequiredFields = requiredFields.every(field => field in template);
    
    if (!hasRequiredFields) return false;
    
    // Validate PDF dimensions
    if (!template.pdfDimensions.width || !template.pdfDimensions.height) {
      return false;
    }
    
    // Validate fields array
    if (!Array.isArray(template.fields)) return false;
    
    return true;
  }

  /**
   * Add template to the templates list
   */
  private addToTemplatesList(id: string, name: string): void {
    try {
      const list = this.getAllTemplates();
      const existingIndex = list.findIndex(t => t.id === id);
      
      if (existingIndex >= 0) {
        list[existingIndex].name = name;
      } else {
        list.push({ id, name });
      }
      
      localStorage.setItem(TEMPLATES_LIST_KEY, JSON.stringify(list));
    } catch (error) {
      console.error('Failed to update templates list:', error);
    }
  }

  /**
   * Remove template from the templates list
   */
  private removeFromTemplatesList(id: string): void {
    try {
      const list = this.getAllTemplates();
      const filteredList = list.filter(t => t.id !== id);
      localStorage.setItem(TEMPLATES_LIST_KEY, JSON.stringify(filteredList));
    } catch (error) {
      console.error('Failed to update templates list:', error);
    }
  }

  /**
   * Create a new empty template
   */
  createNewTemplate(name: string, width: number, height: number): Template {
    const template: Template = {
      id: this.generateId(),
      templateName: name,
      pdfDimensions: { width, height },
      backgroundImage: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return template;
  }

  /**
   * Clone a template
   */
  cloneTemplate(template: Template, newName?: string): Template {
    const cloned: Template = {
      ...template,
      id: this.generateId(),
      templateName: newName || `${template.templateName} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: template.fields.map(field => ({ ...field })),
    };
    
    return cloned;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all templates from localStorage
   */
  clearAllTemplates(): void {
    try {
      const templates = this.getAllTemplates();
      templates.forEach(t => {
        const templateKey = `${STORAGE_KEY_PREFIX}${t.id}`;
        localStorage.removeItem(templateKey);
      });
      localStorage.removeItem(TEMPLATES_LIST_KEY);
      
      console.log('All templates cleared successfully');
    } catch (error) {
      console.error('Failed to clear templates:', error);
    }
  }
}

/**
 * Singleton instance
 */
let templateSaverInstance: TemplateSaver | null = null;

/**
 * Get the TemplateSaver singleton instance
 */
export const getTemplateSaver = (): TemplateSaver => {
  if (!templateSaverInstance) {
    templateSaverInstance = new TemplateSaver();
  }
  return templateSaverInstance;
};

/**
 * Generate a unique field ID
 */
export const generateFieldId = (): string => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a default field
 */
export const createDefaultField = (x: number, y: number): Field => {
  return {
    id: generateFieldId(),
    label: 'New Field',
    type: 'text',
    x,
    y,
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    color: '#000000',
    maxWidth: 200,
    alignment: 'left',
    required: false,
    placeholder: '',
  };
};
