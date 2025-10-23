/**
 * Form Context
 * Manages the application state for PDF form filler
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  AppState,
  Template,
  FormData,
  Field,
  GridSettings,
  ZoomState,
  PDFSettings,
  NotificationMessage,
  Font,
} from '../types';

// Action types
type Action =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_TEMPLATE'; payload: Partial<Template> }
  | { type: 'ADD_FIELD'; payload: Field }
  | { type: 'UPDATE_FIELD'; payload: { id: string; updates: Partial<Field> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'SET_FORM_DATA'; payload: FormData }
  | { type: 'UPDATE_FORM_DATA'; payload: { fieldId: string; value: any } }
  | { type: 'SELECT_FIELD'; payload: string | null }
  | { type: 'SET_ZOOM'; payload: Partial<ZoomState> }
  | { type: 'SET_GRID'; payload: Partial<GridSettings> }
  | { type: 'SET_PDF_SETTINGS'; payload: Partial<PDFSettings> }
  | { type: 'ADD_FONT'; payload: Font }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationMessage }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  currentTemplate: null,
  formData: {},
  selectedFieldId: null,
  zoom: {
    level: 1,
    offsetX: 0,
    offsetY: 0,
  },
  grid: {
    enabled: false,
    size: 10,
    snapToGrid: false,
    showGuides: true,
  },
  pdfSettings: {
    pageSize: 'A4',
    orientation: 'portrait',
    quality: 95,
    dpi: 72,
  },
  fonts: [],
  isPreviewVisible: true,
  isLoading: false,
  notifications: [],
};

// Reducer
function formReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return {
        ...state,
        currentTemplate: action.payload,
        formData: {},
        selectedFieldId: null,
      };

    case 'UPDATE_TEMPLATE':
      if (!state.currentTemplate) return state;
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
      };

    case 'ADD_FIELD':
      if (!state.currentTemplate) return state;
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          fields: [...state.currentTemplate.fields, action.payload],
          updatedAt: new Date().toISOString(),
        },
      };

    case 'UPDATE_FIELD':
      if (!state.currentTemplate) return state;
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          fields: state.currentTemplate.fields.map((field) =>
            field.id === action.payload.id
              ? { ...field, ...action.payload.updates }
              : field
          ),
          updatedAt: new Date().toISOString(),
        },
      };

    case 'DELETE_FIELD':
      if (!state.currentTemplate) return state;
      return {
        ...state,
        currentTemplate: {
          ...state.currentTemplate,
          fields: state.currentTemplate.fields.filter(
            (field) => field.id !== action.payload
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId:
          state.selectedFieldId === action.payload ? null : state.selectedFieldId,
      };

    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
      };

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.fieldId]: action.payload.value,
        },
      };

    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.payload,
      };

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: {
          ...state.zoom,
          ...action.payload,
        },
      };

    case 'SET_GRID':
      return {
        ...state,
        grid: {
          ...state.grid,
          ...action.payload,
        },
      };

    case 'SET_PDF_SETTINGS':
      return {
        ...state,
        pdfSettings: {
          ...state.pdfSettings,
          ...action.payload,
        },
      };

    case 'ADD_FONT':
      return {
        ...state,
        fonts: [...state.fonts, action.payload],
      };

    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        isPreviewVisible: !state.isPreviewVisible,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
interface FormContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider
interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the context
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Helper hooks for specific state slices
export const useTemplate = () => {
  const { state, dispatch } = useFormContext();
  
  const setTemplate = (template: Template) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  };

  const updateTemplate = (updates: Partial<Template>) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: updates });
  };

  return {
    template: state.currentTemplate,
    setTemplate,
    updateTemplate,
  };
};

export const useFields = () => {
  const { state, dispatch } = useFormContext();

  const addField = (field: Field) => {
    dispatch({ type: 'ADD_FIELD', payload: field });
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { id, updates } });
  };

  const deleteField = (id: string) => {
    dispatch({ type: 'DELETE_FIELD', payload: id });
  };

  return {
    fields: state.currentTemplate?.fields || [],
    addField,
    updateField,
    deleteField,
  };
};

export const useFormData = () => {
  const { state, dispatch } = useFormContext();

  const setFormData = (data: FormData) => {
    dispatch({ type: 'SET_FORM_DATA', payload: data });
  };

  const updateFormData = (fieldId: string, value: any) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { fieldId, value } });
  };

  return {
    formData: state.formData,
    setFormData,
    updateFormData,
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useFormContext();

  const addNotification = (
    type: NotificationMessage['type'],
    message: string,
    duration: number = 5000
  ) => {
    const notification: NotificationMessage = {
      id: `notification_${Date.now()}`,
      type,
      message,
      duration,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
  };
};
