'use client';

import { CheckCircle, Cancel } from '@mui/icons-material';
import { Box, Card, Chip } from '@mui/material';
import React, { useMemo } from 'react';

import TablePage from '@/components/TablePage';
import type { TableActionConfig } from '@/components/TablePage/TablePage.types';
import { formatDate } from '@/utils/dateUtils';

import { schema, uiSchema } from '../schemas';
import * as services from '../services';

import type { Role } from '../types';
import type { MRT_ColumnDef } from 'material-react-table';

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
            }}>
            <span>ID: {renderedCellValue}--</span>
          </Box>
        ),
      },
      {
        accessorKey: 'label',
        header: 'Label',
        enableClickToCopy: true,
        enableSorting: false,
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
