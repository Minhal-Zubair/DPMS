import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const username = localStorage.getItem("username") || "Guest";

const firstName = localStorage.getItem("firstName");
const lastName = localStorage.getItem("lastName");

const displayName =
  firstName && lastName ? `${firstName} ${lastName}` : username;

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all login information
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");

    // Or simply:
    // localStorage.clear();

    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.navbar}>
      {/* Left Side */}
      <div style={styles.left}>
        <div style={styles.searchBox}>
          <Search 
size={18} 
color="var(--text-secondary)" 
/>
          <input
            type="text"
            placeholder="Search applications, CNIC, users..."
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Right Side */}
      <div style={styles.right}>
        {/* Dark Mode */}
        <button
style={styles.iconButton}
onClick={toggleTheme}
>

{
theme==="light"
?
<Moon size={20}/>
:
<Sun size={20}/>
}

</button>

        {/* Notifications */}
        <div style={styles.notification}>
          <Bell size={20} />
          <span style={styles.badge}>3</span>
        </div>

        {/* User */}
        <div style={styles.profile} onClick={() => setShowMenu(!showMenu)}>
          <div style={styles.avatar}>{displayName.charAt(0).toUpperCase()}</div>

          <div>
            <div style={styles.userName}>{displayName}</div>

            <div style={styles.role}>User</div>
          </div>

          <ChevronDown size={18} />

          {showMenu && (
            <div style={styles.dropdown}>
              <div style={styles.menuItem}>
                <User size={18} />
                My Profile
              </div>

              <div style={styles.menuItem}>
                <Settings size={18} />
                Settings
              </div>

              <div style={styles.divider}></div>

              <div
                style={{
                  ...styles.menuItem,
                  color: "#DC2626",
                }}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: 75,
    background:"var(--card-bg)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0 2px 15px rgba(0,0,0,.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  left: {
    flex: 1,
  },

  searchBox: {
    width: 400,
    background:"var(--bg-primary)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    gap: 10,
  },

  searchInput: {
    border: "none",
    outline: "none",
    color:"var(--text-primary)",
    background: "transparent",
    width: "100%",
    fontSize: 15,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    background:"var(--bg-primary)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  notification: {
    position: "relative",
    cursor: "pointer",
    width: 42,
    height: 42,
    borderRadius: "50%",
    background:"var(--bg-primary)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#EF4444",
    color: "#fff",
    fontSize: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    position: "relative",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#1976D2,#00C6FF)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

  userName: {
    fontWeight: "600",
    color:"var(--text-primary)",
    fontSize: 15,
  },

  role: {
    color:"var(--text-secondary)",
    fontSize: 12,
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 60,
    width: 220,
    background:"var(--card-bg)",
    color:"var(--text-primary)",
    border:"1px solid var(--border-color)",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    overflow: "hidden",
    animation: "fade .25s ease",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    color:"var(--text-primary)",
    gap: 12,
    padding: "14px 18px",
    cursor: "pointer",
    fontSize: 14,
  },

  divider: {
    borderTop:"1px solid var(--border-color)",
  },
};

export default Navbar;
