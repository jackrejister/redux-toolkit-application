
import React from 'react';
import { Typography, Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User profile management with settings, preferences,
        and account information using RTK Query mutations.
      </Typography>
    </Box>
  );
};

export default ProfilePage;
