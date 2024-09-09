'use client';

import FormPage from '@/components/FormPage';

import { schema, uiSchema } from '../schemas';
import { create, view } from '../services';
import { Role } from '../types';

const Page = () => {
  return (
    <div>
      <FormPage<Role>
        schema={schema}
        uiSchema={uiSchema}
        services={{
          submitService: create,
        }}
      />
    </div>
  );
};

export default Page;
