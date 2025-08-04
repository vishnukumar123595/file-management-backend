// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import AdminDashboard from '../AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import UserDashboard from '../UsersDashboard/Index';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/dashboard/user" element={<UserDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    </Routes>
  );
};

export default AppRoutes;
