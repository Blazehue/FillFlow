/**
 * FormEditor Component
 * Dynamic form generation and field property editing
 */

import React, { useState } from 'react';
import { useFields, useFormData, useFormContext } from '../context/FormContext';
import { Field, FieldType } from '../types';
import './FormEditor.css';

export const FormEditor: React.FC = () => {
  const { fields, updateField, deleteField } = useFields();
  const { formData, updateFormData } = useFormData();
  const { state } = useFormContext();
  const [activeTab, setActiveTab] = useState<'data' | 'properties'>('data');

  const selectedField = fields.find((f) => f.id === state.selectedFieldId);

  const handleFieldValueChange = (fieldId: string, value: any) => {
    updateFormData(fieldId, value);
  };

  const handleFieldPropertyChange = (
    fieldId: string,
    property: keyof Field,
    value: any
  ) => {
    updateField(fieldId, { [property]: value });
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      deleteField(fieldId);
    }
  };

  const renderFieldInput = (field: Field) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            value={String(value)}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            className="form-input"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={String(value)}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            rows={3}
            className="form-textarea"
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value === true || value === 'true'}
            onChange={(e) => handleFieldValueChange(field.id, e.target.checked)}
            className="form-checkbox"
          />
        );

      case 'dropdown':
        return (
          <select
            value={String(value)}
            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
            required={field.required}
            className="form-select"
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  const renderDataTab = () => (
    <div className="data-tab">
      {fields.length === 0 ? (
        <div className="empty-state">
          <p>No fields yet. Click on the canvas to add fields.</p>
        </div>
      ) : (
        <form className="form-fields">
          {fields.map((field) => (
            <div key={field.id} className="form-field">
              <label className="field-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              {renderFieldInput(field)}
            </div>
          ))}
        </form>
      )}
    </div>
  );

  const renderPropertiesTab = () => {
    if (!selectedField) {
      return (
        <div className="empty-state">
          <p>Select a field to edit its properties</p>
        </div>
      );
    }

    return (
      <div className="properties-tab">
        <div className="properties-header">
          <h3>Field Properties</h3>
          <button
            onClick={() => handleDeleteField(selectedField.id)}
            className="delete-btn"
          >
            🗑 Delete
          </button>
        </div>

        <div className="property-group">
          <label>Label</label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) =>
              handleFieldPropertyChange(selectedField.id, 'label', e.target.value)
            }
            className="property-input"
          />
        </div>

        <div className="property-group">
          <label>Field Type</label>
          <select
            value={selectedField.type}
            onChange={(e) =>
              handleFieldPropertyChange(
                selectedField.id,
                'type',
                e.target.value as FieldType
              )
            }
            className="property-select"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="textarea">Text Area</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </div>

        <div className="property-row">
          <div className="property-group">
            <label>X Position</label>
            <input
              type="number"
              value={Math.round(selectedField.x)}
              onChange={(e) =>
                handleFieldPropertyChange(
                  selectedField.id,
                  'x',
                  parseInt(e.target.value)
                )
              }
              className="property-input"
            />
          </div>
          <div className="property-group">
            <label>Y Position</label>
            <input
              type="number"
              value={Math.round(selectedField.y)}
              onChange={(e) =>
                handleFieldPropertyChange(
                  selectedField.id,
                  'y',
                  parseInt(e.target.value)
                )
              }
              className="property-input"
            />
          </div>
        </div>

        <div className="property-group">
          <label>Font Family</label>
          <select
            value={selectedField.fontFamily}
            onChange={(e) =>
              handleFieldPropertyChange(selectedField.id, 'fontFamily', e.target.value)
            }
            className="property-select"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div className="property-row">
          <div className="property-group">
            <label>Font Size</label>
            <input
              type="number"
              value={selectedField.fontSize}
              onChange={(e) =>
                handleFieldPropertyChange(
                  selectedField.id,
                  'fontSize',
                  parseInt(e.target.value)
                )
              }
              min="8"
              max="72"
              className="property-input"
            />
          </div>
          <div className="property-group">
            <label>Font Weight</label>
            <select
              value={selectedField.fontWeight}
              onChange={(e) =>
                handleFieldPropertyChange(selectedField.id, 'fontWeight', e.target.value)
              }
              className="property-select"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>

        <div className="property-group">
          <label>Text Color</label>
          <input
            type="color"
            value={selectedField.color}
            onChange={(e) =>
              handleFieldPropertyChange(selectedField.id, 'color', e.target.value)
            }
            className="property-color"
          />
        </div>

        <div className="property-group">
          <label>Alignment</label>
          <select
            value={selectedField.alignment}
            onChange={(e) =>
              handleFieldPropertyChange(selectedField.id, 'alignment', e.target.value)
            }
            className="property-select"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="property-group">
          <label>Max Width (px)</label>
          <input
            type="number"
            value={selectedField.maxWidth || ''}
            onChange={(e) =>
              handleFieldPropertyChange(
                selectedField.id,
                'maxWidth',
                parseInt(e.target.value) || undefined
              )
            }
            placeholder="Auto"
            className="property-input"
          />
        </div>

        <div className="property-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={selectedField.required || false}
              onChange={(e) =>
                handleFieldPropertyChange(selectedField.id, 'required', e.target.checked)
              }
            />
            Required Field
          </label>
        </div>

        {selectedField.type === 'dropdown' && (
          <div className="property-group">
            <label>Options (comma-separated)</label>
            <textarea
              value={selectedField.options?.join(', ') || ''}
              onChange={(e) =>
                handleFieldPropertyChange(
                  selectedField.id,
                  'options',
                  e.target.value.split(',').map((opt) => opt.trim())
                )
              }
              rows={3}
              placeholder="Option 1, Option 2, Option 3"
              className="property-textarea"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="form-editor">
      <div className="editor-tabs">
        <button
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Form Data
        </button>
        <button
          className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Field Properties
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'data' ? renderDataTab() : renderPropertiesTab()}
      </div>
    </div>
  );
};
