'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, KeyboardBackspace } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { withTheme, type IChangeEvent } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import type { ApiResponse } from '@/types/api';

import type { FormPageProps } from './FormPage.types';

const onError = (errors: any) => console.log(errors);

const FormPage = <T,>({ schema, uiSchema, services: { initService, submitService } }: FormPageProps) => {
  const Form = useMemo(() => withTheme<T>(Theme), []);
  const validator = useMemo(() => customizeValidator<T>(), []);

  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [formData, setFormData] = useState<T>();
  const router = useRouter();

  const id = searchParams.get('id');

  const { data, isError, isLoading } = useQuery<ApiResponse<T>>({
    queryKey: ['edit', id],
    queryFn: async () => {
      const response = await initService!(Number(id));
      return response;
    },
    enabled: !!id && !!initService,
  });

  useEffect(() => {
    if (data) {
      setFormData(data.data as T);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: submitService,
    onMutate: () => {
      setLoading(true);
      setDisableSubmit(true);
    },
    onSuccess: (data) => {
      setLoading(false);
      enqueueSnackbar(data.message || 'Role updated successfully!', { variant: 'success' });
      setDisableSubmit(false);
    },
    onError: () => {
      setLoading(false);
      setDisableSubmit(false);
    },
  });

  const onSubmit = ({ formData }: IChangeEvent<T>, e: any) => mutation.mutate({ ...formData, id: Number(id) });

  if (!id) {
    return <Alert severity="error">Invalid ID</Alert>;
  }

  if (isError) {
    return <Alert severity="error">Error fetching data</Alert>;
  }

  return (
    <Container maxWidth="xl">
      <Box>
        <Button variant="text" startIcon={<KeyboardBackspace />} sx={{ p: 0 }} onClick={() => router.back()}>
          Roles
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ py: 2 }}>
          Edit Role
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, pt: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Form
              schema={schema}
              uiSchema={uiSchema}
              validator={validator}
              onSubmit={onSubmit}
              onError={onError}
              disabled={loading}
              formData={formData}
              onChange={(e) => e.formData && setFormData(e.formData)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={disableSubmit}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Loading...' : 'Submit'}
                </Button>
              </Box>
            </Form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default React.memo(FormPage) as typeof FormPage;
