import React, { createRef } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
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

const BaseDialog = ({
  open,
  handleClose,
  title,
  formData,
  schema,
  uiSchema,
  isLoading,
  onSubmit,
  submitLoading,
}: BaseDialogProps) => {
  console.log('render BaseDialog');
  // console.log('formData in BaseDialog', formData);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <ThemeForm
            ref={formRef}
            schema={schema}
            uiSchema={uiSchema}
            validator={validator}
            formData={formData}
            onSubmit={({ formData }) => onSubmit(formData)}
            disabled={submitLoading}
            omitExtraData
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button type="button" color="primary" onClick={() => formRef.current?.submit()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseDialog;
