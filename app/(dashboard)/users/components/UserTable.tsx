'use client';

import { CheckCircle, Cancel, AddSharp } from '@mui/icons-material';
import { Box, Card, Chip } from '@mui/material';
import React, { useMemo } from 'react';

import TablePage from '@/components/TablePage';
import type { TableActionConfig } from '@/components/TablePage/TablePage.types';
import { formatDate } from '@/utils/dateUtils';
import { useFilteredSchemas } from '@/utils/formSchemaUtils';

import { schema, uiSchema } from '../schemas/common';
import * as services from '../services';

import type { User } from '../types';
import type { MRT_ColumnDef } from 'material-react-table';

const UserTable = () => {
  const addSchema = useFilteredSchemas<User>({
    schema,
    uiSchema,
    omitKeys: ['status'],
  });

  const editSchema = useFilteredSchemas<User>({
    schema,
    uiSchema,
    omitKeys: ['password'],
  });

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorFn: (row) => `${row.id}`,
        id: 'id',
        header: 'ID',
        size: 100,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        accessorKey: 'display_name',
        header: 'Display Name',
        enableClickToCopy: true,
        enableSorting: false,
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        filterFn: 'between',
        filterVariant: 'date',
        sortingFn: 'datetime',
        Cell: ({ cell }) => formatDate(cell.getValue() as string, 'YYYY-MM-DD HH:mm:ss'),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: function ({ cell }) {
          const status = cell.getValue() as string;
          return status === 'active' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label='Active'
                size='small'
                color='success'
                variant='outlined'
                icon={<CheckCircle fontSize='small' />}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label='Inactive' size='small' color='error' variant='outlined' icon={<Cancel fontSize='small' />} />
            </Box>
          );
        },
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

  const tableActionConfig: TableActionConfig<User> = {
    add: {
      title: 'Add User',
      services: {
        submitService: services.create,
      },
      formType: 'dialog',
      schema: addSchema.filteredSchema,
      uiSchema: addSchema.filteredUiSchema,
    },
    edit: {
      title: 'Update User',
      services: {
        initService: services.view,
        submitService: services.update,
      },
      formType: 'dialog',
      schema: editSchema.filteredSchema,
      uiSchema: editSchema.filteredUiSchema,
      requiredParams: ['id'],
    },
    duplicate: {
      title: 'Duplicate User',
      services: {
        initService: services.view,
        submitService: services.create,
      },
      formType: 'dialog',
      schema: addSchema.filteredSchema,
      uiSchema: addSchema.filteredUiSchema,
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
      <TablePage<User>
        actionConfig={tableActionConfig}
        tableService={services.fetch}
        columns={columns}
        defaultSorting={defaultSorting}
      />
    </Card>
  );
};

export default UserTable;
