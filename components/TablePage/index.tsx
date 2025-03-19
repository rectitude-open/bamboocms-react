import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, IconButton, lighten, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_RowData,
  type MRT_SortingState,
  type MRT_TableInstance,
} from 'material-react-table';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import FormDialog from '@/components/FormDialog/FormDialog';
import useConfirmationDialog from '@/hooks/useConfirmationDialog';
import type { ApiResponse } from '@/types/api';

import AddAction from './actions/AddAction';
import BulkDeleteAction from './actions/BulkDeleteAction';
import RowActions from './components/RowActions';
import { TablePageContext } from './contexts/TablePageContext';

import type { TablePageProps } from './TablePage.types';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';

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
  const [totalRowCount, setTotalRowCount] = useState(0);

  const { ConfirmationDialog, openConfirmationDialog } = useConfirmationDialog();

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
            // handleMoreMenuClose();
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
    // handleMoreMenuClose
    [router]
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
        <Tooltip arrow title='Refresh Data'>
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <AddAction actionConfig={actionConfig} handleAction={handleAction} />
      </>
    ),
    [actionConfig, handleAction, refetch]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    initialState: {
      columnPinning: { right: ['mrt-row-actions'] },
    },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    enableRowSelection: true,
    enableColumnPinning: true,
    state: {
      isLoading: isLoading || isRefetching,
      showProgressBars: isLoading || isRefetching,
      columnFilters,
      globalFilter,
      pagination,
      showAlertBanner: isError,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    columnFilterDisplayMode: 'popover',
    renderToolbarInternalActions,
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <RowActions<T>
        row={row}
        actionConfig={actionConfig}
        handleAction={handleAction}
        refetch={refetch}
        openConfirmationDialog={openConfirmationDialog}
      />
    ),
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      variant: 'outlined',
    },
    positionToolbarAlertBanner: 'top',
    renderBottomToolbarCustomActions: ({ table }) => (
      <Box
        sx={(theme) => ({
          backgroundColor: lighten(theme.palette.background.default, 0.05),
          display: 'flex',
          gap: '0.5rem',
          p: '8px',
          justifyContent: 'space-between',
        })}>
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
    ),
    rowCount: totalRowCount,
  });

  const contextValue = useMemo(
    () => ({
      table,
      refetch,
      isLoading,
      isRefetching,
      pagination,
      data: tableData,
    }),
    [table, refetch, isLoading, isRefetching, pagination, tableData]
  );

  return (
    <TablePageContext.Provider value={contextValue}>
      <Card>
        <ThemeProvider theme={theme}>
          <MaterialReactTable<T> table={table} />
          {formDialog}
          {ConfirmationDialog}
        </ThemeProvider>
      </Card>
    </TablePageContext.Provider>
  );
};
export default TablePage;
