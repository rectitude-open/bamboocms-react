import React from 'react';
import { Add, Edit } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { type MRT_Row } from 'material-react-table';

import { BaseEntity } from '@/types/BaseEntity';

import { TableActionConfig } from '../TablePage.types';

interface EditActionProps<T extends BaseEntity> {
  row: MRT_Row<T>;
  actionConfig: { [key: string]: TableActionConfig };
  handleAction: any;
}

const EditAction = <T extends BaseEntity>({ row, actionConfig, handleAction }: EditActionProps<T>) => {
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

export default React.memo(EditAction);
