import React, { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Add, Delete, Edit, FileCopy, MoreHoriz } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Divider, IconButton, lighten, MenuItem, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MaterialReactTable,
  MRT_Row,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_TableInstance,
} from 'material-react-table';
import { useSnackbar } from 'notistack';

import type { ApiResponse } from '@/types/api';
import { BaseEntity } from '@/types/BaseEntity';
import useConfirmationDialog from '@/hooks/useConfirmationDialog';
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
  const { enqueueSnackbar } = useSnackbar();
  const [id, setId] = useState<number | undefined>();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogSchema, setDialogSchema] = useState<RJSFSchema>();
  const [dialogUiSchema, setDialogUiSchema] = useState<UiSchema>();
  const [dialogServices, setDialogServices] = useState({});
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

  const formDialog = useMemo(
    () => (
      <FormDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        title={dialogTitle}
        id={id!}
        services={dialogServices}
        schema={dialogSchema!}
        uiSchema={dialogUiSchema!}
        onSubmitSuccess={handleSubmitSuccess}
      />
    ),
    [openDialog, id, dialogTitle, dialogServices, handleSubmitSuccess, dialogSchema, dialogUiSchema, handleCloseDialog]
  );

  const handleAction = useCallback(
    (config: any, record: any = {}) => {
      const formType = config.formType ?? 'page';
      switch (formType) {
        case 'dialog':
          {
            setDialogTitle(config?.title ?? 'Edit');
            setDialogServices({
              initService: config.initService,
              submitService: config.submitService,
            });
            config?.schema && setDialogSchema(config.schema);
            config?.uiSchema && setDialogUiSchema(config.uiSchema);
            setId(record?.id ?? 0);
            setOpenDialog(true);
            handleMoreMenuClose();
          }
          break;
        case 'page':
          {
            const queryString = config?.params.map((param) => `${param}=${record[param]}`).join('&');
            router.push(`${config?.url}?${queryString}`);
          }
          break;
      }
    },
    [router, handleMoreMenuClose]
  );

  const editAction = useCallback(
    (row: MRT_Row<T>) => {
      if (!row?.original?.id || !actionConfig?.edit) return;

      const editConfig = actionConfig?.edit;

      return (
        <IconButton
          color="secondary"
          onClick={() => {
            handleAction(editConfig, row.original);
          }}
        >
          <Edit />
        </IconButton>
      );
    },
    [actionConfig, handleAction]
  );

  const addAction = useCallback(() => {
    if (!actionConfig?.add) return;

    const addConfig = actionConfig?.add;

    return (
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
    );
  }, [actionConfig, handleAction]);

  const duplicateAction = useCallback(
    (row: MRT_Row<T>) => {
      if (!row?.original?.id || !actionConfig?.duplicate) return;

      const duplicateConfig = actionConfig?.duplicate;

      return (
        <MenuItem
          onClick={() => {
            handleAction(duplicateConfig, row.original);
          }}
        >
          <FileCopy />
          Duplicate
        </MenuItem>
      );
    },
    [actionConfig, handleAction]
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return actionConfig?.delete?.submitService && (await actionConfig.delete.submitService(id));
    },
    onSuccess: (data) => {
      enqueueSnackbar(data?.message ?? 'Delete successfully!', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return actionConfig?.bulkDelete?.submitService && (await actionConfig.bulkDelete.submitService(ids));
    },
    onSuccess: (data) => {
      enqueueSnackbar(data?.message ?? 'Bulk Delete successfully!', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteAction = useCallback(
    (row: MRT_Row<T>) => {
      if (!row?.original?.id || !actionConfig?.delete) return;

      return (
        <MenuItem
          onClick={() => {
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
      );
    },
    [actionConfig, deleteMutation, openConfirmationDialog, handleMoreMenuClose]
  );

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
        {addAction()}
      </>
    ),
    [addAction, refetch]
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
              {editAction(row)}
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
                {selectedRow && duplicateAction(selectedRow)}
                <Divider sx={{ my: 0.5 }} />
                {selectedRow && deleteAction(selectedRow)}
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
                    <Button
                      color="error"
                      onClick={() => handleBulkDelete(table)}
                      variant="contained"
                      startIcon={<Delete />}
                      disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    >
                      Delete
                    </Button>
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
