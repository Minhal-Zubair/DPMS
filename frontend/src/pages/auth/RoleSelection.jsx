import { useNavigate } from "react-router-dom";
import { User, ShieldCheck } from "lucide-react";
import "./RoleSelection.css";

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-container">

      <div className="role-card">

        <h1>Select Dashboard</h1>

        <p>
          Choose which dashboard you want to open.
        </p>

        <div className="role-buttons">

          <button
            onClick={() => navigate("/user/dashboard")}
            className="user-btn"
          >
            <User size={40} />
            <span>User Dashboard</span>
          </button>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="admin-btn"
          >
            <ShieldCheck size={40} />
            <span>Admin Dashboard</span>
          </button>

        </div>

      </div>

    </div>
  );
}

export default RoleSelection;