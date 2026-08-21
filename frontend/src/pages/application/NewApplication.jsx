import { useState } from "react";
import "./NewApplication.css";
import API from "../../api/axiosConfig";

function NewApplication() {
  const [formData, setFormData] = useState({
    cnic: "",
    productionDate: "",
    productId: "",
    remarks: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const products = [
    {
      id: 1,
      name: "AGAC",
    },
    {
      id: 2,
      name: "DIG PERSONAL LOAN",
    },
    {
      id: 3,
      name: "ELECTRIC BIKE",
    },
  ];

  const formatCNIC = (value) => {
    const numbers = value.replace(/\D/g, "").substring(0, 13);

    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12)
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;

    return `${numbers.slice(0, 5)}-${numbers.slice(
      5,
      12,
    )}-${numbers.slice(12)}`;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cnic") {
      value = formatCNIC(value);
    }

    if (name === "productId") {
      setFormData((prev) => ({
        ...prev,

        product: value,

        productId: Number(value),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.cnic) newErrors.cnic = "CNIC is required.";
    else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic))
      newErrors.cnic = "Invalid CNIC.";

    if (!formData.productionDate)
      newErrors.productionDate = "Production Date is required.";

    if (!formData.productId) newErrors.productId = "Select Product.";

    if (!formData.firstName) newErrors.firstName = "Required";

    if (!formData.lastName) newErrors.lastName = "Required";

    if (!formData.phone) newErrors.phone = "Required";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid Email";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleDraft = () => {
    if (!validate()) return;

    console.log("Draft Saved");

    console.log(formData);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const userId = localStorage.getItem("userId");

      const applicationData = {
        cnic: formData.cnic.replaceAll("-", ""),
        productionDate: formData.productionDate,
        productId: formData.productId,
        remarks: formData.remarks,
      };

      const response = await API.post(
        `/applications?userId=${userId}`,
        applicationData,
      );

      console.log("Saved:", response.data);

      alert("Application Submitted Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to submit application");
    }
  };

  return (
    <div className="application-page">
      <div className="page-header">
        <div>
          <h1>New Application</h1>

          <p>Create a new document processing application.</p>
        </div>

        <div className="application-number">DPMS-2026-000001</div>
      </div>

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

            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
            >
              <option value="">Select Product</option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <span className="error">{errors.productId}</span>
          </div>

          <div className="full-width">
            <label>Remarks</label>

            <textarea
              rows="4"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Applicant Information</h2>

        <div className="grid">
          <div>
            <label>First Name</label>

            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <span className="error">{errors.firstName}</span>
          </div>

          <div>
            <label>Last Name</label>

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <span className="error">{errors.lastName}</span>
          </div>

          <div>
            <label>Phone</label>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <span className="error">{errors.phone}</span>
          </div>

          <div>
            <label>Email</label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <span className="error">{errors.email}</span>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="draft-btn" onClick={handleDraft}>
          Save Draft
        </button>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Application
        </button>
      </div>
    </div>
  );
}

export default NewApplication;