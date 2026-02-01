import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/providers/AuthProvider';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Redirects to log in if user is not authenticated
 */
export const ProtectedRoute: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * PublicRoute - Redirects to dashboard if user is already authenticated
 */
export const PublicRoute: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
