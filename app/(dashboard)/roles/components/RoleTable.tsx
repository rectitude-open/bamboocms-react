'use client';

import React, { useMemo } from 'react';
import { formatDate } from '@/utils/dateUtils';
import { Box, Card } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';

import TablePage from '@/components/TablePage';
import type { TableActionConfig } from '@/components/TablePage/TablePage.types';

import { schema, uiSchema } from '../schemas';
import * as services from '../services';
import type { Role } from '../types';

const RoleTable = () => {
  const columns = useMemo<MRT_ColumnDef<Role>[]>(
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
        enableSorting: false,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        // accessorFn: (row) => new Date(row.created_at),
        // id: 'created_at',
        accessorKey: 'created_at',
        header: 'Created At',
        filterFn: 'between',
        filterVariant: 'date',
        sortingFn: 'datetime',
        Cell: ({ cell }) =>
          formatDate(cell.getValue() as string, 'YYYY-MM-DD HH:mm:ss'),
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

  const tableActionConfig: TableActionConfig<Role> = {
    add: {
      formType: 'page',
      url: '/roles/add',
      requiredParams: [],
    },
    // add: {
    //   title: 'Add Role',
    //   services: {
    //     submitService: services.create,
    //   },
    //   formType: 'dialog',
    //   schema,
    //   uiSchema,
    // },
    edit: {
      formType: 'page',
      url: '/roles/edit',
      requiredParams: ['id'],
    },
    // edit: {
    //   title: 'Update Role',
    //   services: {
    //     initService: services.view,
    //     submitService: services.update,
    //   },
    //   formType: 'dialog',
    //   schema,
    //   uiSchema,
    //   requiredParams: ['id'],
    // },
    duplicate: {
      title: 'Duplicate Role',
      services: {
        initService: services.view,
        submitService: services.create,
      },
      formType: 'dialog',
      schema,
      uiSchema,
      requiredParams: ['id'],
    },
    delete: {
      services: {
        submitService: services.destroy,
      },
      formType: 'action',
    },
    bulkDelete: {
      services: {
        submitService: services.bulkDestroy,
      },
      formType: 'action',
    },
  };

  return (
    <Card>
      <TablePage<Role>
        actionConfig={tableActionConfig}
        tableService={services.fetch}
        columns={columns}
        defaultSorting={defaultSorting}
      />
    </Card>
  );
};

export default RoleTable;
