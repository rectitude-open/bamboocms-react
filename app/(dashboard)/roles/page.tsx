import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import RoleTable from './components/RoleTable';

import type { Metadata } from 'next';

export const metadata = {
  title: `Customers | Dashboard | xxxxxxxx`,
} satisfies Metadata;

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction='row' spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          {/* <Typography variant='h4'>Roles</Typography> */}
          <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
            {/* <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button> */}
          </Stack>
        </Stack>
        <div>
          <Button variant='contained'>Add</Button>
        </div>
      </Stack>
      <RoleTable />
    </Stack>
  );
}
