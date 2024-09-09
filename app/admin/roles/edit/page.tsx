'use client';

import FormPage from '@/components/FormPage';

import { schema, uiSchema } from '../schemas';
import { update, view } from '../services';
import { Role } from '../types';

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
      />
    </div>
  );
};

export default Page;
