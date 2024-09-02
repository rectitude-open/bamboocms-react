import React from 'react';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { TableActionConfig } from '../TablePage.types';

interface DuplicateActionProps {
  actionConfig: { [key: string]: TableActionConfig };
  handleAction: any;
}

const DuplicateAction = ({ actionConfig, handleAction }: DuplicateActionProps) => {
  if (!actionConfig?.add) return;

  const addConfig = actionConfig?.add;
  return (
    <>
      <Button
        color="primary"
        variant="contained"
        startIcon={<Add />}
        sx={{ ml: 2 }}
        onClick={() => {
          handleAction(addConfig);
        }}
      >
        Add
      </Button>
    </>
  );
};

export default React.memo(DuplicateAction);
