import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { ApiResponse } from '@/types/api';

import BaseDialog from './BaseDialog';

interface FormDialogProps {
  open: boolean;
  handleClose: () => void;
  id: number;
  fetchService: (id: number) => Promise<any>;
  submitService: (data: any) => Promise<any>;
  schema: any;
  uiSchema: any;
  title: string;
}

const FormDialog = ({
  open,
  handleClose,
  id,
  fetchService,
  submitService,
  schema,
  uiSchema,
  title,
}: FormDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);

  console.log('render FormDialog');

  const { data, isError, isLoading, isRefetching, refetch } = useQuery<ApiResponse>({
    queryKey: ['view-form', id],
    queryFn: async () => {
      const response = await fetchService(id);
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
    },
    onError: (error) => {
      console.error(error);
      setSubmitLoading(false);
    },
  });

  if (!open) {
    return null;
  }

  const handleSubmit = (formData: any) => {
    mutation.mutate({ ...formData, id });
  };

  return (
    <BaseDialog
      open={open}
      handleClose={handleClose}
      title={title}
      formData={data}
      schema={schema}
      uiSchema={uiSchema}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLoading={submitLoading}
    />
  );
};

export default FormDialog;
