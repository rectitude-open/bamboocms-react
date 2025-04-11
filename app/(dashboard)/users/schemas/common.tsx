import type { User } from '../types';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';

export const schema: RJSFSchema = {
  type: 'object',
  required: ['email', 'display_name'],
  properties: {
    email: {
      type: 'string',
      maxLength: 255,
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 255,
    },
    display_name: {
      type: 'string',
      maxLength: 255,
    },
    created_at: {
      type: 'string',
      format: 'date-time',
    },
    status: {
      type: 'string',
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
};

export const uiSchema: UiSchema<User> = {
  'email': {
    'ui:title': 'Email',
    'ui:widget': 'email',
  },
  'display_name': {
    'ui:title': 'Display Name',
  },
  'password': {
    'ui:title': 'Password',
    'ui:widget': 'password',
  },
  'created_at': {
    'ui:title': 'Created At',
    'ui:widget': 'DateTimeWidget',
  },
  'status': {
    'ui:title': 'Status',
    'ui:widget': 'SwitchWidget',
    'ui:options': {
      onValue: 'active',
      offValue: 'suspended',
    },
  },
  'ui:submitButtonOptions': {
    norender: true,
  },
};
