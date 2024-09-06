import React from 'react';
import { Add, Edit } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { type MRT_Row, type MRT_RowData } from 'material-react-table';

import { TableActionConfig } from '../TablePage.types';

interface EditActionProps<T extends MRT_RowData> {
  row: MRT_Row<T>;
  actionConfig: TableActionConfig<T>;
  handleAction: any;
}

const EditAction = <T extends MRT_RowData>({ row, actionConfig, handleAction }: EditActionProps<T>) => {
  if (!row?.original?.id || !actionConfig?.edit) return;

  const editConfig = actionConfig?.edit;

  return (
    <>
      <IconButton
        color="secondary"
        onClick={() => {
          handleAction(editConfig, row.original);
        }}
      >
        <Edit />
      </IconButton>
    </>
  );
};

export default React.memo(EditAction) as typeof EditAction;
