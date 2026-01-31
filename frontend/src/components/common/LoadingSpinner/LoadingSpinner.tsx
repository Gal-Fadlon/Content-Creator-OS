import React from 'react';
import { CircularProgress } from '@mui/material';
import { LoadingContainer } from './LoadingSpinner.style';

const LoadingSpinner: React.FC = () => (
  <LoadingContainer>
    <CircularProgress color="primary" />
  </LoadingContainer>
);

export default React.memo(LoadingSpinner);
