import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './application/store/store';
import { LoginForm } from './presentation/components/auth/LoginForm';
import { ChangePasswordForm } from './presentation/components/auth/ChangePasswordForm';
import { Dashboard } from './presentation/pages/Dashboard';
import { Users } from './presentation/pages/Users';
import { Classes } from './presentation/pages/Classes';
import { Roles } from './presentation/pages/Roles';
import { Professors } from './presentation/pages/Professors';
import { Modules } from './presentation/pages/Modules';
import { Salles } from './presentation/pages/Salles';
import { ProtectedRoute } from './presentation/components/common/ProtectedRoute';
import { DashboardLayout } from './presentation/components/layout/DashboardLayout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/change-password" element={<ChangePasswordForm />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Classes />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Roles />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/professors"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Professors />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/modules"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Modules />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/salles"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Salles />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
                      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                      <p className="text-gray-600 mt-2">Configure your settings here.</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <div className="ml-64 min-h-screen bg-gray-50 px-6 py-8">
                      <h1 className="text-2xl font-bold text-gray-900">Help</h1>
                      <p className="text-gray-600 mt-2">Get help and support here.</p>
                    </div>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;