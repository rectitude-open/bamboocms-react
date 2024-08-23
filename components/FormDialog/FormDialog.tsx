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
  services: {
    initService?: (data: any) => Promise<any>;
    submitService?: (data: any) => Promise<any>;
  };
  schema: any;
  uiSchema: any;
  onSubmitSuccess?: () => void;
}

const FormDialog = ({
  title,
  open,
  handleClose,
  id,
  services: { initService, submitService },
  schema,
  uiSchema,
  onSubmitSuccess = () => {},
}: FormDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>({});

  const { data, isError, isLoading, isRefetching } = useQuery<ApiResponse>({
    queryKey: ['view-form', id],
    queryFn: async () => {
      const response = await initService!(Number(id));
      return response;
    },
    enabled: !!initService && !!id && open,
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

  useEffect(() => {
    // cannot add open to the dependency array, it will cause fail to clear form data
    if (data?.data) {
      setInitialFormData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      setInitialFormData({});
    }
  }, [open]);

  const handleDialogClose = () => {
    handleClose();
  };

  const handleSubmit = useCallback(
    (formData: any) => {
      mutation.mutate({ ...formData, id });
    },
    [id, mutation]
  );

  return (
    <>
      {!isError && (
        <BaseDialog
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
