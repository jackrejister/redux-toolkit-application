
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  TrendingUp,
  Refresh,
} from '@mui/icons-material';
import { useGetTaskStatsQuery, useGetTasksQuery } from '../store/api/tasksApi';
import { useGetTeamUsersQuery } from '../store/api/usersApi';
import { useAppSelector } from '../store/hooks';
import { customColors } from '../theme/theme';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  
  // Demonstrate multiple RTK Query hooks
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

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={taskStats?.total || 0}
            icon={<Assignment />}
            color={customColors.priority.medium}
            subtitle="All tasks"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={taskStats?.completed || 0}
            icon={<CheckCircle />}
            color={customColors.status.completed}
            subtitle={`${calculateCompletionRate().toFixed(1)}% completion rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={taskStats?.pending || 0}
            icon={<Schedule />}
            color={customColors.status.pending}
            subtitle="In progress"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={taskStats?.overdue || 0}
            icon={<Warning />}
            color={customColors.priority.high}
            subtitle="Need attention"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Progress Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Progress Overview</Typography>
                <IconButton 
                  onClick={() => refetchStats()}
                  disabled={statsLoading}
                  size="small"
                >
                  <Refresh />
                </IconButton>
              </Box>
              
              {statsLoading ? (
                <LinearProgress />
              ) : (
                <Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Task Completion</Typography>
                      <Typography variant="body2">
                        {taskStats?.completed || 0}/{taskStats?.total || 0}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateCompletionRate()} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip 
                      label={`${taskStats?.completed || 0} Completed`}
                      color="success" 
                      size="small" 
                    />
                    <Chip 
                      label={`${taskStats?.pending || 0} Pending`}
                      color="warning" 
                      size="small" 
                    />
                    <Chip 
                      label={`${taskStats?.overdue || 0} Overdue`}
                      color="error" 
                      size="small" 
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              
              {tasksLoading ? (
                <LinearProgress />
              ) : (
                <List>
                  {recentTasksData?.tasks.slice(0, 5).map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: task.completed 
                                ? customColors.status.completed 
                                : customColors.priority[task.priority],
                              width: 32,
                              height: 32,
                            }}
                          >
                            {task.completed ? <CheckCircle /> : <Assignment />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip 
                                label={task.priority} 
                                size="small" 
                                color={
                                  task.priority === 'high' ? 'error' :
                                  task.priority === 'medium' ? 'warning' : 'success'
                                }
                              />
                              {task.completed && (
                                <Chip label="Completed" size="small" color="success" />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < 4 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Overview
              </Typography>
              
              {usersLoading ? (
                <LinearProgress />
              ) : (
                <Grid container spacing={2}>
                  {teamUsers?.slice(0, 6).map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        p={2} 
                        borderRadius={1}
                        bgcolor="background.paper"
                        border="1px solid"
                        borderColor="divider"
                      >
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.tasksCount} tasks
                          </Typography>
                          <Chip 
                            label={user.status} 
                            size="small" 
                            color={user.status === 'active' ? 'success' : 'default'}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
