import { useState } from "react";
import axios from "axios";
import "./DocumentUpload.css";

function DocumentUpload() {
  const [documents, setDocuments] = useState({
    cnicFront: null,
    cnicBack: null,
    applicantPhoto: null,
    salarySlip: null,
    bankStatement: null,
    additionalDocument: null,
  });

  const [errors, setErrors] = useState({});

  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  const maxSize = 5 * 1024 * 1024; // 5MB

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

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if (!error) {
      setDocuments((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const removeFile = (field) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: null,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const uploadDocuments = async () => {
    if (
      !documents.cnicFront ||
      !documents.cnicBack ||
      !documents.applicantPhoto
    ) {
      alert("Please upload CNIC Front, CNIC Back and Applicant Photo");

      return;
    }
    try {
      const applicationId = 1;
      const userId = 6;
      

      const documentList = [
        {
          file: documents.cnicFront,
          typeId: 1,
        },
        {
          file: documents.cnicBack,
          typeId: 2,
        },
        {
          file: documents.applicantPhoto,
          typeId: 3,
        },
        {
          file: documents.salarySlip,
          typeId: 4,
        },
        {
          file: documents.bankStatement,
          typeId: 5,
        },
        {
          file: documents.additionalDocument,
          typeId: 6,
        },
      ];

      for (const doc of documentList) {
        console.log("Uploading:", doc);
        if (doc.file) {
          const formData = new FormData();

          formData.append("applicationId", applicationId);

          formData.append("userId", userId);

          formData.append("documentTypeId", doc.typeId);

          formData.append("file", doc.file);

          const response = await axios.post(
            "http://localhost:8080/api/documents/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            }
          );

          console.log("Uploaded document type:",
            doc.typeId,
            response.data);
        }
      }

      alert("Documents uploaded successfully");
    } catch (error) {
      console.log(error);

    if (error.response) {

        console.log("Status:", error.response.status);

        console.log("Response:", error.response.data);

    }

      alert("Upload failed");
    }
  };

  const renderUploadCard = (label, name, required = false) => (
    <div className="upload-card">
      <h3>
        {label}
        {required && <span className="required">*</span>}
      </h3>

      <input
        type="file"
        id={name}
        name={name}
        hidden
        onChange={handleFileChange}
      />

      {!documents[name] ? (
        <label htmlFor={name} className="upload-box">
          <div className="upload-icon">⬆</div>

          <p>Click to Upload</p>

          <span>PDF / JPG / PNG</span>
        </label>
      ) : (
        <div className="file-preview">
          <p>{documents[name].name}</p>

          <small>{(documents[name].size / 1024).toFixed(1)} KB</small>

          <button type="button" onClick={() => removeFile(name)}>
            Remove
          </button>
        </div>
      )}

      {errors[name] && <div className="upload-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="document-page">
      <div className="page-title">
        <h1>Document Upload</h1>

        <p>Upload all required documents before submitting your application.</p>
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
        <button className="previous-btn">Previous</button>

        <button className="next-btn" onClick={uploadDocuments}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default DocumentUpload;
