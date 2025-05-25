import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import TaskList from './components/TaskList';
import DealList from './components/DealList';
import ReportDashboard from './components/ReportDashboard';
import NotificationList from './components/NotificationList';
import UpgradeAccount from './components/UpgradeAccount';
import TaskCalendar from './components/TaskCalendar';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import AdvancedAnalytics from './components/AdvancedAnalytics';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advanced-analytics"
          element={
            <ProtectedRoute>
              <AdvancedAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deals"
          element={
            <ProtectedRoute>
              <DealList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <UpgradeAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <TaskCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/success" element={<div>Thành công!</div>} />
        <Route path="/cancel" element={<div>Đã hủy.</div>} />
      </Routes>
      <Chatbot />
    </ErrorBoundary>
  );
}

export default App;