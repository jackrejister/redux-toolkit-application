
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import { CheckCircle, Assignment } from '@mui/icons-material';
import { customColors } from '../../theme/theme';

interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TasksData {
  tasks: Task[];
}

interface RecentTasksProps {
  recentTasksData?: TasksData;
  tasksLoading: boolean;
}

const RecentTasks: React.FC<RecentTasksProps> = ({
  recentTasksData,
  tasksLoading,
}) => {
  return (
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
  );
};

export default RecentTasks;
