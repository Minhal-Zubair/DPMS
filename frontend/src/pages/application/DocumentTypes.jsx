import { useState } from "react";
import "./DocumentTypes.css";

function DocumentTypes() {
  const products = ["AGAC", "DIG PERSONAL LOAN", "ELECTRIC BIKE"];

  const documentData = {
    AGAC: [
      {
        name: "CNIC Front",
        required: "Yes",
        format: "PDF, JPG, PNG",
        size: "5 MB",
      },
      {
        name: "CNIC Back",
        required: "Yes",
        format: "PDF, JPG, PNG",
        size: "5 MB",
      },
      {
        name: "Photograph",
        required: "Yes",
        format: "JPG, PNG",
        size: "2 MB",
      },
      {
        name: "Salary Slip",
        required: "Yes",
        format: "PDF",
        size: "10 MB",
      },
    ],

    "DIG PERSONAL LOAN": [
      {
        name: "CNIC Front",
        required: "Yes",
        format: "PDF, JPG",
        size: "5 MB",
      },
      {
        name: "Bank Statement",
        required: "Yes",
        format: "PDF",
        size: "10 MB",
      },
      {
        name: "Salary Certificate",
        required: "Yes",
        format: "PDF",
        size: "10 MB",
      },
    ],

    "ELECTRIC BIKE": [
      {
        name: "CNIC Front",
        required: "Yes",
        format: "PDF, JPG",
        size: "5 MB",
      },
      {
        name: "CNIC Back",
        required: "Yes",
        format: "PDF, JPG",
        size: "5 MB",
      },
      {
        name: "Driving License",
        required: "No",
        format: "PDF, JPG",
        size: "5 MB",
      },
    ],
  };

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

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
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

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
            {documentData[selectedProduct].map((doc, index) => (
              <tr key={index}>
                <td>{doc.name}</td>

                <td>{doc.required}</td>

                <td>{doc.format}</td>

                <td>{doc.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
