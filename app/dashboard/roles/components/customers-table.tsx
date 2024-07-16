'use client';

import React from 'react';
import { Card } from '@mui/material';

import TablePage from '@/components/TablePage';

import * as services from '../services';

const CustomersTable = () => {
  return (
    <Card>
      <TablePage services={services} />
    </Card>
  );
};

export default CustomersTable;
