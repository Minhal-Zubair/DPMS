import "./ApplicationTracking.css";

function ApplicationTracking() {

  const tracking = [
    {
      id: 1,
      title: "Application Submitted",
      status: "completed",
      officer: "System",
      remarks: "Application has been submitted successfully.",
      date: "20 Jul 2026",
      time: "09:15 AM"
    },
    {
      id: 2,
      title: "Documents Verified",
      status: "completed",
      officer: "Documentation Officer",
      remarks: "All required documents verified.",
      date: "20 Jul 2026",
      time: "10:45 AM"
    },
    {
      id: 3,
      title: "Under Review",
      status: "active",
      officer: "Credit Officer",
      remarks: "Application is under detailed review.",
      date: "21 Jul 2026",
      time: "11:20 AM"
    },
    {
      id: 4,
      title: "Manager Approval",
      status: "pending",
      officer: "-",
      remarks: "Waiting for manager approval.",
      date: "--",
      time: "--"
    },
    {
      id: 5,
      title: "Completed",
      status: "pending",
      officer: "-",
      remarks: "Application process completed.",
      date: "--",
      time: "--"
    }
  ];

  return (

    <div className="tracking-page">

      <div className="tracking-header">

        <div>

          <h1>Application Tracking</h1>

          <p>
            Track your application's processing status.
          </p>

        </div>

        <div className="tracking-number">

          DPMS-2026-000001

        </div>

      </div>

      <div className="progress-card">

        <div className="progress-info">

          <h3>Overall Progress</h3>

          <span>60%</span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{ width: "60%" }}
          ></div>

        </div>

      </div>

      <div className="timeline">

        {tracking.map((item) => (

          <div
            className={`timeline-item ${item.status}`}
            key={item.id}
          >

            <div className="timeline-dot"></div>

            <div className="timeline-content">

              <div className="timeline-top">

                <h3>{item.title}</h3>

                <span className={`badge ${item.status}`}>

                  {item.status.toUpperCase()}

                </span>

              </div>

              <p>

                <strong>Officer:</strong> {item.officer}

              </p>

              <p>

                <strong>Remarks:</strong> {item.remarks}

              </p>

              <small>

                {item.date} • {item.time}

              </small>

            </div>

          </div>

        ))}

      </div>

      <div className="tracking-buttons">

        <button className="back-btn">

          Back

        </button>

        <button className="download-btn">

          Download Timeline

        </button>

      </div>

    </div>

  );

}

export default ApplicationTracking;