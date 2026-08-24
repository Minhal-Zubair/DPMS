import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserApplications } from "../../services/applicationService";
import "./MyApplications.css";

function MyApplications() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await getUserApplications(userId);

        setApplications(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      loadApplications();
    }
  }, [userId]);

  useEffect(() => {
    import("../../api/axiosConfig").then(({ default: API }) => {
      API.get("/products").then((res) => {
        const map = {};
        res.data.forEach((p) => { map[p.id] = p.productName; });
        setProducts(map);
      }).catch(() => {});
    });
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return { background: "#dcfce7", color: "#16a34a" };
      case "Rejected": return { background: "#fee2e2", color: "#dc2626" };
      case "Under_Review": return { background: "#dbeafe", color: "#2563eb" };
      case "Draft": return { background: "#f1f5f9", color: "#64748b" };
      default: return { background: "#fef3c7", color: "#d97706" };
    }
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h1>My Applications</h1>

          <p>View and manage your submitted applications.</p>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Application #</th>
              <th>Applicant</th>
              <th>CNIC</th>
              <th>Product</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="7">No Applications Found</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.applicationNumber}</td>

                  <td>{localStorage.getItem("firstName")}</td>

                  <td>{app.cnic}</td>

                  <td>{products[app.productId] || app.productId || "—"}</td>

                  <td>
                    <span
                      className={`status ${app.status.replace("_", "").toLowerCase()}`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </td>

                  <td>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setSelectedApplication(app)}>
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate("/applications/details", {
                          state: { application: app },
                        })
                      }
                    >
                      Details
                    </button>
                    <button
                      onClick={() =>
                        navigate("/applications/tracking", {
                          state: {
                            applicationId: app.id,
                            applicationNumber: app.applicationNumber,
                            applicationStatus: app.status,
                          },
                        })
                      }
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* APPLICATION DETAILS POPUP */}

      {selectedApplication && (
        <div className="modal-overlay">
          <div className="application-modal">
            <h2>Application Details</h2>

            <div className="details">
              <p>
                <strong>Application No:</strong>{" "}
                {selectedApplication.applicationNumber}
              </p>

              <p>
                <strong>Applicant:</strong> {localStorage.getItem("firstName")}
              </p>

              <p>
                <strong>CNIC:</strong> {selectedApplication.cnic}
              </p>

              <p>
                <strong>Product:</strong>{" "}
                {products[selectedApplication.productId] || selectedApplication.productId || "—"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedApplication.status.replace("_", " ")}
              </p>

              <p>
                <strong>Submitted Date:</strong>{" "}
                {selectedApplication.createdAt
                  ? new Date(selectedApplication.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedApplication(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApplications;