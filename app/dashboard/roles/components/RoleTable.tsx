'use client';

import React, { useMemo } from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Box, Card } from '@mui/material';
import { type MRT_ColumnDef } from 'material-react-table';

import TablePage from '@/components/TablePage';

import * as services from '../services';

const RoleTable = () => {
  const columns = useMemo<MRT_ColumnDef<Record<string, unknown>>[]>(
    () => [
      {
        accessorFn: (row) => `${row.id}`,
        id: 'id',
        header: 'ID',
        size: 100,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <span>ID: {renderedCellValue}--</span>
          </Box>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Role Name',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        // accessorFn: (row) => new Date(row.created_at),
        // id: 'created_at',
        accessorKey: 'created_at',
        header: 'Created At',
        filterFn: 'between',
        filterVariant: 'date',
        sortingFn: 'datetime',
        Cell: ({ cell }) => formatDate(cell.getValue() as string, 'YYYY-MM-DD HH:mm:ss'),
      },
    ],
    []
  );

  const defaultSorting = [
    {
      id: 'id',
      desc: true,
    },
  ];

  return (
    <Card>
      <TablePage services={services} columns={columns} defaultSorting={defaultSorting} />
    </Card>
  );
};

export default RoleTable;
