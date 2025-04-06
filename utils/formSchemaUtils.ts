import _ from 'lodash';
import { useMemo } from 'react';

import type { RJSFSchema, UiSchema } from '@rjsf/utils';

export const useFilteredSchemas = <T>(params: { schema: RJSFSchema; uiSchema: UiSchema<T>; omitKeys: string[] }) => {
  return useMemo(
    () => ({
      filteredSchema: omitSchemaFields(params.schema, params.omitKeys),
      filteredUiSchema: omitUiSchemaFields<T>(params.uiSchema, params.omitKeys),
    }),
    [params.schema, params.uiSchema, params.omitKeys]
  );
};

export const omitSchemaFields = (schema: RJSFSchema, keys: string[]) => {
  const newSchema = _.cloneDeep(schema);

  if (newSchema) {
    newSchema.properties = _.omit(newSchema.properties, keys);
  }

  if (newSchema.required) {
    newSchema.required = _.without(newSchema.required, ...keys);
  }

  if (newSchema.dependencies) {
    newSchema.dependencies = _.omit(newSchema.dependencies, keys);
  }

  ['allOf', 'anyOf', 'oneOf'].forEach((key) => {
    if (Array.isArray(newSchema[key])) {
      newSchema[key] = newSchema[key].map((subSchema: RJSFSchema) => omitSchemaFields(subSchema, keys));
    }
  });

  return newSchema;
};

export const omitUiSchemaFields = <T>(uiSchema: UiSchema<T>, keys: string[]) => {
  const cloned = _.cloneDeep(uiSchema);

  const filtered = _.omit(cloned, keys) as any;

  if (Array.isArray(filtered['ui:order'])) {
    filtered['ui:order'] = _.without(filtered['ui:order'], ...keys);
  }

  keys.forEach((key) => {
    if (filtered[key]) {
      delete filtered[key];
    }
  });

  return filtered;
};
