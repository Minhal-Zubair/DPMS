import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UploadCloud, CheckCircle, XCircle, FileText } from "lucide-react";
import "./DocumentUpload.css";

// Fallback document slots if no product-specific requirements passed
const DEFAULT_DOCS = [
  { documentTypeId: 1, documentName: "CNIC Front",         isRequired: true,  allowedFormats: "JPG,PNG,PDF", maxSizeMb: 5 },
  { documentTypeId: 2, documentName: "CNIC Back",          isRequired: true,  allowedFormats: "JPG,PNG,PDF", maxSizeMb: 5 },
  { documentTypeId: 3, documentName: "Applicant Photograph",isRequired: true, allowedFormats: "JPG,PNG",     maxSizeMb: 5 },
  { documentTypeId: 4, documentName: "Salary Slip",        isRequired: false, allowedFormats: "JPG,PNG,PDF", maxSizeMb: 5 },
  { documentTypeId: 5, documentName: "Bank Statement",     isRequired: false, allowedFormats: "JPG,PNG,PDF", maxSizeMb: 5 },
  { documentTypeId: 6, documentName: "Additional Document",isRequired: false, allowedFormats: "JPG,PNG,PDF", maxSizeMb: 5 },
];

function DocumentUpload() {
  const location  = useLocation();
  const navigate  = useNavigate();

  const applicationId = location.state?.applicationId || localStorage.getItem("lastApplicationId");
  const userId        = localStorage.getItem("userId");

  // Use product-specific docs from navigation state, or fetch, or fall back to defaults
  const [docSlots, setDocSlots] = useState(location.state?.requiredDocs || []);

  useEffect(() => {
    if (docSlots.length > 0) return; // already have them

    // Try to fetch from API using lastApplicationId's product
    // Fall back to defaults
    setDocSlots(DEFAULT_DOCS);
  }, []);

  const [files,     setFiles]     = useState({});
  const [errors,    setErrors]    = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedIds, setUploadedIds] = useState(new Set());

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  const maxSize      = 5 * 1024 * 1024;

  const handleFileChange = (e, typeId) => {
    const file = e.target.files[0];
    if (!file) return;

    let error = "";
    if (!allowedTypes.includes(file.type)) {
      error = "Only PDF, JPG, JPEG and PNG files are allowed.";
    } else if (file.size > maxSize) {
      error = "Maximum file size is 5MB.";
    }

    setErrors((prev) => ({ ...prev, [typeId]: error }));
    if (!error) {
      setFiles((prev) => ({ ...prev, [typeId]: file }));
    }
  };

  const removeFile = (typeId) => {
    setFiles((prev) => { const n = { ...prev }; delete n[typeId]; return n; });
    setErrors((prev) => { const n = { ...prev }; delete n[typeId]; return n; });
  };

  const handleUpload = async () => {
    if (!applicationId) {
      alert("No application selected. Please create one first.");
      navigate("/new-application");
      return;
    }

    // Check required docs
    const missing = docSlots
      .filter((d) => d.isRequired && !files[d.documentTypeId])
      .map((d) => d.documentName);

    if (missing.length > 0) {
      alert(`Please upload required documents:\n• ${missing.join("\n• ")}`);
      return;
    }

    setUploading(true);
    const uploaded = new Set();
    let failed = [];

    for (const slot of docSlots) {
      const file = files[slot.documentTypeId];
      if (!file) continue;

      try {
        const formData = new FormData();
        formData.append("applicationId", applicationId);
        formData.append("userId", userId);
        formData.append("documentTypeId", slot.documentTypeId);
        formData.append("file", file);

        await axios.post("http://localhost:8080/api/documents/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploaded.add(slot.documentTypeId);
        setUploadedIds(new Set(uploaded));
      } catch (err) {
        const msg = err.response?.data || "Upload failed";
        failed.push(`${slot.documentName}: ${msg}`);
      }
    }

    setUploading(false);

    if (failed.length > 0) {
      alert(`Some uploads failed:\n• ${failed.join("\n• ")}`);
    } else {
      alert("All documents uploaded successfully!");
      navigate("/applications");
    }
  };

  return (
    <div className="document-page">
      <div className="page-title">
        <h1>Upload Documents</h1>
        <p>
          Upload required documents for your application.
          {applicationId
            ? <> Application ID: <strong>{applicationId}</strong></>
            : <span style={{ color: "#ef4444" }}> No application selected.</span>
          }
        </p>
      </div>

      <div className="upload-grid">
        {docSlots.map((slot) => {
          const typeId  = slot.documentTypeId;
          const file    = files[typeId];
          const error   = errors[typeId];
          const done    = uploadedIds.has(typeId);

          return (
            <div
              className="upload-card"
              key={typeId}
              style={done ? { borderColor: "#16a34a", background: "#f0fdf4" } : {}}
            >
              <h3>
                {slot.documentName}
                {slot.isRequired && <span className="required"> *</span>}
                {done && <CheckCircle size={14} color="#16a34a" style={{ marginLeft: "6px" }} />}
              </h3>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 8px" }}>
                {slot.allowedFormats} · max {slot.maxSizeMb}MB
              </p>

              <input
                type="file"
                id={`file-${typeId}`}
                hidden
                onChange={(e) => handleFileChange(e, typeId)}
                accept=".pdf,.jpg,.jpeg,.png"
              />

              {!file ? (
                <label htmlFor={`file-${typeId}`} className="upload-box">
                  <UploadCloud size={28} style={{ color: "#94a3b8", marginBottom: "6px" }} />
                  <p>Click to Upload</p>
                  <span>{slot.allowedFormats} · max {slot.maxSizeMb}MB</span>
                </label>
              ) : (
                <div className="file-preview">
                  <FileText size={16} color="#3b82f6" />
                  <div style={{ flex: 1 }}>
                    <p>{file.name}</p>
                    <small>{(file.size / 1024).toFixed(1)} KB</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(typeId)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <XCircle size={16} color="#ef4444" />
                  </button>
                </div>
              )}

              {error && <div className="upload-error">{error}</div>}
            </div>
          );
        })}
      </div>

      <div className="bottom-buttons">
        <button className="previous-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          className="next-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload & Continue"}
        </button>
      </div>
    </div>
  );
}

export default DocumentUpload;