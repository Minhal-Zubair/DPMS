import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../services/dashboardService";

import { User } from "lucide-react";
import {
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Upload,
  FolderOpen,
} from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [dashboard, setDashboard] = useState({
    firstName: "",
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    recentApplications: [],
    recentNotifications: [],
  });

  const [loading, setLoading] = useState(true);

  const stats = [
    {
      title: "Applications",
      value: dashboard.totalApplications,
      color: "#2563EB",
      icon: <FileText size={30} />,
    },
    {
      title: "Pending",
      value: dashboard.pendingApplications,
      color: "#F59E0B",
      icon: <Clock3 size={30} />,
    },
    {
      title: "Approved",
      value: dashboard.approvedApplications,
      color: "#10B981",
      icon: <CheckCircle2 size={30} />,
    },
    {
      title: "Rejected",
      value: dashboard.rejectedApplications,
      color: "#EF4444",
      icon: <XCircle size={30} />,
    },
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getDashboard(userId);

        setDashboard(response.data);
      } catch (error) {
        console.log("Dashboard Error", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadDashboard();
    }
  }, [userId]);

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <>
      <h1 style={styles.heading}>Welcome Back, {dashboard.firstName}</h1>

      <p style={styles.notificationText}>
        Manage your document applications from one place.
      </p>

      {/* Cards */}

      <div style={styles.cardGrid}>
        {stats.map((card, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              borderTop: `5px solid ${card.color}`,
            }}
          >
            <div>
              <h3 style={styles.cardTitle}>{card.title}</h3>

              <h1 style={styles.number}>{card.value}</h1>
            </div>

            <div
              style={{
                ...styles.iconCircle,
                background: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}

      <div style={styles.section}>
        <h2>Quick Actions</h2>

        <div style={styles.actionGrid}>
          <div
            style={styles.actionCard}
            onClick={() => navigate("/new-application")}
          >
            <PlusCircle size={35} />
            <h3>New Application</h3>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate("/application/upload")}
          >
            <Upload size={35} />
            <h3>Upload Documents</h3>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate("/applications")}
          >
            <FolderOpen size={35} />
            <h3>My Applications</h3>
          </div>

          <div
            style={styles.actionCard}
            onClick={() => navigate("/application/document-types")}
          >
            <FileText size={35} />
            <h3>Document Types</h3>
          </div>

          <div style={styles.actionCard} onClick={() => navigate("/profile")}>
            <User size={35} />
            <h3>My Profile</h3>
          </div>
        </div>
      </div>

      <div style={styles.bottomGrid}>
        {/* Recent Applications */}

        <div style={styles.tableCard}>
          <>
            <h2>Recent Applications</h2>

            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableCell}>Application</th>

                  <th style={styles.tableCell}>Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={styles.tableCell}>
                      No Applications Found
                    </td>
                  </tr>
                ) : (
                  dashboard.recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={styles.tableCell}>{app.applicationNumber}</td>

                      <td style={styles.tableCell}>
                        <span
                          style={{
                            padding: "5px 12px",
                            borderRadius: "20px",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "600",
                            background:
                              app.status === "Approved"
                                ? "#10B981"
                                : app.status === "Rejected"
                                  ? "#EF4444"
                                  : app.status === "Under_Review"
                                    ? "#F59E0B"
                                    : "#3B82F6",
                          }}
                        >
                          {app.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        </div>

        {/* Recent Notifications */}

        <div style={styles.tableCard}>
          <h2>Recent Notifications</h2>

          {dashboard.recentNotifications.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            dashboard.recentNotifications.map((notification) => (
              <div key={notification.id} style={styles.notificationItem}>
                <h4 style={styles.notificationTitle}
                >
                  {notification.title}
                </h4>

                <p
                  style={{
                    marginTop: 6,
                    color:"var(--text-secondary)",
                  }}
                >
                  {notification.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  heading: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: "32px",
  },

  subHeading: {
    color: "#6B7280",
    marginBottom: "35px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "25px",
  },

  card: {
    background: "var(--card-bg)",
    borderRadius: "18px",
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "var(--shadow)",
    border:"1px solid var(--border-color)",
  },

  iconCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  cardTitle: {
    margin: 0,
    color:"var(--text-secondary)",
  },

  number: {
    marginTop: "10px",
    marginBottom: 0,
    fontSize: "42px",
    color:"var(--text-primary)",
  },

  section: {
    marginTop: "45px",
  },

  sectionTitle:{
color:"var(--text-primary)"
},

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "25px",
    marginTop: "20px",
  },

  actionCard: {
    background:"var(--card-bg)",
    borderRadius: "18px",
    padding: "30px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow:"var(--shadow)",
    border:"1px solid var(--border-color)",
    transition: ".3s",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    marginTop: "40px",
    alignItems: "start",
  },

  tableCard: {
    background:"var(--card-bg)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 5px 20px rgba(0,0,0,.08)",
    height: "fit-content",
    border:"1px solid var(--border-color)",
    boxShadow:"var(--shadow)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  notificationItem: {
  padding:"14px 0",
  borderBottom:"1px solid var(--border-color)",
},

notificationTitle: {
  margin: 0,
  fontSize: "15px",
  fontWeight: "600",
  color:"var(--text-primary)",
},

notificationText: {
  marginTop: "6px",
  marginBottom: 0,
  fontSize: "14px",
  color: "var(--text-secondary)",
},

  tableHead: {
    background:"var(--bg-primary)",
  },

  tableCell: {
    padding:"12px",
    borderBottom:"1px solid var(--border-color)",
    textAlign:"left",
    color:"var(--text-primary)",
  },
};

export default UserDashboard;
