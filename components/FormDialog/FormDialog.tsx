import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { ApiResponse } from '@/types/api';
import useRequiredParams from '@/hooks/useRequiredParams';

import BaseDialog from './BaseDialog';

interface FormDialogProps<T> {
  title: string;
  open: boolean;
  handleClose: () => void;
  services: {
    initService?: (data: any) => Promise<any>;
    submitService?: (data: any, params: any) => Promise<any>;
  };
  schema: RJSFSchema;
  uiSchema: UiSchema;
  onSubmitSuccess?: () => void;
  requiredParams?: string[];
  row: T;
}

const FormDialog = <T extends Record<string, unknown>>({
  title,
  open,
  handleClose,
  services: { initService, submitService },
  schema,
  uiSchema,
  requiredParams = [],
  onSubmitSuccess = () => {},
  row = {} as T,
}: FormDialogProps<T>) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>({});
  const { requiredParamsMap, hasMissingParams } = useRequiredParams<T>({
    requiredParams,
    row,
  });

  const queryKey = useMemo(() => ['view-form', requiredParamsMap], [requiredParamsMap]);

  const { data, isError, isLoading, isRefetching } = useQuery<ApiResponse>({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await initService!(requiredParamsMap);
      return response;
    },
    enabled: !!initService && open && !hasMissingParams,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await submitService!(payload.data, payload.params);
      return response;
    },
    onMutate: () => {
      setSubmitLoading(true);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || 'Submitted successfully!', { variant: 'success' });
      setSubmitLoading(false);
      handleClose();
      onSubmitSuccess();
    },
    onError: (error) => {
      console.error(error);
      setSubmitLoading(false);
    },
  });

  useEffect(() => {
    if (open && data?.data) {
      setInitialFormData(data.data);
    }
  }, [data, open]);

  useEffect(() => {
    if (!open) {
      setInitialFormData({});
      queryClient.resetQueries({ queryKey: queryKey });
    }
  }, [open, queryClient, queryKey]);

  const handleDialogClose = () => {
    handleClose();
  };

  const handleSubmit = useCallback(
    (formData: any) => {
      mutation.mutate({
        data: formData,
        params: requiredParamsMap,
      });
    },
    [requiredParamsMap, mutation]
  );

  return (
    <>
      {!isError && (
        <BaseDialog<T>
          open={open}
          handleClose={handleDialogClose}
          title={title}
          formData={initialFormData}
          schema={schema}
          uiSchema={uiSchema}
          isLoading={isLoading || isRefetching}
          onSubmit={handleSubmit}
          submitLoading={submitLoading}
        />
      )}
    </>
  );
};

export default FormDialog;
