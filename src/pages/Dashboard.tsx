
import React from 'react';
import {
  Grid2,
  Typography,
  Box,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { customColors } from '../theme/theme';
import StatCard from '../components/Dashboard/StatCard';

const Dashboard: React.FC = () => {
  // Simple mock data without any Redux dependencies
  const taskStats = {
    total: 25,
    completed: 15,
    pending: 7,
    overdue: 3,
  };

  const calculateCompletionRate = () => {
    return taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, User! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your tasks today.
      </Typography>

      {/* Statistics Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={taskStats.total}
            icon={<Assignment />}
            color={customColors.priority.medium}
            subtitle="All tasks"
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={taskStats.completed}
            icon={<CheckCircle />}
            color={customColors.status.completed}
            subtitle={`${calculateCompletionRate().toFixed(1)}% completion rate`}
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={taskStats.pending}
            icon={<Schedule />}
            color={customColors.status.pending}
            subtitle="In progress"
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={taskStats.overdue}
            icon={<Warning />}
            color={customColors.priority.high}
            subtitle="Need attention"
          />
        </Grid2>
      </Grid2>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Task management dashboard with simplified state management.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
