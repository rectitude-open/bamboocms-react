import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { ApiResponse } from '@/types/api';

import BaseDialog from './BaseDialog';

interface FormDialogProps {
  open: boolean;
  handleClose: () => void;
  id: number | undefined;
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

  // const { data, isLoading, refetch } = useQuery(['form-data', id], () => fetchService(id), { enabled: !!id });

  // useEffect(() => {
  //   if (id) {
  //     refetch();
  //   }
  // }, [id, refetch]);

  const { data, isError, isLoading, isRefetching, refetch } = useQuery<ApiResponse>({
    queryKey: ['view-form', id],
    queryFn: async () => {
      const params = { id };
      const response = await fetchService(id);
      return response;
    },
  });

  const mutation = useMutation({
    mutationFn: submitService,
    onMutate: () => {
      setSubmitLoading(true);
    },
    onSuccess: (data) => {
      enqueueSnackbar(data.message || 'Submitted successfully!', { variant: 'success' });
      queryClient.invalidateQueries(['form-data']);
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar('Error submitting form', { variant: 'error' });
      console.error(error);
    },
  });

  const handleSubmit = (formData: any) => {
    mutation.mutate(id ? { ...formData, id } : formData);
  };

  return (
    <BaseDialog
      open={open}
      handleClose={handleClose}
      formData={data}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title={title}
    />
  );
};

export default FormDialog;
