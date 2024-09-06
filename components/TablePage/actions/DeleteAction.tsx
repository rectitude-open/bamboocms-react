import React from 'react';
import { Delete } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { type MRT_Row, type MRT_RowData } from 'material-react-table';

import { type OpenConfirmationDialog } from '@/hooks/useConfirmationDialog';

import useRequests from '../hooks/useRequests';
import { TableActionConfig } from '../TablePage.types';

interface DeleteActionProps<T extends MRT_RowData> {
  row: MRT_Row<T>;
  handleMoreMenuClose: () => void;
  actionConfig: TableActionConfig<T>;
  refetch: () => void;
  openConfirmationDialog: OpenConfirmationDialog;
}

const DeleteAction = <T extends MRT_RowData>({
  row,
  handleMoreMenuClose,
  actionConfig,
  refetch,
  openConfirmationDialog,
}: DeleteActionProps<T>) => {
  const { deleteMutation } = useRequests(actionConfig, refetch);

  return (
    <>
      <MenuItem
        onClick={() => {
          handleMoreMenuClose();
          openConfirmationDialog({
            title: `[ID: ${row.original.id}] ${row.original.title ?? row.original.name ?? ''}`,
            content: 'Are you sure you want to delete this record?',
            onConfirm: async () => {
              await deleteMutation.mutateAsync(row.original.id);
            },
          });
        }}
      >
        <Delete />
        Delete
      </MenuItem>
    </>
  );
};

export default React.memo(DeleteAction) as typeof DeleteAction;
