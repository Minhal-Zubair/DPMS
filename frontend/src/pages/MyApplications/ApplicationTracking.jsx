import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLogsByApplicationId } from "../../services/applicationLogService";
import "./ApplicationTracking.css";

// Map raw action strings to human-readable titles
const ACTION_LABELS = {
  APPLICATION_SUBMITTED: "Application Submitted",
  STATUS_CHANGED: "Status Updated",
  DOCUMENT_UPLOADED: "Document Uploaded",
  DOCUMENT_VERIFIED: "Document Verified",
  DOCUMENT_REJECTED: "Document Rejected",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Application Approved",
  REJECTED: "Application Rejected",
};

function formatDateTime(isoString) {
  if (!isoString) return { date: "--", time: "--" };
  const d = new Date(isoString);
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

function getStatusClass(index, total) {
  if (index < total - 1) return "completed";
  return "active";
}

function ApplicationTracking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Accept application info passed via navigate state
  const {
    applicationId,
    applicationNumber,
    applicationStatus,
  } = location.state || {};

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!applicationId) {
      setError("No application selected. Please go back and choose one.");
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        const response = await getLogsByApplicationId(applicationId);
        setLogs(response.data);
      } catch (err) {
        console.error("Failed to load logs:", err);
        setError("Could not load tracking data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [applicationId]);

  // Progress = percentage of logs vs max expected steps (5)
  const MAX_STEPS = 5;
  const progress = logs.length === 0
    ? 0
    : Math.min(Math.round((logs.length / MAX_STEPS) * 100), 100);

  // Determine if application is fully closed
  const isClosed =
    applicationStatus === "Approved" || applicationStatus === "Rejected";

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <div>
          <h1>Application Tracking</h1>
          <p>Track your application's processing status.</p>
        </div>
        <div className="tracking-number">
          {applicationNumber || "—"}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-card">
        <div className="progress-info">
          <h3>Overall Progress</h3>
          <span>{isClosed ? "100%" : `${progress}%`}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: isClosed ? "100%" : `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      {loading && <p style={{ padding: "20px" }}>Loading timeline…</p>}

      {error && (
        <div style={{ padding: "20px", color: "#dc2626" }}>{error}</div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div style={{ padding: "20px", color: "#64748b" }}>
          No activity recorded yet for this application.
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="timeline">
          {logs.map((log, index) => {
            const { date, time } = formatDateTime(log.actionTime);
            const statusClass = isClosed
              ? "completed"
              : getStatusClass(index, logs.length);
            const label =
              ACTION_LABELS[log.action] || log.action.replace(/_/g, " ");

            return (
              <div
                className={`timeline-item ${statusClass}`}
                key={log.id}
              >
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-top">
                    <h3>{label}</h3>
                    <span className={`badge ${statusClass}`}>
                      {statusClass.toUpperCase()}
                    </span>
                  </div>
                  {log.description && (
                    <p>
                      <strong>Details:</strong> {log.description}
                    </p>
                  )}
                  <small>
                    {date} • {time}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="tracking-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

export default ApplicationTracking;
