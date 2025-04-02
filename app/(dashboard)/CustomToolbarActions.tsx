'use client';

import { ToolbarActions } from '@toolpad/core/DashboardLayout';

import Account from '@/components/Account';

const CustomToolbarActions = () => {
  return (
    <>
      <ToolbarActions />
      <Account />
    </>
  );
};

export default CustomToolbarActions;
