'use client';

import { withTheme, type IChangeEvent } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

type FormData = {
  name: string;
  description: string;
};

const schema: RJSFSchema = {
  title: 'Add Role',
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
const uiSchema = {
  name: {
    'ui:title': 'Name',
  },
  description: {
    'ui:title': 'Description',
    'ui:widget': 'textarea',
  },
};

const formData: FormData = {
  name: 'xxx',
  description: 'yyyy',
};

const Form = withTheme<FormData>(Theme);

const onSubmit = ({ formData }: IChangeEvent<FormData>, e: any) => console.log('Data submitted: ', formData);
const onError = (errors: any) => console.log('I have', errors.length, 'errors to fix');

const Add = () => {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      formData={formData}
      onSubmit={onSubmit}
      onError={onError}
    />
  );
};

export default Add;
