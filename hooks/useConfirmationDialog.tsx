import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { DialogProps } from '@mui/material';

export type OpenConfirmationDialog = (props: OpenConfirmationDialogProps) => void;
export interface OpenConfirmationDialogProps {
  title: React.ReactNode;
  content: React.ReactNode;
  onConfirm: () => Promise<void>;
}

const useConfirmationDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<React.ReactNode>('');
  const [content, setContent] = useState<React.ReactNode>('');
  const [isLoading, setIsLoading] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => Promise<void>>(() => async () => {});

  const handleOpen: OpenConfirmationDialog = ({ title, content, onConfirm }) => {
    setOpen(true);
    setTitle(title);
    setContent(content);
    setIsLoading(false);
    setOnConfirmCallback(() => async () => {
      setIsLoading(true);
      try {
        await onConfirm();
        setOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleDialogClose: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await onConfirmCallback();
  };

  const ConfirmationDialog = (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          autoFocus
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { ConfirmationDialog, openConfirmationDialog: handleOpen };
};

export default useConfirmationDialog;
