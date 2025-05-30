
import React, { useEffect } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeNotification } from '../store/slices/uiSlice';

const NotificationProvider: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.ui.notifications);

  useEffect(() => {
    // Auto-remove notifications after their duration
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);
      }
    });
  }, [notifications, dispatch]);

  const handleClose = (notificationId: string) => {
    dispatch(removeNotification(notificationId));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ top: 24 + index * 80 }}
          onClose={() => handleClose(notification.id)}
        >
          <Alert
            severity={notification.type}
            onClose={() => handleClose(notification.id)}
            variant="filled"
            sx={{ minWidth: 300 }}
          >
            <AlertTitle>
              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
            </AlertTitle>
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationProvider;
