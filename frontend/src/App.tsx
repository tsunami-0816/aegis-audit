import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Layout } from '@/components/layout/Layout';
import { Toast } from '@/components/common/Toast';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { ContentSubmit } from '@/pages/ContentSubmit';
import { WorkorderList } from '@/pages/WorkorderList';
import { WorkorderDetail } from '@/pages/WorkorderDetail';
import { Profile } from '@/pages/Profile';
import type { ToastMessage, ToastType } from '@/types';
import { generateId } from '@/utils';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute = ({ children, requireAdmin = false }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => {
  const { init } = useAuthStore();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    init();
  }, [init]);

  const addToast = (type: ToastType, message: string) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (err) {
        addToast('error', '网络连接失败');
        throw err;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [addToast]);

  return (
    <BrowserRouter>
      <Toast messages={toasts} onRemove={removeToast} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <PrivateRoute>
              <Layout>
                <ContentSubmit />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/workorders"
          element={
            <PrivateRoute>
              <Layout>
                <WorkorderList />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/workorders/:id"
          element={
            <PrivateRoute>
              <Layout>
                <WorkorderDetail />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
