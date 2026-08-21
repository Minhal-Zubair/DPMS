import "./ApplicationDetails.css";

function ApplicationDetails() {

  const application = {

    applicationNumber: "DPMS-2026-000001",

    status: "Pending",

    createdDate: "20-Jul-2026",

    product: "AGAC",

    productionDate: "20-Jul-2026",

    cnic: "35202-1234567-1",

    firstName: "Minhal",

    lastName: "Zubair",

    phone: "03001234567",

    email: "minhal@gmail.com",

    remarks: "Priority Processing",

    documents: [

      {
        id:1,
        name:"CNIC Front.pdf",
        type:"PDF"
      },

      {
        id:2,
        name:"CNIC Back.pdf",
        type:"PDF"
      },

      {
        id:3,
        name:"Salary Slip.pdf",
        type:"PDF"
      }

    ]

  };

  return (

    <div className="application-details-page">

      {/* Header */}

      <div className="details-header">

        <div>

          <h1>Application Details</h1>

          <p>
            Review complete application information.
          </p>

        </div>

        <span className="status pending">

          {application.status}

        </span>

      </div>

      {/* Application */}

      <div className="details-card">

        <h2>Application Information</h2>

        <div className="details-grid">

          <div>

            <label>Application Number</label>

            <p>{application.applicationNumber}</p>

          </div>

          <div>

            <label>Product</label>

            <p>{application.product}</p>

          </div>

          <div>

            <label>Production Date</label>

            <p>{application.productionDate}</p>

          </div>

          <div>

            <label>Created Date</label>

            <p>{application.createdDate}</p>

          </div>

        </div>

      </div>

      {/* Applicant */}

      <div className="details-card">

        <h2>Applicant Information</h2>

        <div className="details-grid">

          <div>

            <label>First Name</label>

            <p>{application.firstName}</p>

          </div>

          <div>

            <label>Last Name</label>

            <p>{application.lastName}</p>

          </div>

          <div>

            <label>CNIC</label>

            <p>{application.cnic}</p>

          </div>

          <div>

            <label>Phone</label>

            <p>{application.phone}</p>

          </div>

          <div>

            <label>Email</label>

            <p>{application.email}</p>

          </div>

        </div>

      </div>

      {/* Remarks */}

      <div className="details-card">

        <h2>Remarks</h2>

        <p className="remarks">

          {application.remarks}

        </p>

      </div>

      {/* Documents */}

      <div className="details-card">

        <h2>Uploaded Documents</h2>

        <table className="document-table">

          <thead>

            <tr>

              <th>Document</th>

              <th>Type</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {application.documents.map((doc)=>(

              <tr key={doc.id}>

                <td>{doc.name}</td>

                <td>{doc.type}</td>

                <td>

                  <button>

                    View

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Buttons */}

      <div className="action-buttons">

        <button className="back-btn">

          Back

        </button>

        <button className="download-btn">

          Download PDF

        </button>

        <button className="track-btn">

          Track Status

        </button>

      </div>

    </div>

  );

}

export default ApplicationDetails;