import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { ApiResponse } from '@/types/api';

import BaseDialog from './BaseDialog';

interface FormDialogProps {
  title: string;
  open: boolean;
  handleClose: () => void;
  id: number;
  initializeService: (id: number) => Promise<any>;
  submitService: (data: any) => Promise<any>;
  schema: any;
  uiSchema: any;
  onSubmitSuccess?: () => void;
}

const FormDialog = ({
  title,
  open,
  handleClose,
  id,
  initializeService,
  submitService,
  schema,
  uiSchema,
  onSubmitSuccess = () => {},
}: FormDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { data, isError, isLoading, isRefetching, refetch } = useQuery<ApiResponse>({
    queryKey: ['view-form', id],
    queryFn: async () => {
      const response = await initializeService(id);
      return response;
    },
    enabled: !!id && open,
  });

  const mutation = useMutation({
    mutationFn: submitService,
    onMutate: () => {
      setSubmitLoading(true);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || 'Submitted successfully!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['view-form'] });
      setSubmitLoading(false);
      handleClose();
      onSubmitSuccess();
    },
    onError: (error) => {
      console.error(error);
      setSubmitLoading(false);
    },
  });

  const handleSubmit = useCallback(
    (formData: any) => {
      mutation.mutate({ ...formData, id });
    },
    [id, mutation]
  );

  if (!open) {
    return null;
  }

  return (
    <>
      {!isError && (
        <BaseDialog
          open={open}
          handleClose={handleClose}
          title={title}
          formData={data?.data ?? {}}
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
