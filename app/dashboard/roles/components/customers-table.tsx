'use client';

import * as React from 'react';
import { useMemo } from 'react';
import Card from '@mui/material/Card';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

// ];

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => fetch('http://localhost:31111/api/admin/administrator-roles').then((res) => res.json()),
  });

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
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
          data={data?.data ?? []}
          enableRowSelection
          enableColumnOrdering
          enableColumnPinning
          state={{
            isLoading,
            showProgressBars: isRefetching,
          }}
        />
      </ThemeProvider>
    </Card>
  );
}
