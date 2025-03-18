import dayjs from 'dayjs';

import { formatDate } from '@/utils/dateUtils';

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
      default: dayjs().toISOString(),
    },
    status: {
      type: 'string',
      oneOf: [
        {
          const: 'active',
          title: 'Active',
        },
        {
          const: 'subspended',
          title: 'Subspended',
        },
      ],
    },
  },
};

export const uiSchema: UiSchema<Role> = {
  'label': {
    'ui:title': 'Label',
  },
  'created_at': {
    'ui:title': 'Created At',
  },
  'status': {
    'ui:title': 'Status',
  },
  'ui:submitButtonOptions': {
    norender: true,
  },
};
