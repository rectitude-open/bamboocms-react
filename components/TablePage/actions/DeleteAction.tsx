import React from 'react';
import { Delete } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { type MRT_Row } from 'material-react-table';

import { BaseEntity } from '@/types/BaseEntity';

import useRequests from '../hooks/useRequests';
import { TableActionConfig } from '../TablePage.types';

interface DeleteActionProps<T extends BaseEntity> {
  row: MRT_Row<T>;
  handleMoreMenuClose: () => void;
  actionConfig: { [key: string]: TableActionConfig };
  refetch: () => void;
  openConfirmationDialog: (props: { title: string; content: string; onConfirm: () => Promise<void> }) => void;
}

const DeleteAction = <T extends BaseEntity>({
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
          console.log('DeleteAction', row.original.id);
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

export default React.memo(DeleteAction);
