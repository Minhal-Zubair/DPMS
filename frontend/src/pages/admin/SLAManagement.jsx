import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Clock, CheckCheck } from "lucide-react";
import axios from "axios";

const API = "http://localhost:8080/api/sla";

const STATUS_CONFIG = {
  ON_TRACK:  { label: "On Track",  bg: "#dcfce7", color: "#16a34a", icon: CheckCircle },
  AT_RISK:   { label: "At Risk",   bg: "#fef3c7", color: "#d97706", icon: AlertTriangle },
  OVERDUE:   { label: "Overdue",   bg: "#fee2e2", color: "#dc2626", icon: XCircle },
  COMPLETED: { label: "Completed", bg: "#f1f5f9", color: "#64748b", icon: CheckCheck },
};

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: "12px", padding: "20px",
      border: "1px solid #e2e8f0", flex: 1, minWidth: "140px"
    }}>
      <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{label}</div>
      {sub && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{sub}</div>}
    </div>
  );
}

export default function SLAManagement() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [settingId, setSettingId] = useState(null);
  const [slaInput, setSlaInput] = useState({});
  const [saving, setSaving] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAll();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadAll, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAll = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/applications`),
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error("SLA load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetSLA = async (appId) => {
    const days = parseInt(slaInput[appId]);
    if (!days || days < 1) { alert("Enter a valid number of days"); return; }
    setSaving((p) => ({ ...p, [appId]: true }));
    try {
      await axios.put(`${API}/applications/${appId}/set`, { slaDays: days });
      setSettingId(null);
      await loadAll();
    } catch (err) {
      alert("Failed to set SLA");
    } finally {
      setSaving((p) => ({ ...p, [appId]: false }));
    }
  };

  const filtered = applications.filter((app) => {
    const matchFilter = filter === "ALL" || app.slaStatus === filter;
    const matchSearch = !search ||
      app.applicationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div style={{ padding: "40px", color: "#64748b" }}>Loading SLA data...</div>;

  return (
    <div style={{ padding: "28px", fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          SLA & Processing Management
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
          Set deadlines, track processing time and monitor SLA compliance
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "28px" }}>
          <StatCard label="Active Applications" value={stats.totalActive} color="#3b82f6" />
          <StatCard label="On Track" value={stats.onTrack} color="#16a34a" />
          <StatCard label="At Risk" value={stats.atRisk} color="#d97706" sub="< 2 days left" />
          <StatCard label="Overdue" value={stats.overdue} color="#dc2626" sub="Past deadline" />
          <StatCard label="Completed" value={stats.completed} color="#64748b" />
          <StatCard
            label="Avg Processing"
            value={`${stats.averageProcessingDays}d`}
            color="#7c3aed"
            sub="days per application"
          />
          <StatCard
            label="SLA Compliance"
            value={`${stats.slaComplianceRate}%`}
            color={stats.slaComplianceRate >= 80 ? "#16a34a" : "#dc2626"}
            sub="completed within SLA"
          />
        </div>
      )}

      {/* Filter + Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search application or applicant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "200px", padding: "9px 14px",
            borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px"
          }}
        />
        {["ALL", "ON_TRACK", "AT_RISK", "OVERDUE", "COMPLETED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px", borderRadius: "8px", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: 500,
              background: filter === f
                ? (STATUS_CONFIG[f]?.bg || "#3b82f6")
                : "#f1f5f9",
              color: filter === f
                ? (STATUS_CONFIG[f]?.color || "#fff")
                : "#64748b",
            }}
          >
            {f === "ALL" ? "All" : STATUS_CONFIG[f]?.label}
            {f !== "ALL" && stats && (
              <span style={{ marginLeft: "6px", opacity: 0.8 }}>
                ({f === "ON_TRACK" ? stats.onTrack
                  : f === "AT_RISK" ? stats.atRisk
                  : f === "OVERDUE" ? stats.overdue
                  : stats.completed})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Application #", "Applicant", "Product", "Status", "SLA", "Elapsed", "Remaining", "SLA Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>
                  No applications found.
                </td>
              </tr>
            )}
            {filtered.map((app) => {
              const cfg = STATUS_CONFIG[app.slaStatus] || STATUS_CONFIG.ON_TRACK;
              const isOverdue = app.slaStatus === "OVERDUE";
              return (
                <tr
                  key={app.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: isOverdue ? "#fff5f5" : "transparent"
                  }}
                >
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                    {app.applicationNumber}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569" }}>
                    {app.applicant}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569" }}>
                    {app.product}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                      background: app.status === "Approved" ? "#dcfce7"
                        : app.status === "Rejected" ? "#fee2e2"
                        : app.status === "Under Review" ? "#dbeafe" : "#f1f5f9",
                      color: app.status === "Approved" ? "#16a34a"
                        : app.status === "Rejected" ? "#dc2626"
                        : app.status === "Under Review" ? "#2563eb" : "#64748b"
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#64748b" }}>
                    {app.slaDays ? `${app.slaDays}d` : "—"}
                    {app.slaDeadline !== "Not set" && (
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{app.slaDeadline}</div>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                      background: app.daysElapsed > 5 ? "#fee2e2" : app.daysElapsed > 3 ? "#fef3c7" : "#dcfce7",
                      color: app.daysElapsed > 5 ? "#dc2626" : app.daysElapsed > 3 ? "#d97706" : "#16a34a"
                    }}>
                      {app.daysElapsed}d
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600,
                    color: app.daysRemaining < 0 ? "#dc2626" : app.daysRemaining <= 2 ? "#d97706" : "#16a34a"
                  }}>
                    {app.slaStatus === "COMPLETED" ? "—"
                      : app.daysRemaining < 0 ? `${Math.abs(app.daysRemaining)}d overdue`
                      : `${app.daysRemaining}d left`}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px",
                      fontWeight: 600, background: cfg.bg, color: cfg.color
                    }}>
                      {cfg.icon && <cfg.icon size={13} style={{marginRight:"4px"}}/>}{cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {settingId === app.id ? (
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          placeholder="Days"
                          value={slaInput[app.id] || ""}
                          onChange={(e) => setSlaInput((p) => ({ ...p, [app.id]: e.target.value }))}
                          style={{
                            width: "60px", padding: "5px 8px", borderRadius: "6px",
                            border: "1px solid #cbd5e1", fontSize: "13px"
                          }}
                        />
                        <button
                          disabled={saving[app.id]}
                          onClick={() => handleSetSLA(app.id)}
                          style={{
                            padding: "5px 10px", borderRadius: "6px",
                            background: "#3b82f6", color: "#fff",
                            border: "none", cursor: "pointer", fontSize: "12px"
                          }}
                        >
                          {saving[app.id] ? "..." : "Set"}
                        </button>
                        <button
                          onClick={() => setSettingId(null)}
                          style={{
                            padding: "5px 8px", borderRadius: "6px",
                            background: "#f1f5f9", color: "#64748b",
                            border: "none", cursor: "pointer", fontSize: "12px"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSettingId(app.id)}
                        style={{
                          padding: "5px 12px", borderRadius: "6px",
                          background: "#f1f5f9", color: "#475569",
                          border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "12px",
                          fontWeight: 500
                        }}
                      >
                        {app.slaDays ? "Edit SLA" : "Set SLA"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "12px" }}>
        Auto-refreshes every 60 seconds · At Risk = less than 2 days remaining · Default SLA = 5 business days
      </p>
    </div>
  );
}