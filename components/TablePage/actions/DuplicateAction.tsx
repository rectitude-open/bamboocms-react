import { FileCopy } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { type MRT_Row, type MRT_RowData } from 'material-react-table';
import React from 'react';

import { TableActionConfig } from '../TablePage.types';

interface DuplicateActionProps<T extends MRT_RowData> {
  row: MRT_Row<T>;
  actionConfig: TableActionConfig<T>;
  handleAction: any;
}

const DuplicateAction = <T extends MRT_RowData>({ row, actionConfig, handleAction }: DuplicateActionProps<T>) => {
  if (!row?.original?.id || !actionConfig?.duplicate) return;

  const duplicateConfig = actionConfig?.duplicate;
  return (
    <>
      <MenuItem
        onClick={() => {
          handleAction(duplicateConfig, row.original);
        }}>
        <FileCopy />
        Duplicate
      </MenuItem>
    </>
  );
};

export default React.memo(DuplicateAction) as typeof DuplicateAction;
