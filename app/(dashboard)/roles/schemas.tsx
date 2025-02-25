import type { Role } from './types';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';

export const schema: RJSFSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
    },
    description: {
      type: 'string',
      maxLength: 255,
    },
  },
};

export const uiSchema: UiSchema<Role> = {
  'name': {
    'ui:title': 'Name',
  },
  'description': {
    'ui:title': 'Description',
    'ui:widget': 'textarea',
  },
  'ui:submitButtonOptions': {
    norender: true,
  },
};
