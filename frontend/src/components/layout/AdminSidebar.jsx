import "./AdminSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";

const adminMenuItems = [
  { name: "Dashboard",           path: "/admin/dashboard",   icon: LayoutDashboard },
  { name: "Application Review",  path: "/admin/applications",icon: ClipboardCheck },
  { name: "SLA Management",      path: "/admin/sla",         icon: CalendarDays },
  { name: "Manage Users",        path: "/admin/users",       icon: Users },
  { name: "Reports",             path: "/admin/reports",     icon: FileText },
  { name: "Audit Logs",          path: "/admin/audit-logs",  icon: CalendarDays },
  { name: "Settings",            path: "/admin/settings",    icon: Settings },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("role");
    localStorage.removeItem("lastApplicationId");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h1>DPMS</h1>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;