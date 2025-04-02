import { DashboardLayout, ToolbarActions } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import * as React from 'react';

import AuthGuard from '@/components/AuthGuard';

import CustomToolbarActions from './CustomToolbarActions';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout
        slots={{
          toolbarActions: CustomToolbarActions,
        }}>
        <PageContainer>{props.children}</PageContainer>
      </DashboardLayout>
    </AuthGuard>
  );
}
