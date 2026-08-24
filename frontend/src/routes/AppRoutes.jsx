import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// ================= Layouts =================
import DashboardLayout from "../components/layout/DashboardLayout";
import AdminLayout from "../components/layout/AdminLayout";

// ================= Authentication =================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleSelection from "../pages/auth/RoleSelection";

// ================= User Pages =================
import UserDashboard from "../pages/dashboard/UserDashboard";
import NewApplication from "../pages/application/NewApplication";
import DocumentUpload from "../pages/application/DocumentUpload";
import DocumentTypes from "../pages/application/DocumentTypes";
import MyApplications from "../pages/MyApplications/MyApplication";
import ApplicationDetails from "../pages/MyApplications/ApplicationDetails";
import ApplicationTracking from "../pages/MyApplications/ApplicationTracking";
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/profile/ChangePassword";
import Notifications from "../pages/notifications/Notifications";
import Settings from "../pages/settings/Settings";

// ================= Admin Pages =================
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import Reports from "../pages/admin/Reports";
import SLAManagement from "../pages/admin/SLAManagement";
import AuditLogs from "../pages/admin/AuditLogs";
import SystemSettings from "../pages/admin/SystemSettings";
import ApplicationReview from "../pages/admin/ApplicationReview";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/user/dashboard" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= Authentication ================= */}

      <Route
        path="/login"
        element={
          localStorage.getItem("token") ? (
            localStorage.getItem("role") === "ADMIN"
              ? <Navigate to="/admin/dashboard" replace />
              : <Navigate to="/user/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/select-role" element={<RoleSelection />} />

      {/* ================= USER ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="user/dashboard" element={<UserDashboard />} />

          <Route path="new-application" element={<NewApplication />} />

          <Route path="application/upload" element={<DocumentUpload />} />

          <Route
            path="application/document-types"
            element={<DocumentTypes />}
          />

          <Route path="applications" element={<MyApplications />} />

          <Route path="applications/details" element={<ApplicationDetails />} />

          <Route
            path="applications/tracking"
            element={<ApplicationTracking />}
          />

          <Route path="profile" element={<Profile />} />

          <Route path="change-password" element={<ChangePassword />} />

          <Route path="notifications" element={<Notifications />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="applications" element={<ApplicationReview />} />

          <Route path="users" element={<ManageUsers />} />

          <Route path="reports" element={<Reports />} />

          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="sla" element={<SLAManagement />} />

          <Route path="settings" element={<SystemSettings />} />
        </Route>
      </Route>

      {/* 404 */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;