import React from 'react';
import { Typography } from '@mui/material';
import { StyledSnackbar, StyledAlert } from './Snackbar.style';

export interface SnackbarMessage {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface AppSnackbarProps {
  messages: SnackbarMessage[];
  onClose: (id: string) => void;
}

const severityMap = {
  default: 'info',
  destructive: 'error',
  success: 'success',
} as const;

const AppSnackbar: React.FC<AppSnackbarProps> = ({ messages, onClose }) => {
  const currentMessage = messages[0];

  if (!currentMessage) return null;

  const severity = severityMap[currentMessage.variant || 'default'];

  return (
    <StyledSnackbar
      open={!!currentMessage}
      autoHideDuration={5000}
      onClose={() => onClose(currentMessage.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <StyledAlert
        onClose={() => onClose(currentMessage.id)}
        severity={severity}
        variant="filled"
      >
        {currentMessage.title && (
          <Typography variant="subtitle2" fontWeight={600}>
            {currentMessage.title}
          </Typography>
        )}
        {currentMessage.description && (
          <Typography variant="body2">{currentMessage.description}</Typography>
        )}
      </StyledAlert>
    </StyledSnackbar>
  );
};

export default React.memo(AppSnackbar);
