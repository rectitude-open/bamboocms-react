import { DashboardLayout, ToolbarActions } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import * as React from 'react';

import CustomToolbarActions from './CustomToolbarActions';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      slots={{
        toolbarActions: CustomToolbarActions,
      }}>
      <PageContainer>{props.children}</PageContainer>
    </DashboardLayout>
  );
}
