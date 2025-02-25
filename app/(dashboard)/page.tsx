import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';

export default function HomePage() {
  return (
    <Typography>
      Welcome to <Link href='https://mui.com/toolpad/core/introduction'>Toolpad Core!</Link>
    </Typography>
  );
}
