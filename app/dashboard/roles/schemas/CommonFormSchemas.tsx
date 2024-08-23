import { RJSFSchema } from '@rjsf/utils';

export const commonSchema: RJSFSchema = {
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

export const commonUiSchema = {
  name: {
    'ui:title': 'Name',
  },
  description: {
    'ui:title': 'Description',
    'ui:widget': 'textarea',
  },
  'ui:submitButtonOptions': {
    norender: true,
  },
};
