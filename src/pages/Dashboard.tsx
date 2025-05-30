
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
import { useGetTaskStatsQuery, useGetTasksQuery } from '../store/api/tasksApi';
import { useGetTeamUsersQuery } from '../store/api/usersApi';
import { useAppSelector } from '../store/hooks';
import { customColors } from '../theme/theme';
import StatCard from '../components/Dashboard/StatCard';
import ProgressOverview from '../components/Dashboard/ProgressOverview';
import RecentTasks from '../components/Dashboard/RecentTasks';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  
  const { 
    data: taskStats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useGetTaskStatsQuery();
  
  const { 
    data: recentTasksData, 
    isLoading: tasksLoading 
  } = useGetTasksQuery({ limit: 5 });
  
  const { 
    data: teamUsers, 
    isLoading: usersLoading 
  } = useGetTeamUsersQuery();

  const calculateCompletionRate = () => {
    if (!taskStats) return 0;
    return taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your tasks today.
      </Typography>

      {/* Statistics Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={taskStats?.total || 0}
            icon={<Assignment />}
            color={customColors.priority.medium}
            subtitle="All tasks"
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={taskStats?.completed || 0}
            icon={<CheckCircle />}
            color={customColors.status.completed}
            subtitle={`${calculateCompletionRate().toFixed(1)}% completion rate`}
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={taskStats?.pending || 0}
            icon={<Schedule />}
            color={customColors.status.pending}
            subtitle="In progress"
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={taskStats?.overdue || 0}
            icon={<Warning />}
            color={customColors.priority.high}
            subtitle="Need attention"
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={6}>
          <ProgressOverview
            taskStats={taskStats}
            statsLoading={statsLoading}
            refetchStats={refetchStats}
          />
        </Grid2>

        <Grid2 xs={12} md={6}>
          <RecentTasks
            recentTasksData={recentTasksData}
            tasksLoading={tasksLoading}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
