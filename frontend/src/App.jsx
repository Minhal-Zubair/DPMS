// import { Routes, Route, Navigate } from "react-router-dom";

// // Auth Pages
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import UserDashboard from "./pages/dashboard/UserDashboard";
// import NewApplication from "./pages/application/NewApplication";
// import DocumentUpload from "./pages/application/DocumentUpload";
// import ReviewApplication from "./pages/application/ReviewApplication";
// import MyApplications from "./pages/MyApplications/MyApplication";
// import ApplicationDetails from "./pages/MyApplications/ApplicationDetails";
// import ApplicationTracking from "./pages/MyApplications/ApplicationTracking";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import DocumentTypes from "./pages/application/DocumentTypes";
// import Profile from "./pages/profile/Profile";
// import ChangePassword from "./pages/profile/ChangePassword";
// import Notifications from "./pages/notifications/Notifications";
// import Settings from "./pages/settings/Settings";
// import AppRoutes from "./routes/AppRoutes";

// // Temporary Pages

// const NotFound = () => <h1>404 - Page Not Found</h1>;

// function App() {
//   return (
   
//     <Routes>
//       {/* Default Route */}
//       <Route path="/" element={<Navigate to="/login" replace />} />

//       {/* Authentication */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* Dashboards */}
//       <Route path="/user/dashboard" element={<UserDashboard />} />
//       <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       <Route path="/new-application" element={<NewApplication />} />

//       <Route path="/application/upload" element={<DocumentUpload />} />
//       <Route path="/application/document-types" element={<DocumentTypes />} />
//       <Route path="/application/review" element={<ReviewApplication />} />

//       {/* My Applications */}
//       <Route path="/applications" element={<MyApplications />} />
//       <Route path="/applications/details" element={<ApplicationDetails />} />
//       <Route path="/applications/tracking" element={<ApplicationTracking />} />
//       <Route path="/profile" element={<Profile />} />
//       <Route path="/change-password" element={<ChangePassword />} />
//       <Route path="/notifications" element={<Notifications />} />
//       <Route path="/settings" element={<Settings />} />

//       {/* Admin */}
//       <Route path="/admin/dashboard" element={<AdminDashboard />} />

//       {/* 404 */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
  
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;