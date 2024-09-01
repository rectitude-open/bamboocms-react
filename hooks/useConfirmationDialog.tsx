import { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const useConfirmationDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState(() => {});

  const handleOpen = ({ title, content, onConfirm }) => {
    setOpen(true);
    setTitle(title);
    setContent(content);
    setIsLoading(false);
    setOnConfirmCallback(() => async () => {
      setIsLoading(true);
      try {
        await onConfirm();
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        setOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    });
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
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">{content}</DialogContentText>
      </DialogContent>
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