import Avatar from '@mui/material/Avatar';
import { memo } from 'react';

import type { UserProfile } from '@/stores/user';

const AccountAvatar = ({ profile }: { profile: UserProfile | null }) => {
  const firstLetter = profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : '';

  return (
    <Avatar alt={profile?.display_name ?? ''} sx={{ width: 32, height: 32 }}>
      {firstLetter}
    </Avatar>
  );
};

export default memo(AccountAvatar);
