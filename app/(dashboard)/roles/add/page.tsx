'use client';

import FormPage from '@/components/FormPage';
import { useFilteredSchemas } from '@/utils/formSchemaUtils';

import { schema, uiSchema } from '../schemas';
import { create, view } from '../services';

import type { Role } from '../types';

const Page = () => {
  const { filteredSchema, filteredUiSchema } = useFilteredSchemas<Role>({
    schema,
    uiSchema,
    omitKeys: ['status'],
  });

  return (
    <div>
      <FormPage<Role>
        schema={filteredSchema}
        uiSchema={filteredUiSchema}
        services={{
          submitService: create,
        }}
        pageTitle='Add Role'
      />
    </div>
  );
};

export default Page;
