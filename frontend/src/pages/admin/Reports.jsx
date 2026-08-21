import {
  FileBarChart,
  Download,
  Printer,
  CalendarDays,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);
import { Pie, Bar } from "react-chartjs-2";
import { getReportSummary } from "../../services/reportService";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Reports.css";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const currentDate = new Date().toLocaleString();
  const reportRef = useRef(null);
  const reports = [
    {
      title: "Applications Report",
      description: "Summary of submitted applications.",
      icon: <FileText size={28} />,
    },
    {
      title: "Users Report",
      description: "Registered users and account activity.",
      icon: <Users size={28} />,
    },
    {
      title: "Monthly Analytics",
      description: "Monthly system statistics.",
      icon: <TrendingUp size={28} />,
    },
    {
      title: "Processing Report",
      description: "Application approval statistics.",
      icon: <FileBarChart size={28} />,
    },
  ];

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      console.log("Loading report...");
      const response = await getReportSummary();
      console.log("Report API Response:", response.data);
      setSummary(response.data);
    } catch (error) {
      console.error("Report Error:", error);
      setMessage("Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    await loadSummary();
    setMessage("Report generated successfully.");
    downloadPDF();
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current, {
      scale: 2
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;
    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );
    pdf.save("DPMS_Report.pdf");
  };

  const printReport = () => {
    window.print();
  };

  const applicationChart = {
    labels: [
      "Approved",
      "Pending",
      "Rejected"
    ],
    datasets: [
      {
        data: [
          summary?.approvedApplications ?? 0,
          summary?.pendingApplications ?? 0,
          summary?.rejectedApplications ?? 0,
        ],
        backgroundColor: [
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  const userChart = {
    labels: [
      "Active",
      "Disabled",
      "Locked",
    ],
    datasets: [
      {
        label: "Users",
        data: [
          summary?.activeUsers ?? 0,
          summary?.disabledUsers ?? 0,
          summary?.lockedUsers ?? 0,
        ],
        backgroundColor: [
          "#2563eb",
          "#f97316",
          "#dc2626",
        ],
      },
    ],
  };


  return (
    <div
      className="reports-page"
      ref={reportRef}
    >

      <div className="reports-header">
        {
          message &&
          <div className="report-message">
            {message}
          </div>
        }

        <div>
          <h1>Reports</h1>
          <p>
            Generate, print and download system reports.
          </p>
        </div>

        <button
          className="generate-btn"
          onClick={generateReport}
          disabled={loading}
        >

          <Download size={20} />
          {loading ? "Generating..." : "Generate Report"}
          Generate Report
        </button>
      </div>

      <div className="reports-grid">

        {reports.map((report, index) => (

          <div
            key={index}
            className="report-card"
          >

            <div className="report-icon">
              {report.icon}
            </div>

            <h3 className="report-title">{report.title}</h3>
            <h2 className="report-total">
              {index === 0 && (summary?.totalApplications ?? 0)}
              {index === 1 && (summary?.totalUsers ?? 0)}
              {index === 2 && (summary?.approvedApplications ?? 0)}
              {index === 3 && (summary?.pendingApplications ?? 0)}
            </h2>

            <p className="report-description">{report.description}</p>
            <div className="report-actions">
              <button onClick={printReport}>
                <Printer size={16} />
                Print
              </button>
              <button onClick={downloadPDF}>
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="stats-overview">
        <div className="stat-box blue">
          <h4>Total Users</h4>
          <h2>{summary?.totalUsers ?? 0}</h2>
        </div>
        <div className="stat-box green">
          <h4>Applications</h4>
          <h2>{summary?.totalApplications ?? 0}</h2>
        </div>
        <div className="stat-box orange">
          <h4>Approved</h4>
          <h2>{summary?.approvedApplications ?? 0}</h2>
        </div>
        <div className="stat-box red">
          <h4>Rejected</h4>
          <h2>{summary?.rejectedApplications ?? 0}</h2>
        </div>

      </div>

      <div className="summary-box">

        <CalendarDays size={40} />

        <div>
          <h2>System Summary</h2>

          <p>Total Users : {summary?.totalUsers ?? 0}</p>

          <p>Active Users : {summary?.activeUsers ?? 0}</p>

          <p>Disabled Users : {summary?.disabledUsers ?? 0}</p>

          <p>Locked Users : {summary?.lockedUsers ?? 0}</p>

          <p>Total Notifications : {summary?.totalNotifications ?? 0}</p>

          <p>Audit Logs : {summary?.totalAuditLogs ?? 0}</p>

          <p className="report-date">
            Last Generated: {currentDate}
          </p>


        </div>

      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Application Statistics</h3>
          <Pie data={applicationChart} />
        </div>
        <div className="chart-card">
          <h3>User Statistics</h3>
          <Bar data={userChart} />
        </div>
      </div>
    </div>
  );
}

export default Reports;