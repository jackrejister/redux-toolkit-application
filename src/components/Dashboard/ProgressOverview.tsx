
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Chip,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface ProgressOverviewProps {
  taskStats?: TaskStats;
  statsLoading: boolean;
  refetchStats: () => void;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  taskStats,
  statsLoading,
  refetchStats,
}) => {
  const calculateCompletionRate = () => {
    if (!taskStats) return 0;
    return taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;
  };

  return (
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
  );
};

export default ProgressOverview;
