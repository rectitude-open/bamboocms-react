import React, { Key } from 'react';
import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import { type MRT_RowData, type MRT_TableInstance } from 'material-react-table';

import useRequests from '../hooks/useRequests';
import { TableActionConfig } from '../TablePage.types';

interface BulkDeleteActionProps<T extends MRT_RowData> {
  table: MRT_TableInstance<T>;
  actionConfig: { [key: string]: TableActionConfig };
  refetch: () => void;
  // TODO: refactor types to useConfirmationDialog
  openConfirmationDialog: (props: { title: string; content: React.ReactNode; onConfirm: () => Promise<void> }) => void;
}

const BulkDeleteAction = <T extends MRT_RowData>({
  table,
  actionConfig,
  refetch,
  openConfirmationDialog,
}: BulkDeleteActionProps<T>) => {
  const { bulkDeleteMutation } = useRequests(actionConfig, refetch);

  const handleBulkDelete = (table: MRT_TableInstance<T>) => {
    const rowIds = table.getSelectedRowModel().flatRows.map((row) => row.original.id);
    const rowTitles = table
      .getSelectedRowModel()
      .flatRows.map((row) => (row.original.title ?? row.original.name ?? row.original.id) as Key);

    openConfirmationDialog({
      title: 'Bulk Delete',
      content: (
        <>
          Are you sure you want to delete these records?
          <ul>
            {rowTitles.map((title) => (
              <li key={title}>{String(title)}</li>
            ))}
          </ul>
        </>
      ),
      onConfirm: async () => {
        await bulkDeleteMutation.mutateAsync(rowIds);
        table.setRowSelection([] as any);
      },
    });
  };

  return (
    <Button
      color="error"
      onClick={() => handleBulkDelete(table)}
      variant="contained"
      startIcon={<Delete />}
      disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
    >
      Delete
    </Button>
  );
};

export default BulkDeleteAction;
