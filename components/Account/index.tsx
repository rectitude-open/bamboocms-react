import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import React from 'react';

const avatarContent = (
  <Avatar alt='Admin' sx={{ width: 32, height: 32 }}>
    Z
  </Avatar>
);

const Account = () => {
  return (
    <>
      <Tooltip title='Admin'>
        <Stack sx={{ py: 0.5 }}>
          <IconButton
            onClick={() => {}}
            aria-label={'Admin'}
            size='small'
            // aria-controls={open ? 'account-menu' : undefined}
            // aria-haspopup="true"
            // aria-expanded={open ? 'true' : undefined}
            sx={{ width: 'fit-content', margin: '0 auto' }}>
            {avatarContent}
          </IconButton>
        </Stack>
      </Tooltip>
    </>
  );
};

export default Account;
