import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import "./ApplicationDetails.css";

const PRODUCT_NAMES = {
  1: "AGAC",
  2: "DIG PERSONAL LOAN",
  3: "ELECTRIC BIKE",
};

const DOC_TYPE_NAMES = {
  1: "CNIC Front",
  2: "CNIC Back",
  3: "Applicant Photo",
  4: "Salary Slip",
  5: "Bank Statement",
  6: "Additional Document",
};

function ApplicationDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const app = location.state?.application;

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  useEffect(() => {
    if (app?.id) {
      fetchDocuments(app.id);
    }
  }, [app]);

  const fetchDocuments = async (applicationId) => {
    setDocsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/documents/application/${applicationId}`
      );
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setDocsLoading(false);
    }
  };

  if (!app) {
    return (
      <div className="application-details-page">
        <div className="details-header">
          <div>
            <h1>Application Details</h1>
            <p>No application selected.</p>
          </div>
        </div>
        <div className="action-buttons">
          <button className="back-btn" onClick={() => navigate("/applications")}>
            Back to My Applications
          </button>
        </div>
      </div>
    );
  }

  const statusClass =
    app.status === "Approved"
      ? "approved"
      : app.status === "Rejected"
      ? "rejected"
      : "pending";

  return (
    <div className="application-details-page">

      {/* Header */}
      <div className="details-header">
        <div>
          <h1>Application Details</h1>
          <p>Review complete application information.</p>
        </div>
        <span className={`status ${statusClass}`}>
          {app.status?.replace("_", " ")}
        </span>
      </div>

      {/* Application Info */}
      <div className="details-card">
        <h2>Application Information</h2>
        <div className="details-grid">
          <div>
            <label>Application Number</label>
            <p>{app.applicationNumber}</p>
          </div>
          <div>
            <label>Product</label>
            <p>{PRODUCT_NAMES[app.productId] || `Product #${app.productId}`}</p>
          </div>
          <div>
            <label>Production Date</label>
            <p>{app.productionDate || "-"}</p>
          </div>
          <div>
            <label>Submitted Date</label>
            <p>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      </div>

      {/* Applicant Info */}
      <div className="details-card">
        <h2>Applicant Information</h2>
        <div className="details-grid">
          <div>
            <label>First Name</label>
            <p>{localStorage.getItem("firstName") || "-"}</p>
          </div>
          <div>
            <label>Last Name</label>
            <p>{localStorage.getItem("lastName") || "-"}</p>
          </div>
          <div>
            <label>CNIC</label>
            <p>{app.cnic || "-"}</p>
          </div>
        </div>
      </div>

      {/* Remarks */}
      {app.remarks && (
        <div className="details-card">
          <h2>Remarks</h2>
          <p className="remarks">{app.remarks}</p>
        </div>
      )}

      {/* Documents */}
      <div className="details-card">
        <h2>Uploaded Documents</h2>
        {docsLoading && <p style={{ color: "#64748b" }}>Loading documents...</p>}
        {!docsLoading && documents.length === 0 && (
          <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No documents uploaded yet.</p>
        )}
        {!docsLoading && documents.length > 0 && (
          <table className="document-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>File Name</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{DOC_TYPE_NAMES[doc.documentTypeId] || `Document #${doc.documentTypeId}`}</td>
                  <td>{doc.originalName}</td>
                  <td>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: doc.verified === true ? "#dcfce7" : doc.verified === false ? "#fee2e2" : "#f1f5f9",
                      color: doc.verified === true ? "#16a34a" : doc.verified === false ? "#dc2626" : "#64748b",
                    }}>
                      {doc.verified === true ? <span style={{display:"inline-flex",alignItems:"center",gap:"4px"}}><CheckCircle size={12}/>Verified</span> : doc.verified === false ? <span style={{display:"inline-flex",alignItems:"center",gap:"4px"}}><XCircle size={12}/>Rejected</span> : <span style={{display:"inline-flex",alignItems:"center",gap:"4px"}}><Clock size={12}/>Pending</span>}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: "13px" }}>{doc.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Buttons */}
      <div className="action-buttons">
        <button className="back-btn" onClick={() => navigate("/applications")}>
          Back
        </button>
        <button
          className="track-btn"
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
          Track Status
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetails;