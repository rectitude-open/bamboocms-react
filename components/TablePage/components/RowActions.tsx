import { MoreHoriz } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import React, { useState, useCallback } from 'react';

import type { OpenConfirmationDialog } from '@/hooks/useConfirmationDialog';

import DeleteAction from '../actions/DeleteAction';
import DuplicateAction from '../actions/DuplicateAction';
import EditAction from '../actions/EditAction';

import StyledMenu from './StyledMenu';

import type { TableActionConfig } from '../TablePage.types';
import type { MRT_Row, MRT_RowData } from 'material-react-table';

interface RowActionsProps<T extends MRT_RowData> {
  row: MRT_Row<T>;
  actionConfig: TableActionConfig<T>;
  handleAction: (config: any, record: any) => void;
  refetch: () => void;
  openConfirmationDialog: OpenConfirmationDialog;
}

const RowActions = <T extends MRT_RowData>({
  row,
  actionConfig,
  handleAction,
  refetch,
  openConfirmationDialog,
}: RowActionsProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
      <EditAction row={row} actionConfig={actionConfig} handleAction={handleAction} />

      <IconButton
        aria-label='more'
        id={`more-button-${row.id}`}
        aria-controls={menuOpen ? `action-menu-${row.id}` : undefined}
        aria-expanded={menuOpen ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleMenuClick}>
        <MoreHoriz />
      </IconButton>

      <StyledMenu
        id={`action-menu-${row.id}`}
        slotProps={{
          list: {
            'aria-labelledby': `more-button-${row.id}`,
          },
          paper: {
            onMouseLeave: handleMenuClose,
          },
        }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}>
        <DuplicateAction row={row} actionConfig={actionConfig} handleAction={handleAction} />
        <Divider sx={{ my: 0.5 }} />
        <DeleteAction
          row={row}
          handleMoreMenuClose={handleMenuClose}
          actionConfig={actionConfig}
          refetch={refetch}
          openConfirmationDialog={openConfirmationDialog}
        />
      </StyledMenu>
    </Box>
  );
};

export default React.memo(RowActions) as typeof RowActions;
