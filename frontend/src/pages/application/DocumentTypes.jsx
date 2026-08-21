import { useEffect, useState } from "react";
import axios from "axios";
import "./DocumentTypes.css";

function DocumentTypes() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);

  // Load products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);
        if (res.data.length > 0) {
          setSelectedProduct(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load document requirements whenever selected product changes
  useEffect(() => {
    if (!selectedProduct) return;
    const fetchDocs = async () => {
      setDocsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/products/${selectedProduct.id}/documents`
        );
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to load document requirements", err);
        setDocuments([]);
      } finally {
        setDocsLoading(false);
      }
    };
    fetchDocs();
  }, [selectedProduct]);

  const handleProductChange = (e) => {
    const product = products.find((p) => p.id === parseInt(e.target.value));
    setSelectedProduct(product);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="document-types-page">
      <div className="page-header">
        <div>
          <h1>Document Types</h1>
          <p>View required documents for each product.</p>
        </div>
      </div>

      <div className="document-card">
        <div className="top-section">
          <label>Select Product</label>
          <select
            value={selectedProduct?.id || ""}
            onChange={handleProductChange}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>

        {docsLoading ? (
          <p style={{ padding: "20px", color: "#64748b" }}>Loading requirements...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Required</th>
                <th>Allowed Format</th>
                <th>Maximum Size</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#94a3b8" }}>
                    No document requirements found for this product.
                  </td>
                </tr>
              ) : (
                documents.map((doc, index) => (
                  <tr key={index}>
                    <td>{doc.documentName}</td>
                    <td>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: doc.isRequired ? "#dcfce7" : "#f1f5f9",
                        color: doc.isRequired ? "#16a34a" : "#64748b",
                      }}>
                        {doc.isRequired ? "Required" : "Optional"}
                      </span>
                    </td>
                    <td>{doc.allowedFormats?.replace(/,/g, ", ")}</td>
                    <td>{doc.maxSizeMb} MB</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="info-card">
        <h3>Important Instructions</h3>
        <ul>
          <li>Upload only clear scanned documents.</li>
          <li>Do not upload password protected PDF files.</li>
          <li>Only supported file formats are accepted.</li>
          <li>Ensure file size is within the allowed limit.</li>
          <li>All mandatory documents must be uploaded before submission.</li>
        </ul>
      </div>
    </div>
  );
}

export default DocumentTypes;