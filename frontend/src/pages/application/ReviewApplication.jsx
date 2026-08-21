import "./ReviewApplication.css";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const applications = [
  {
    id: "DPMS-2026-001",
    applicant: "Ali Hassan",
    product: "AGAC",
    submitted: "20 Jul 2026",
    status: "Approved",
  },
  {
    id: "DPMS-2026-002",
    applicant: "Ahmed Raza",
    product: "Electric Bike",
    submitted: "20 Jul 2026",
    status: "Pending",
  },
  {
    id: "DPMS-2026-003",
    applicant: "Fatima Noor",
    product: "Personal Loan",
    submitted: "19 Jul 2026",
    status: "Rejected",
  },
  {
    id: "DPMS-2026-004",
    applicant: "Usman Tariq",
    product: "AGAC",
    submitted: "18 Jul 2026",
    status: "Pending",
  },
  {
    id: "DPMS-2026-005",
    applicant: "Ayesha Khan",
    product: "Education Loan",
    submitted: "17 Jul 2026",
    status: "Approved",
  },
];

function ReviewApplication() {
  const getBadge = (status) => {
    switch (status) {
      case "Approved":
        return "badge approved";
      case "Rejected":
        return "badge rejected";
      default:
        return "badge pending";
    }
  };

  return (
    <div className="review-page">

      <div className="review-header">
        <div>
          <h1>Application Review</h1>
          <p>Review, approve or reject submitted applications.</p>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Application..."
          />
        </div>
      </div>

      <div className="review-card">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Applicant</th>
              <th>Product</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {applications.map((app) => (

              <tr key={app.id}>

                <td>{app.id}</td>

                <td>{app.applicant}</td>

                <td>{app.product}</td>

                <td>{app.submitted}</td>

                <td>
                  <span className={getBadge(app.status)}>
                    {app.status}
                  </span>
                </td>

                <td>

                  <button className="action-btn view">
                    <Eye size={18} />
                  </button>

                  <button className="action-btn approve">
                    <CheckCircle size={18} />
                  </button>

                  <button className="action-btn reject">
                    <XCircle size={18} />
                  </button>

                  <button className="action-btn pending">
                    <Clock size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReviewApplication;