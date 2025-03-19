import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import Form, { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { RegistryWidgetsType } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { nanoid } from 'nanoid';
import React, { createRef, useCallback, useEffect, useState } from 'react';

import DateTimeWidget from '@/components/DateTimeWidget';
import SwitchWidget from '@/components/SwitchWidget';

import type { DialogProps } from '@mui/material';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';

const ThemeForm = withTheme(Theme);
const formRef = createRef<Form>();

interface BaseDialogProps<T> {
  open: boolean;
  handleClose: () => void;
  title: string;
  formData: T;
  schema: RJSFSchema;
  uiSchema: UiSchema;
  isLoading: boolean;
  onSubmit: (formData: T) => void;
  submitLoading?: boolean;
}

const widgets: RegistryWidgetsType = {
  SwitchWidget,
  DateTimeWidget,
};

const BaseDialog = <T extends Record<string, unknown>>({
  open,
  handleClose,
  title,
  formData,
  schema,
  uiSchema,
  isLoading,
  onSubmit,
  submitLoading,
}: BaseDialogProps<T>) => {
  const [internalFormData, setInternalFormData] = useState<T>(formData);
  const [dialogKey] = useState(nanoid());

  useEffect(() => {
    if (open && formData) {
      setInternalFormData(formData);
    }
  }, [formData, open]);

  const resetFormData = useCallback(() => {
    setInternalFormData({} as T);
  }, []);

  useEffect(() => {
    if (!open) {
      resetFormData();
    }
    const ref = formRef.current;
    return () => {
      ref?.reset();
    };
  }, [open, resetFormData]);

  const handleResetAndClose = useCallback(() => {
    resetFormData();
    if (!submitLoading) {
      handleClose();
    }
  }, [handleClose, resetFormData, submitLoading]);

  const handleDialogClose: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleResetAndClose();
  };

  return (
    <Dialog key={dialogKey} open={open} onClose={handleDialogClose} fullWidth maxWidth='sm' disableEscapeKeyDown>
      {isLoading && (
        <Box height={400} width='100%' display='flex' alignItems='center' justifyContent='center'>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <>
          <DialogTitle>
            <Typography fontSize='1.2rem'>{title}</Typography>
            <IconButton
              aria-label='close'
              onClick={handleResetAndClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
              disabled={submitLoading}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers style={{ paddingTop: '3px' }}>
            <ThemeForm
              ref={formRef}
              schema={schema}
              uiSchema={uiSchema}
              widgets={widgets}
              validator={validator}
              formData={internalFormData}
              onChange={({ formData }) => setInternalFormData(formData)}
              onSubmit={({ formData }) => onSubmit(formData)}
              disabled={submitLoading}
              omitExtraData
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleResetAndClose} color='secondary' disabled={submitLoading}>
              Cancel
            </Button>
            <Button
              type='button'
              color='primary'
              onClick={() => formRef.current?.submit()}
              disabled={submitLoading}
              startIcon={submitLoading ? <CircularProgress size={16} /> : null}>
              Submit
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default React.memo(BaseDialog) as typeof BaseDialog;
