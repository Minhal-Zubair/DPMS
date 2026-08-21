import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DocumentUpload.css";

function DocumentUpload() {
  const location = useLocation();
  const navigate = useNavigate();

  // applicationId passed via navigation state from NewApplication
  // Falls back to localStorage as a safety net
  const applicationId = location.state?.applicationId || localStorage.getItem("lastApplicationId");
  const userId = localStorage.getItem("userId");

  const [documents, setDocuments] = useState({
    cnicFront: null,
    cnicBack: null,
    applicantPhoto: null,
    salarySlip: null,
    bankStatement: null,
    additionalDocument: null,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  const maxSize = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;
    const file = files[0];
    let error = "";
    if (!allowedTypes.includes(file.type)) {
      error = "Only PDF, JPG, JPEG and PNG files are allowed.";
    } else if (file.size > maxSize) {
      error = "Maximum file size is 5 MB.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    if (!error) {
      setDocuments((prev) => ({ ...prev, [name]: file }));
    }
  };

  const removeFile = (field) => {
    setDocuments((prev) => ({ ...prev, [field]: null }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const uploadDocuments = async () => {
    if (!applicationId) {
      alert("No application selected. Please create an application first.");
      navigate("/new-application");
      return;
    }

    if (!documents.cnicFront || !documents.cnicBack || !documents.applicantPhoto) {
      alert("Please upload CNIC Front, CNIC Back and Applicant Photo (required).");
      return;
    }

    const documentList = [
      { file: documents.cnicFront,         typeId: 1 },
      { file: documents.cnicBack,          typeId: 2 },
      { file: documents.applicantPhoto,    typeId: 3 },
      { file: documents.salarySlip,        typeId: 4 },
      { file: documents.bankStatement,     typeId: 5 },
      { file: documents.additionalDocument,typeId: 6 },
    ];

    setUploading(true);
    try {
      for (const doc of documentList) {
        if (!doc.file) continue;
        const formData = new FormData();
        formData.append("applicationId", applicationId);
        formData.append("userId", userId);
        formData.append("documentTypeId", doc.typeId);
        formData.append("file", doc.file);
        await axios.post("http://localhost:8080/api/documents/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("Documents uploaded successfully!");
      navigate("/applications");
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const renderUploadCard = (label, name, required = false) => (
    <div className="upload-card" key={name}>
      <h3>
        {label}
        {required && <span className="required"> *</span>}
      </h3>
      <input type="file" id={name} name={name} hidden onChange={handleFileChange} />
      {!documents[name] ? (
        <label htmlFor={name} className="upload-box">
          <div className="upload-icon">⬆</div>
          <p>Click to Upload</p>
          <span>PDF / JPG / PNG · max 5MB</span>
        </label>
      ) : (
        <div className="file-preview">
          <p>{documents[name].name}</p>
          <small>{(documents[name].size / 1024).toFixed(1)} KB</small>
          <button type="button" onClick={() => removeFile(name)}>Remove</button>
        </div>
      )}
      {errors[name] && <div className="upload-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="document-page">
      <div className="page-title">
        <h1>Document Upload</h1>
        <p>
          Upload required documents for your application.
          {applicationId
            ? <strong> Application ID: {applicationId}</strong>
            : <span style={{ color: "#ef4444" }}> No application selected.</span>
          }
        </p>
      </div>

      <div className="upload-grid">
        {renderUploadCard("CNIC Front", "cnicFront", true)}
        {renderUploadCard("CNIC Back", "cnicBack", true)}
        {renderUploadCard("Applicant Photograph", "applicantPhoto", true)}
        {renderUploadCard("Salary Slip", "salarySlip")}
        {renderUploadCard("Bank Statement", "bankStatement")}
        {renderUploadCard("Additional Document", "additionalDocument")}
      </div>

      <div className="bottom-buttons">
        <button className="previous-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="next-btn" onClick={uploadDocuments} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload & Continue"}
        </button>
      </div>
    </div>
  );
}

export default DocumentUpload;