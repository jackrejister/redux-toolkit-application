
import React from 'react';
import { Typography, Box } from '@mui/material';

const TeamPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Team Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Team collaboration features demonstrating user management,
        role-based access, and team statistics using RTK Query.
      </Typography>
    </Box>
  );
};

export default TeamPage;
