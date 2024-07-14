import React, { useMemo, useState } from 'react';
import { Delete, Edit, FileCopy, More, MoreHoriz } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Divider, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import { MenuProps } from '@mui/material/Menu';
import { alpha, createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import {
  MaterialReactTable,
  MRT_ActionMenuItem,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from 'material-react-table';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    // minWidth: 150,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const TablePage = (): React.JSX.Element => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
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

  const {
    data: { data = [], meta } = {},
    isError,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [
      'table-data',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    // queryFn: () => fetch('http://localhost:31111/api/admin/administrator-roles').then((res) => res.json()),
    queryFn: async () => {
      const fetchURL = new URL(
        '/api/admin/administrator-roles',
        'http://localhost:31111'
        // process.env.NODE_ENV === 'production'
        //   ? 'https://www.material-react-table.com'
        //   : 'http://localhost:3000',
      );

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
      fetchURL.searchParams.set('size', `${pagination.pageSize}`);
      fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
      fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = await response.json();
      return json;
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Role Name',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
      },
    ],
    []
  );

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

  return (
    <Card>
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={data ?? []}
          initialState={{ columnPinning: { right: ['mrt-row-actions'] } }}
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
          enableColumnOrdering
          enableColumnPinning
          state={{
            isLoading,
            showProgressBars: isRefetching,
          }}
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          renderToolbarInternalActions={({ table }) => (
            <>
              <MRT_ToggleGlobalFilterButton table={table} />
              <MRT_ToggleFiltersButton table={table} />
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
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
              <IconButton
                color="secondary"
                onClick={() => {
                  table.setEditingRow(row);
                }}
              >
                <Edit />
              </IconButton>
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
          // renderRowActionMenuItems={({ row, table }) => [
          //   <IconButton
          //     color="secondary"
          //     onClick={() => {
          //       table.setEditingRow(row);
          //     }}
          //   >
          //     <Edit />
          //   </IconButton>,
          //   // <MRT_ActionMenuItem
          //   //   icon={<Edit />}
          //   //   key="edit"
          //   //   label="Edit"
          //   //   onClick={() => console.info('Edit')}
          //   //   table={table}
          //   // />,
          //   // <MRT_ActionMenuItem
          //   //   icon={<Delete />}
          //   //   key="delete"
          //   //   label="Delete"
          //   //   onClick={() => console.info('Delete')}
          //   //   table={table}
          //   // />,
          // ]}
        />
      </ThemeProvider>
    </Card>
  );
};
export default TablePage;
