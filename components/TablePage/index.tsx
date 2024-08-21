import React, { useCallback, useMemo, useState } from 'react';
import { Delete, Edit, FileCopy, MoreHoriz } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Divider, IconButton, lighten, MenuItem, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RJSFSchema } from '@rjsf/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

import type { ApiResponse } from '@/types/api';
import { BaseEntity } from '@/types/BaseEntity';
import FormDialog from '@/components/FormDialog/FormDialog';

import StyledMenu from './components/StyledMenu';
import { TablePageProps } from './TablePage.types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    common: {
      white: '#ffffff',
    },
  },
});

const TablePage = <T extends BaseEntity>({
  columns,
  actionConfig,
  defaultSorting = [],
  tableService,
}: TablePageProps<T>) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState(undefined);
  const [sorting, setSorting] = useState<MRT_SortingState>(defaultSorting);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [id, setId] = useState<number | undefined>();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogInitService, setDialogInitService] = useState();
  const [dialogSubmitService, setDialogSubmitService] = useState();
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogSchema, setDialogSchema] = useState<RJSFSchema>();
  const [dialogUiSchema, setDialogUiSchema] = useState();

  const { data, isError, isLoading, isRefetching, refetch } = useQuery<ApiResponse>({
    queryKey: ['table-data', columnFilters, globalFilter, pagination.pageIndex, pagination.pageSize, sorting],
    queryFn: async () => {
      const params = {
        current_page: pagination.pageIndex + 1,
        globalFilter: globalFilter,
        per_page: pagination.pageSize,
        filters: JSON.stringify(columnFilters ?? []),
        sorting: JSON.stringify(sorting ?? []),
      };
      const response = await tableService(params);
      return response;
    },
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmitSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const formDialog = useMemo(
    () =>
      openDialog && (
        <FormDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          title={dialogTitle}
          id={id!}
          initService={dialogInitService}
          submitService={dialogSubmitService}
          schema={dialogSchema}
          uiSchema={dialogUiSchema}
          onSubmitSuccess={handleSubmitSuccess}
        />
      ),
    [
      openDialog,
      id,
      dialogTitle,
      dialogInitService,
      dialogSubmitService,
      handleSubmitSuccess,
      dialogSchema,
      dialogUiSchema,
    ]
  );

  const editAction = ({ row, table }) => (
    <IconButton
      color="secondary"
      onClick={() => {
        if (row?.original?.id) {
          const formType = actionConfig?.edit?.formType ?? 'page';
          switch (formType) {
            case 'dialog': {
              setDialogTitle(actionConfig.edit.title ?? 'Edit');
              setDialogInitService(() => (id) => actionConfig?.edit?.initService(id));
              setDialogSubmitService(() => (data) => actionConfig?.edit?.submitService(data));
              setDialogSchema(actionConfig.edit.schema);
              setDialogUiSchema(actionConfig.edit.uiSchema);
              setId(row.original.id);
              setOpenDialog(true);
            }
          }
        }
      }}
    >
      <Edit />
    </IconButton>
  );

  return (
    <Card>
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={(data?.data as Record<string, unknown>[]) ?? []}
          initialState={{
            columnPinning: { right: ['mrt-row-actions'] },
          }}
          manualFiltering
          manualPagination
          manualSorting
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: 'error',
                  children: 'Error loading data',
                }
              : undefined
          }
          enableRowSelection
          enableColumnPinning
          state={{
            isLoading,
            showProgressBars: isRefetching,
            columnFilters,
            globalFilter,
            pagination,
            showAlertBanner: isError,
            sorting,
          }}
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          columnFilterDisplayMode="popover"
          renderToolbarInternalActions={({ table }) => (
            <>
              <MRT_ToggleDensePaddingButton table={table} />
              <MRT_ShowHideColumnsButton table={table} />
              <MRT_ToggleFullScreenButton table={table} />
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => refetch()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={(rowProps) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
              {editAction(rowProps)}
              <IconButton
                aria-label="more"
                id="more-button"
                aria-controls={open ? 'action-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHoriz />
              </IconButton>
              <StyledMenu
                id="action-menu"
                MenuListProps={{
                  'aria-labelledby': 'more-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>
                  <FileCopy />
                  Duplicate
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem>
                  <Delete />
                  Delete
                </MenuItem>
              </StyledMenu>
            </Box>
          )}
          paginationDisplayMode="pages"
          muiPaginationProps={{
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined',
          }}
          positionToolbarAlertBanner="top"
          renderBottomToolbarCustomActions={({ table }) => {
            const handleDelete = () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                alert('deleting ' + row.getValue('name'));
              });
            };
            return (
              <Box
                sx={(theme) => ({
                  backgroundColor: lighten(theme.palette.background.default, 0.05),
                  display: 'flex',
                  gap: '0.5rem',
                  p: '8px',
                  justifyContent: 'space-between',
                })}
              >
                <Box>
                  <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      color="error"
                      onClick={handleDelete}
                      variant="contained"
                      startIcon={<Delete />}
                      disabled={!table.getIsSomeRowsSelected()}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          }}
          rowCount={data?.meta?.total ?? 0}
        />
        {formDialog}
      </ThemeProvider>
    </Card>
  );
};
export default TablePage;
