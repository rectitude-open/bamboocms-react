import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHoriz } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Divider, IconButton, lighten, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useQuery } from '@tanstack/react-query';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_Row,
  type MRT_RowData,
  type MRT_SortingState,
  type MRT_TableInstance,
} from 'material-react-table';

import type { ApiResponse } from '@/types/api';
import useConfirmationDialog from '@/hooks/useConfirmationDialog';
import FormDialog from '@/components/FormDialog/FormDialog';

import AddAction from './actions/AddAction';
import BulkDeleteAction from './actions/BulkDeleteAction';
import DeleteAction from './actions/DeleteAction';
import DuplicateAction from './actions/DuplicateAction';
import EditAction from './actions/EditAction';
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

const TablePage = <T extends MRT_RowData>({
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
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    schema: {} as RJSFSchema,
    uiSchema: {} as UiSchema,
    services: {},
    requiredParams: [] as string[],
    row: {} as T,
  });

  const router = useRouter();
  const [tableData, setTableData] = useState<T[]>([]);
  const [selectedRow, setSelectedRow] = useState<MRT_Row<T> | undefined>();
  const moreMenuOpen = Boolean(anchorEl);
  const [totalRowCount, setTotalRowCount] = useState(0);

  const { ConfirmationDialog, openConfirmationDialog } = useConfirmationDialog();

  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>, row: MRT_Row<T>) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMoreMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedRow(undefined);
  }, []);

  const { data, isError, isLoading, isRefetching, refetch } = useQuery<ApiResponse<T>>({
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
    enabled: !!tableService,
  });

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const formDialog = openDialog ? (
    <FormDialog {...dialogState} handleClose={handleCloseDialog} onSubmitSuccess={handleSubmitSuccess} />
  ) : null;

  const handleAction = useCallback(
    (config: any, record: any = {}) => {
      const formType = config.formType ?? 'page';
      switch (formType) {
        case 'dialog':
          {
            setDialogState({
              open: true,
              title: config?.title ?? 'Edit',
              schema: config?.schema,
              uiSchema: config?.uiSchema,
              services: config?.services,
              requiredParams: config?.requiredParams ?? [],
              row: record,
            });
            setOpenDialog(true);
            handleMoreMenuClose();
          }
          break;
        case 'page':
          {
            const queryString = (config?.requiredParams || [])
              .map((param: string) => `${param}=${record[param]}`)
              .join('&');
            router.push(`${config?.url}?${queryString}`);
          }
          break;
      }
    },
    [router, handleMoreMenuClose]
  );

  useEffect(() => {
    if (data?.data) {
      setTableData(data.data as T[]);

      if (data.meta?.total && data.meta?.total !== totalRowCount) {
        setTotalRowCount(data.meta?.total);
      }
    }
  }, [data, totalRowCount]);

  const renderToolbarInternalActions = useCallback(
    ({ table }: { table: MRT_TableInstance<T> }) => (
      <>
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <AddAction actionConfig={actionConfig} handleAction={handleAction} />
      </>
    ),
    [actionConfig, handleAction, refetch]
  );

  return (
    <Card>
      <ThemeProvider theme={theme}>
        <MaterialReactTable<T>
          columns={columns}
          data={tableData}
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
            isLoading: isLoading || isRefetching,
            showProgressBars: isLoading || isRefetching,
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
          renderToolbarInternalActions={renderToolbarInternalActions}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
              {row && <EditAction row={row} actionConfig={actionConfig} handleAction={handleAction} />}
              <IconButton
                aria-label="more"
                id="more-button"
                aria-controls={moreMenuOpen ? 'action-menu' : undefined}
                aria-expanded={moreMenuOpen ? 'true' : undefined}
                aria-haspopup="true"
                onClick={(event) => {
                  handleMoreMenuClick(event, row);
                }}
              >
                <MoreHoriz />
              </IconButton>
              <StyledMenu
                id="action-menu"
                MenuListProps={{
                  'aria-labelledby': 'more-button',
                }}
                anchorEl={anchorEl}
                open={moreMenuOpen}
                onClose={handleMoreMenuClose}
              >
                {selectedRow && (
                  <DuplicateAction row={selectedRow} actionConfig={actionConfig} handleAction={handleAction} />
                )}
                <Divider sx={{ my: 0.5 }} />
                {selectedRow && (
                  <DeleteAction
                    row={selectedRow}
                    handleMoreMenuClose={handleMoreMenuClose}
                    actionConfig={actionConfig}
                    refetch={refetch}
                    openConfirmationDialog={openConfirmationDialog}
                  />
                )}
              </StyledMenu>
            </Box>
          )}
          muiPaginationProps={{
            color: 'secondary',
            rowsPerPageOptions: [10, 20, 30],
            variant: 'outlined',
          }}
          positionToolbarAlertBanner="top"
          renderBottomToolbarCustomActions={({ table }) => {
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
                    <BulkDeleteAction
                      table={table}
                      actionConfig={actionConfig}
                      refetch={refetch}
                      openConfirmationDialog={openConfirmationDialog}
                    />
                  </Box>
                </Box>
              </Box>
            );
          }}
          rowCount={totalRowCount}
        />
        {formDialog}
        {ConfirmationDialog}
      </ThemeProvider>
    </Card>
  );
};
export default TablePage;
