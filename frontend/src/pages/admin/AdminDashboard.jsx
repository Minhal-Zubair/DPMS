import { useEffect, useState } from "react";
import axios from "axios";

import {
  Users,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  UserPlus,
  FileCheck,
  BarChart3,
} from "lucide-react";

import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    recentApplications: [],
    recentActivities: [],
  });

  const [recentApplications, setRecentApplications] = useState([]);

  /* ==========================================
      Statistics Cards
  ========================================== */

  const stats = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      color: "#2563EB",
      icon: <Users size={30} />,
      growth: "",
    },

    {
      title: "Applications",
      value: dashboard.totalApplications,
      color: "#7C3AED",
      icon: <FileText size={30} />,
      growth: "",
    },

    {
      title: "Pending",
      value: dashboard.pendingApplications,
      color: "#F59E0B",
      icon: <Clock3 size={30} />,
      growth: "",
    },

    {
      title: "Approved",
      value: dashboard.approvedApplications,
      color: "#16A34A",
      icon: <CheckCircle2 size={30} />,
      growth: "",
    },

    {
      title: "Rejected",
      value: dashboard.rejectedApplications,
      color: "#DC2626",
      icon: <XCircle size={30} />,
      growth: "",
    },
  ];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/dashboard",
      );

      setDashboard(response.data);
      setRecentApplications(response.data.recentApplications || []);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    }
  };

  /* ==========================================
      Quick Actions
  ========================================== */

  const quickActions = [
    {
      title: "Manage Users",
      icon: <Users size={34} />,
    },

    {
      title: "Review Applications",
      icon: <FileCheck size={34} />,
    },

    {
      title: "Generate Reports",
      icon: <BarChart3 size={34} />,
    },

    {
      title: "Add New User",
      icon: <UserPlus size={34} />,
    },
  ];

  /* ==========================================
      Status Badge Helper
  ========================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "approved";

      case "Rejected":
        return "rejected";

      case "Submitted":
        return "submitted";

      case "Under Review":
        return "underreview";

      case "Under_Review":
        return "underreview";

      default:
        return "submitted";
    }
  };


  return (
    <>
      {/* Header */}

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>Welcome back! Monitor users, applications and system activity.</p>
        </div>

        <div className="header-badge">
          <TrendingUp size={18} />
          System Running Normally
        </div>
      </div>

      {/* Statistics */}

      <div className="stats-grid">
        {stats.map((card, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              borderTop: `5px solid ${card.color}`,
            }}
          >
            <div>
              <h4>{card.title}</h4>

              <h2>{card.value}</h2>

              {card.growth && (
                <span
                  style={{
                    color: card.color,
                  }}
                >
                  {card.growth} this month
                </span>
              )}
            </div>

            <div
              className="icon-circle"
              style={{
                background: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}

      <div className="dashboard-section">
        <h2>Quick Actions</h2>

        <div className="quick-grid">
          {quickActions.map((item, index) => (
            <div key={index} className="quick-card">
              {item.icon}

              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Grid */}

      <div className="middle-grid">
        {/* Applications */}

        <div className="table-card">
          <div className="card-title">
            <FileText size={22} />

            <h2>Recent Applications</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>

                <th>Applicant</th>

                <th>Product</th>

                <th>Status</th>

                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recentApplications.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No recent applications found.
                  </td>
                </tr>
              ) : (
                dashboard.recentApplications.map((app, index) => (
                  <tr key={index}>
                    <td>{app.applicationNumber}</td>

                    <td>{app.applicant}</td>

                    <td>{app.product}</td>

                    <td>
                      <span className={`status ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    <td>{app.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}

        <div className="activity-card">
          <div className="card-title">
            <Activity size={22} />
            <h2>Recent Activities</h2>
          </div>

          {dashboard.recentActivities.length === 0 ? (
            <p style={{ color: "#9CA3AF", padding: "10px 0" }}>No recent activity yet.</p>
          ) : (
            dashboard.recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div>
                  <p style={{ margin: 0 }}>{activity.description}</p>
                  {activity.time && (
                    <small style={{ color: "#9CA3AF", fontSize: "12px" }}>
                      {activity.time}
                    </small>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="summary-card">
        <div>
          <h2>Performance Summary</h2>
          <p>
            Total applications: <strong>{dashboard.totalApplications}</strong> &nbsp;|&nbsp;
            Approved: <strong>{dashboard.approvedApplications}</strong> &nbsp;|&nbsp;
            Pending: <strong>{dashboard.pendingApplications}</strong> &nbsp;|&nbsp;
            Rejected: <strong>{dashboard.rejectedApplications}</strong>
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;