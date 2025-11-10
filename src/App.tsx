import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { usePropertyStore } from './store/propertyStore';
import { useAppointmentStore } from './store/appointmentStore';
import { useReviewStore } from './store/reviewStore';
import { useNotificationStore } from './store/notificationStore';
import { ToastContainer } from './components/shared/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Customer pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { PropertyDetailsPage } from './pages/customer/PropertyDetailsPage';
import { BookAppointmentPage } from './pages/customer/BookAppointmentPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { BookingDetailsPage } from './pages/customer/BookingDetailsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { CustomerReviewsPage } from './pages/customer/CustomerReviewsPage';

// Agent pages
import { AgentDashboardPage } from './pages/agent/AgentDashboardPage';
import { AgentPropertiesPage } from './pages/agent/AgentPropertiesPage';
import { AddPropertyPage } from './pages/agent/AddPropertyPage';
import { AgentAppointmentsPage } from './pages/agent/AgentAppointmentsPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AgentApprovalsPage } from './pages/admin/AgentApprovalsPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AppointmentManagementPage } from './pages/admin/AppointmentManagementPage';
import { ReviewModerationPage } from './pages/admin/ReviewModerationPage';

function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const initializeProperties = usePropertyStore(state => state.initializeProperties);
  const initializeAppointments = useAppointmentStore(state => state.initializeAppointments);
  const initializeReviews = useReviewStore(state => state.initializeReviews);
  const initializeNotifications = useNotificationStore(state => state.initializeNotifications);

  useEffect(() => {
    // Initialize all stores with data from localStorage
    initializeAuth();
    initializeProperties();
    initializeAppointments();
    initializeReviews();
    initializeNotifications();
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Customer routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/properties/:id"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <PropertyDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/book-appointment"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/bookings"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/bookings/:id"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/reviews"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Agent routes */}
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/properties"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentPropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/properties/add"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AddPropertyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/properties/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AddPropertyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/appointments"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/performance"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/profile"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AgentApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppointmentManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReviewModerationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
