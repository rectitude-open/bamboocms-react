'use client';

import FormPage from '@/components/FormPage';

import { schema, uiSchema } from '../schemas';
import { update, view } from '../services';
import type { Role } from '../types';

const Page = () => {
  return (
    <div>
      <FormPage<Role>
        schema={schema}
        uiSchema={uiSchema}
        services={{
          initService: view,
          submitService: update,
        }}
        requiredParams={['id']}
        pageTitle="Edit Role"
      />
    </div>
  );
};

export default Page;
