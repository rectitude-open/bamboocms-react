import FileDownload from '@mui/icons-material/FileDownload';
import FileUpload from '@mui/icons-material/FileUpload';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import UserTable from './components/UserTable';

import type { Metadata } from 'next';

export const metadata = {
  title: `User`,
} satisfies Metadata;

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction='row' spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant='h4'>User</Typography>
        </Stack>

        <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
          <Button variant='outlined' size='small' startIcon={<FileUpload />}>
            Import
          </Button>
          <Button variant='outlined' size='small' startIcon={<FileDownload />}>
            Export
          </Button>
        </Stack>
      </Stack>
      <UserTable />
    </Stack>
  );
}
