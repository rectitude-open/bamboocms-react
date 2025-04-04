import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Divider, IconButton, Popover, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';

import { useUserStore } from '@/stores/user';

const avatarContent = (
  <Avatar alt='Admin' sx={{ width: 32, height: 32 }}>
    Z
  </Avatar>
);

const Account = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignOut = () => {
    enqueueSnackbar('Sign-out successful.', { variant: 'info' });
    logout();
    setAnchorEl(null);
    router.push('/sign-in');
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    timerRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  const cancelClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Stack sx={{ py: 0.5 }}>
        <IconButton
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          aria-label={'Admin'}
          size='small'
          aria-haspopup='true'
          sx={{ width: 'fit-content', margin: '0 auto' }}>
          {avatarContent}
        </IconButton>
      </Stack>

      <Popover
        id={id}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
        disableRestoreFocus
        sx={{ pointerEvents: 'none' }}
        slotProps={{
          paper: {
            onMouseEnter: cancelClose,
            onMouseLeave: handleClose,
            sx: { pointerEvents: 'auto' },
          },
        }}>
        <Stack direction='row' justifyContent='space-between' sx={{ py: 1, px: 2, gap: 2 }}>
          <Stack direction='row' justifyContent='flex-start' spacing={2} overflow='hidden'>
            <Stack direction='column' justifyContent='space-evenly' overflow='hidden'>
              <Typography variant='body2' fontWeight='bolder' noWrap>
                Display Name
              </Typography>
              <Typography variant='caption' noWrap>
                Email
              </Typography>
              <Divider />
              <Button
                variant='outlined'
                size='small'
                disableElevation
                onClick={handleSignOut}
                sx={{
                  'textTransform': 'capitalize',
                  'fontWeight': 'normal',
                  'filter': 'opacity(0.9)',
                  'transition': 'filter 0.2s ease-in',
                  '&:hover': {
                    filter: 'opacity(1)',
                  },
                }}
                startIcon={<LogoutIcon />}>
                Sign Out
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

export default Account;
