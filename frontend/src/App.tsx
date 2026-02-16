import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/context/providers/AppProviders';
import { ProtectedRoute, PublicRoute, AdminRoute } from '@/components/common/AuthGuard/AuthGuard';
import AppLayout from '@/components/layout/AppLayout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import TaskManager from './pages/TaskManager/TaskManager';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';

const App = () => (
  <AppProviders>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="/tasks"
            element={
              <AdminRoute>
                <TaskManager />
              </AdminRoute>
            }
          />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;
