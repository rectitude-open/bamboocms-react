'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, KeyboardBackspace } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { withTheme, type IChangeEvent } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import type { ApiResponse } from '@/types/api';

import * as services from '../services';

type FormData = {
  name: string;
  description: string;
};

const schema: RJSFSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      maxLength: 255,
    },
    description: {
      type: 'string',
      maxLength: 255,
    },
  },
};

const uiSchema = {
  name: {
    'ui:title': 'Name',
  },
  description: {
    'ui:title': 'Description',
    'ui:widget': 'textarea',
  },
};

const Form = withTheme<FormData>(Theme);

const onError = (errors: any) => console.log(errors);

const Page = () => {
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [formData, setFormData] = useState<FormData | undefined>();
  const router = useRouter();

  const id = searchParams.get('id');
  if (!id) {
    return <Alert severity="error">Invalid ID</Alert>;
  }

  const { data, isError, isLoading, isRefetching, refetch } = useQuery<ApiResponse<FormData>>({
    queryKey: ['edit', id],
    queryFn: async () => {
      const response = await services.view(Number(id));
      return response;
    },
  });

  useEffect(() => {
    if (data) {
      setFormData(data.data);
    }
  }, [data]);

  if (isError) {
    return <Alert severity="error">Error fetching data</Alert>;
  }

  const mutation = useMutation({
    mutationFn: services.update,
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

  const onSubmit = async ({ formData }: IChangeEvent<FormData>, e: any) => {
    mutation.mutate({ id: Number(id), data: formData });
  };

  return (
    <Container maxWidth="xl">
      <Box>
        <Button
          variant="text"
          startIcon={<KeyboardBackspace />}
          sx={{ p: 0 }}
          onClick={() => router.push('/dashboard/roles')}
        >
          Roles
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ py: 2 }}>
          Edit Role
        </Typography>
        <Paper variant="outlined" sx={{ p: 3, pt: 1 }}>
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
        </Paper>
      </Box>
    </Container>
  );
};

export default Page;
