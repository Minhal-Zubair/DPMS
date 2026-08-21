import { Search, History, ShieldCheck } from "lucide-react";
import "./AuditLogs.css";
import { useEffect, useState } from "react";
import { getAllLogs } from "../../services/applicationLogService";

function AuditLogs() {

  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await getAllLogs();
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const text = `${log.action ?? ""} ${log.actionBy ?? ""} ${log.applicationId ?? ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="audit-page">

      <div className="audit-header">

        <div>
          <h1>Audit Logs</h1>
          <p>Track every activity performed in the system.</p>
        </div>

      </div>

      <div className="audit-search">

        <Search size={18} />


        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>
      <div className="audit-table">

        {loading && <p>Loading audit logs...</p>}

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Date</th>
              <th>Time</th>
            </tr>

          </thead>

          <tbody>

            {filteredLogs.map((log, index) => (

              <tr key={index}>

                <td>{index + 1}</td>

                <td>

                  <div className="user-cell">

                    <ShieldCheck size={16} />

                    {log.user ?? `User #${log.actionBy}`}

                  </div>

                </td>

                <td>{log.action}</td>

                <td>

                  {log.target ??
                    (log.applicationId
                      ? `Application #${log.applicationId}`
                      : "-")}

                </td>

                <td>

                  {log.date ??
                    new Date(log.actionTime).toLocaleDateString()}

                </td>

                <td>

                  {log.time ??
                    new Date(log.actionTime).toLocaleTimeString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="audit-summary">

        <History size={42} />

        <div>

          <h2>Activity Summary</h2>

          <p>
            All system activities are securely recorded for
            transparency and security auditing.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AuditLogs;