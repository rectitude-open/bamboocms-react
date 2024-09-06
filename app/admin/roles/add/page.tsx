'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyboardBackspace } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { withTheme, type IChangeEvent } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

import { commonSchema, commonUiSchema } from '../schemas/CommonFormSchemas';
import { create } from '../services';

const schema: RJSFSchema = commonSchema;
const uiSchema = commonUiSchema;

type FormData = {
  name: string;
  description: string;
};

const Form = withTheme<FormData>(Theme);

const onError = (errors: any) => console.log(errors);

const Add = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [formData, setFormData] = useState<FormData>();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: create,
    onMutate: () => {
      setLoading(true);
      setDisableSubmit(true);
    },
    onSuccess: (data) => {
      setLoading(false);
      enqueueSnackbar(data.message || 'Role added successfully!', { variant: 'success' });
      setDisableSubmit(false);
    },
    onError: () => {
      setLoading(false);
      setDisableSubmit(false);
    },
  });

  const onSubmit = async ({ formData }: IChangeEvent<FormData>, e: any) => {
    mutation.mutate(formData);
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
          Add Role
        </Typography>
        <Paper variant="outlined" elevation={3} sx={{ p: 3, pt: 1 }}>
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

export default Add;
