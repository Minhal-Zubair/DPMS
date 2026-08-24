import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, Save } from "lucide-react";
import "./NewApplication.css";
import API from "../../api/axiosConfig";

function NewApplication() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cnic: "",
    productionDate: "",
    productId: "",
    remarks: "",
  });

  const [errors, setErrors]     = useState({});
  const [products, setProducts] = useState([]);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [saving, setSaving]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Load products from DB
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  // Load required documents whenever product changes
  useEffect(() => {
    if (!formData.productId) { setRequiredDocs([]); return; }
    API.get(`/products/${formData.productId}/documents`)
      .then((res) => setRequiredDocs(res.data))
      .catch(() => setRequiredDocs([]));
  }, [formData.productId]);

  const formatCNIC = (value) => {
    const n = value.replace(/\D/g, "").substring(0, 13);
    if (n.length <= 5) return n;
    if (n.length <= 12) return `${n.slice(0, 5)}-${n.slice(5)}`;
    return `${n.slice(0, 5)}-${n.slice(5, 12)}-${n.slice(12)}`;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "cnic") value = formatCNIC(value);
    if (name === "productId") value = Number(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setDraftSaved(false);
  };

  const validate = (requireProduct = true) => {
    const errs = {};
    if (!formData.cnic) errs.cnic = "CNIC is required.";
    else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) errs.cnic = "Invalid CNIC format.";
    if (!formData.productionDate) errs.productionDate = "Date is required.";
    if (requireProduct && !formData.productId) errs.productId = "Select a product.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildPayload = () => ({
    cnic: formData.cnic.replaceAll("-", ""),
    productionDate: formData.productionDate || null,
    productId: formData.productId || null,
    remarks: formData.remarks,
  });

  const handleDraft = async () => {
    if (!validate(false)) return;
    setSaving(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await API.post(`/applications/draft?userId=${userId}`, buildPayload());
      localStorage.setItem("lastApplicationId", res.data.id);
      setDraftSaved(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate(true)) return;
    setSubmitting(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await API.post(`/applications?userId=${userId}`, buildPayload());
      const newId = res.data.id;
      localStorage.setItem("lastApplicationId", newId);
      navigate("/application/upload", { state: { applicationId: newId, requiredDocs } });
    } catch (err) {
      console.error(err);
      alert("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === Number(formData.productId));

  return (
    <div className="application-page">
      <div className="page-header">
        <div>
          <h1>New Application</h1>
          <p>Fill in the details and upload the required documents.</p>
        </div>
        {selectedProduct && (
          <div className="application-number">{selectedProduct.productName}</div>
        )}
      </div>

      {/* Application Info */}
      <div className="card">
        <h2>Application Information</h2>
        <div className="grid">

          <div>
            <label>CNIC *</label>
            <input
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
              placeholder="35202-1234567-1"
            />
            <span className="error">{errors.cnic}</span>
          </div>

          <div>
            <label>Production Date *</label>
            <input
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleChange}
            />
            <span className="error">{errors.productionDate}</span>
          </div>

          <div>
            <label>Product *</label>
            <select name="productId" value={formData.productId} onChange={handleChange}>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.productName}</option>
              ))}
            </select>
            <span className="error">{errors.productId}</span>
          </div>

          <div className="full-width">
            <label>Remarks</label>
            <textarea rows="3" name="remarks" value={formData.remarks} onChange={handleChange} />
          </div>

        </div>
      </div>

      {/* Dynamic Document Checklist */}
      {requiredDocs.length > 0 && (
        <div className="card">
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} /> Required Documents for {selectedProduct?.productName}
          </h2>
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "14px" }}>
            You will be asked to upload these after submitting the application.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {requiredDocs.map((doc, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", borderRadius: "8px",
                background: doc.isRequired ? "#f0fdf4" : "#f8fafc",
                border: `1px solid ${doc.isRequired ? "#bbf7d0" : "#e2e8f0"}`
              }}>
                {doc.isRequired
                  ? <CheckCircle size={16} color="#16a34a" />
                  : <Clock size={16} color="#94a3b8" />
                }
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                    {doc.documentName}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {doc.isRequired ? "Required" : "Optional"} · {doc.allowedFormats} · max {doc.maxSizeMb}MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="button-group">
        <button
          className="draft-btn"
          onClick={handleDraft}
          disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Save size={16} />
          {saving ? "Saving..." : draftSaved ? "Draft Saved ✓" : "Save Draft"}
        </button>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Application →"}
        </button>
      </div>
    </div>
  );
}

export default NewApplication;