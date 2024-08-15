import React, { createRef } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Form, withTheme, type IChangeEvent } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

import { Role } from '../types';

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
  'ui:submitButtonOptions': {
    norender: true,
  },
};

const ThemeForm = withTheme<Role>(Theme);
const formRef = createRef<Form>();

interface Props {
  open: boolean;
  handleClose: () => void;
  initialData: Role | undefined;
  onSubmit: (formData: Role) => void;
  title: string;
  isLoading: boolean;
}

const CustomDialog = ({ open, handleClose, initialData, onSubmit, title, isLoading }: Props) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
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
            formData={initialData}
            onSubmit={({ formData }: IChangeEvent<Role>) => onSubmit(formData)}
            omitExtraData
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={() => {
            formRef.current.submit();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
