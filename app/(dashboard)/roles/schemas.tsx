import dayjs from 'dayjs';

import type { Role } from './types';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';

export const schema: RJSFSchema = {
  type: 'object',
  required: ['label'],
  properties: {
    label: {
      type: 'string',
      maxLength: 255,
    },
    created_at: {
      type: 'string',
      format: 'date-time',
    },
    status: {
      type: 'string',
      enum: ['active', 'subspended'],
      default: 'active',
    },
  },
};

export const uiSchema: UiSchema<Role> = {
  'label': {
    'ui:title': 'Label',
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
      offValue: 'subspended',
    },
  },
  'ui:submitButtonOptions': {
    norender: true,
  },
};
