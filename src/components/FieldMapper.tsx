/**
 * FieldMapper Component
 * Interactive visual field positioning tool with drag-drop functionality
 */

import React, { useRef, useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useTemplate, useFields, useFormContext } from '../context/FormContext';
import { createDefaultField } from '../utils/templateSaver';
import './FieldMapper.css';

export const FieldMapper: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const { template } = useTemplate();
  const { fields, addField, updateField } = useFields();
  const { state, dispatch } = useFormContext();

  useEffect(() => {
    // Calculate initial scale to fit canvas
    if (template && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const containerWidth = container.clientWidth - 40;
        const containerHeight = container.clientHeight - 100;
        const scaleX = containerWidth / template.pdfDimensions.width;
        const scaleY = containerHeight / template.pdfDimensions.height;
        const initialScale = Math.min(scaleX, scaleY, 1);
        setScale(initialScale);
      }
    }
  }, [template]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!template) return;

    // Only add field if clicking on the canvas directly (not on a field)
    if ((event.target as HTMLElement).classList.contains('canvas-area')) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (event.clientX - rect.left) / scale;
      const y = (event.clientY - rect.top) / scale;

      const newField = createDefaultField(x, y);
      addField(newField);
      dispatch({ type: 'SELECT_FIELD', payload: newField.id });
    }
  };

  const handleFieldDrag = (fieldId: string, data: DraggableData) => {
    updateField(fieldId, {
      x: data.x / scale,
      y: data.y / scale,
    });
  };

  const handleFieldClick = (fieldId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: 'SELECT_FIELD', payload: fieldId });
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  if (!template || !template.backgroundImage) {
    return (
      <div className="field-mapper-empty">
        <p>Please upload a background image first</p>
      </div>
    );
  }

  return (
    <div className="field-mapper">
      <div className="mapper-toolbar">
        <div className="toolbar-group">
          <button onClick={handleZoomOut} title="Zoom Out">
            🔍−
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} title="Zoom In">
            🔍+
          </button>
          <button onClick={handleZoomReset} title="Reset Zoom">
            Reset
          </button>
        </div>
        <div className="toolbar-group">
          <label className="grid-toggle">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={toggleGrid}
            />
            Show Grid
          </label>
        </div>
        <div className="toolbar-info">
          <span>{fields.length} fields</span>
        </div>
      </div>

      <div className="mapper-canvas-container">
        <div
          ref={canvasRef}
          className="canvas-area"
          onClick={handleCanvasClick}
          style={{
            width: template.pdfDimensions.width * scale,
            height: template.pdfDimensions.height * scale,
            backgroundImage: `url(${template.backgroundImage})`,
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          {showGrid && (
            <div
              className="grid-overlay"
              style={{
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
              }}
            />
          )}

          {fields.map((field) => (
            <Draggable
              key={field.id}
              position={{ x: field.x * scale, y: field.y * scale }}
              onStop={(e: DraggableEvent, data: DraggableData) =>
                handleFieldDrag(field.id, data)
              }
              scale={1}
            >
              <div
                className={`field-marker ${
                  state.selectedFieldId === field.id ? 'selected' : ''
                }`}
                onClick={(e) => handleFieldClick(field.id, e)}
                style={{
                  fontSize: field.fontSize * scale,
                  fontFamily: field.fontFamily,
                  fontWeight: field.fontWeight,
                  color: field.color,
                }}
              >
                <div className="field-label">{field.label}</div>
                <div className="field-handle">⋮⋮</div>
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      <div className="mapper-instructions">
        <p>
          <strong>Click</strong> on the canvas to add a new field •{' '}
          <strong>Drag</strong> fields to reposition •{' '}
          <strong>Click a field</strong> to edit its properties
        </p>
      </div>
    </div>
  );
};
