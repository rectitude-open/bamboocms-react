import { Logout } from '@mui/icons-material';
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useUserStore } from '@/stores/user';

import AccountAvatar from './AccountAvatar';

const Account = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const { logout, profile } = useUserStore(
    useShallow((state) => ({
      logout: state.logout,
      profile: state.profile,
    }))
  );
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignOut = () => {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    enqueueSnackbar('Sign-out successful.', { variant: 'info' });
    setAnchorEl(null);
    logout();
    router.replace(`/sign-in?redirect=${redirect}`);
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
  const id = open ? 'account-menu' : undefined;

  return (
    <>
      <Stack sx={{ py: 0.5 }}>
        <IconButton
          onMouseEnter={handleOpen}
          aria-label={'Admin'}
          size='small'
          aria-haspopup='true'
          sx={{ width: 'fit-content', margin: '0 auto' }}>
          <AccountAvatar profile={profile} />
        </IconButton>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        id={id}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{ pointerEvents: 'none' }}
        disableAutoFocusItem
        slotProps={{
          paper: {
            onMouseEnter: cancelClose,
            onMouseLeave: handleClose,
            elevation: 0,
            sx: {
              'pointerEvents': 'auto',
              'overflow': 'visible',
              'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              'mt': 1.5,
              '& .MuiAvatar-root': {
                width: 22,
                height: 22,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Account;
