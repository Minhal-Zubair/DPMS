import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  FilePlus2,
  FolderOpen,
  Upload,
  User,
  KeyRound,
  Bell,
  Settings,
  LogOut,
  FileText,
  Moon,
  Sun,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/user/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "New Application",
    path: "/new-application",
    icon: <FilePlus2 size={20} />,
  },
  {
    name: "My Applications",
    path: "/applications",
    icon: <FolderOpen size={20} />,
  },
  {
    name: "Upload Documents",
    path: "/application/upload",
    icon: <Upload size={20} />,
  },
  {
    name: "Document Types",
    path: "/application/document-types",
    icon: <FileText size={20} />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <User size={20} />,
  },
  {
    name: "Change Password",
    path: "/change-password",
    icon: <KeyRound size={20} />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <Bell size={20} />,
    badge: true,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
];

function Sidebar() {
  const [notificationCount, setNotificationCount] = useState(0);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const {
    theme,
    toggleTheme
  } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");

    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/notifications/user/${userId}/count`,
        );

        setNotificationCount(response.data);
      } catch (error) {
        console.log("Notification count error", error);
      }
    };

    if (userId) {
      fetchNotificationCount();

      const interval = setInterval(fetchNotificationCount, 5000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  return (
    <div style={styles.sidebar}>
      {/* Logo */}

      <div style={styles.logoSection}>
        <div style={styles.logoCircle}>D</div>

        <div>
          <h2 style={styles.logo}>DPMS</h2>
          <p style={styles.logoText}>Enterprise Suite</p>
        </div>
      </div>

      {/* Navigation */}

      <div style={styles.menu}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : {}),
            })}
          >
            {item.icon}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
              }}
            >
              {item.name}

              {item.name === "Notifications" && notificationCount > 0 && (
                <span style={styles.notificationBadge}>{notificationCount}</span>
              )}
            </div>
          </NavLink>
        ))}
      </div>

      {/* Bottom */}

      <div style={styles.bottomSection}>
        <button
          style={styles.themeButton}
          onClick={toggleTheme}
        >
          {
            theme === "light"
              ?
              <>
                <Moon size={18} />
                Dark Mode
              </>
              :
              <>
                <Sun size={18} />
                Light Mode
              </>
          }

        </button>



        <button
          style={styles.logout}
          onClick={handleLogout}
        >

          <LogOut size={18} />

          Logout

        </button>
        </div>
      </div >
      );
}

      const styles = {
        bottomSection:{

        display:"flex",

      flexDirection:"column",

      gap:12,

},
      sidebar: {
        width: 260,
      height: "100vh",
      overflowY: "auto",
      background:"var(--sidebar-bg)",
      color:"var(--sidebar-text)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "fixed",
      left: 0,
      top: 0,
      padding: "25px 18px",
      boxSizing: "border-box",
      boxShadow: "var(--sidebar-shadow)",
  },

      logoSection: {
        display: "flex",
      alignItems: "center",
      gap: 15,
      marginBottom: 35,
  },

      logoCircle: {
        width: 55,
      height: 55,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#1976D2,#00C6FF)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: 24,
  },

      logo: {
        margin: 0,
      fontSize: 24,
  },

      logoText: {
        margin: 0,
      color:"var(--text-secondary)",
      fontSize: 13,
  },

      menu: {
        display: "flex",
      flexDirection: "column",
      gap: 8,
      flex: 1,
  },



      link: {
        display: "flex",
      alignItems: "center",
      gap: 15,
      padding: "14px 16px",
      textDecoration: "none",
      color:"var(--sidebar-text)",
      borderRadius: 12,
      transition: ".3s",
      fontSize: 15,
      fontWeight: 500,
  },

      active: {
        background: "linear-gradient(90deg,#1976D2,#00C6FF)",
      color: "white",
      boxShadow: "0 5px 15px rgba(25,118,210,.35)",
  },

      logout: {
        border: "none",
      borderRadius: 12,
      padding: "15px",
      background: "#DC2626",
      color: "white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontSize: 15,
      fontWeight: 600,
  },

      themeButton:{

        border:"1px solid var(--border-color)",

      borderRadius:12,

      padding:"14px",

      background:"var(--card-bg)",

      color:"var(--text-primary)",

      cursor:"pointer",

      display:"flex",

      alignItems:"center",

      justifyContent:"center",

      gap:10,

      fontSize:15,

      fontWeight:600,

},
      notificationBadge: {
        background: "#dc2626",
      color: "white",
      fontSize: 12,
      fontWeight: 600,
      minWidth: 20,
      height: 20,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
  },
};

      export default Sidebar;
