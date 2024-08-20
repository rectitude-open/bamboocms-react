import React, { createRef, useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Typography,
} from '@mui/material';
import Form, { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';

const ThemeForm = withTheme(Theme);
const formRef = createRef<Form>();

interface BaseDialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  formData: any;
  schema: any;
  uiSchema: any;
  isLoading: boolean;
  onSubmit: (formData: any) => void;
  submitLoading?: boolean;
}

const BaseDialog = React.memo(
  ({ open, handleClose, title, formData, schema, uiSchema, isLoading, onSubmit, submitLoading }: BaseDialogProps) => {
    const [internalFormData, setInternalFormData] = useState(formData);

    useEffect(() => {
      setInternalFormData(formData);
    }, [formData]);

    const handleDialogCLose = () => {
      if (!submitLoading) {
        handleClose();
      }
    };

    return (
      <Dialog open={open} onClose={handleDialogCLose} fullWidth maxWidth="sm" disableEscapeKeyDown>
        {isLoading && (
          <Box height={400} width="100%" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        {!isLoading && (
          <>
            <DialogTitle>
              <Typography variant="h6">{title}</Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                disabled={submitLoading}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <ThemeForm
                ref={formRef}
                schema={schema}
                uiSchema={uiSchema}
                validator={validator}
                formData={internalFormData}
                onChange={({ formData }) => setInternalFormData(formData)}
                onSubmit={({ formData }) => onSubmit(formData)}
                disabled={submitLoading}
                omitExtraData
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="secondary" disabled={submitLoading}>
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                onClick={() => formRef.current?.submit()}
                disabled={submitLoading}
                startIcon={submitLoading ? <CircularProgress size={16} /> : null}
              >
                Submit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  }
);

export default BaseDialog;
