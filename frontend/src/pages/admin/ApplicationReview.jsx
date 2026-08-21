import { useEffect, useState } from "react";

import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Pencil
} from "lucide-react";

import {
  getAllApplications,
  getApplication,
  updateApplicationStatus,
  updateApplication,
} from "../../services/applicationService";
import { getProducts } from "../../services/productService";

import "./ApplicationReview.css";


const ApplicationReview = () => {

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [editApplication, setEditApplication] = useState(null);

  const [updating, setUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    cnic: "",
    productionDate: "",
    productId: "",
    remarks: "",
  });

  const handleUpdateApplication = async () => {
  try {
    console.log("Sending:", editForm);
    setUpdating(true);
    await updateApplication(
      editApplication.id,
      editForm
    );
    // Reload latest applications
    await loadApplications();
    // Close popup
    setEditApplication(null);
    // Show success message
    showMessage(
      "Application updated successfully!",
      "success"
    );
  } catch (error) {
    console.error(error);
    showMessage(
      "Failed to update application!",
      "error"
    ); 
  } finally {
    setUpdating(false);
  }
};


  /*
  ==========================================
  Hardcoded Data (Keep for Reference)
  ==========================================
  */

  const demoApplications = [
    {
      id: 1,
      name: "Ali Ahmed",
      email: "ali@gmail.com",
      program: "Computer Science",
      submitted: "20 July 2026",
      status: "Pending"
    }
  ];



  /*
  ==========================================
  Load Applications From Database
  ==========================================
  */

  useEffect(() => {

    loadApplications();
    loadProducts();

  }, []);


  const loadApplications = async () => {
    try {
      const response = await getAllApplications();
      console.log(
        "Applications From Backend:",
        response.data
      );
      setApplications(response.data);
    } catch (error) {
      console.error(
        "Loading applications failed:",
        error
      );
      showMessage(
        "Failed to load applications",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const loadProducts = async () => {
    try {
      const response = await getProducts();
      console.log("Products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };



  /*
  ==========================================
  Message Helper
  ==========================================
  */

  const showMessage = (text, type) => {

    setMessage(text);

    setMessageType(type);


    setTimeout(() => {

      setMessage("");

    }, 3000);

  };



  /*
  ==========================================
  Status Colors
  ==========================================
  */

  const statusStyle = (status) => {

    switch (status) {

      case "Approved":
        return "status-approved";

      case "Rejected":
        return "status-rejected";

      case "Submitted":
        return "status-submitted";

      case "Under Review":
      case "Under_Review":
        return "status-review";

      default:
        return "status-pending";
    }

  };



  /*
  ==========================================
  View Application Details
  ==========================================
  */

  const viewApplication = async (id) => {
    console.log("VIEW BUTTON CLICKED ID:", id);

    try {

      const response = await getApplication(id);

      console.log("VIEW API RESPONSE:", response.data);

      console.log(
        "Application Details:",
        response.data
      );


      setSelectedApplication(
        response.data
      );


    } catch (error) {

      console.error("VIEW ERROR:", error);

      showMessage(
        "Unable to load details",
        "error"
      );

    }

  };

  const editApplicationData = async (id) => {
    try {
      const response = await getApplication(id);

      const app = response.data;

      setEditApplication(app);

      setEditForm({
        cnic: app.cnic || "",
        productionDate: app.productionDate || "",
        productId: app.productId || "",
        remarks: app.remarks || "",
      });

    } catch (error) {

      showMessage(
        "Unable to load application",
        "error"
      );

    }
  };



  /*
  ==========================================
  Approve / Reject
  ==========================================
  */

  const changeStatus = async (
    id,
    status
  ) => {

    console.log(
      "STATUS BUTTON CLICKED",
      id,
      status
    );


    const confirmAction = window.confirm(
      `Are you sure you want to ${status} this application?`
    );


    if (!confirmAction)
      return;



    try {


      const response =
        await updateApplicationStatus(
          id,
          status
        );


      console.log(
        "STATUS RESPONSE",
        response
      );

      await loadApplications();

      if (
        selectedApplication &&
        selectedApplication.id === id
      ) {

        const updated =
          await getApplication(id);


        setSelectedApplication(
          updated.data
        );

      }

      showMessage(
        `Application ${status} successfully`,
        "success"
      );


    } catch (error) {


      console.error(error);


      showMessage(
        "Status update failed",
        "error"
      );


    }


  };



  /*
  ==========================================
  Search Filter
  ==========================================
  */

  const filteredApplications =
    applications.filter((app) => {


      const keyword =
        search.toLowerCase();


      return (

        app.applicationNumber
          ?.toLowerCase()
          .includes(keyword)


        ||

        app.applicant
          ?.toLowerCase()
          .includes(keyword)


        ||

        app.product
          ?.toLowerCase()
          .includes(keyword)

      );


    });



  /*
  ==========================================
  Dashboard Counts
  ==========================================
  */


  const pending =
    applications.filter(
      app =>
        app.status === "Submitted"
        ||
        app.status === "Under Review"
    ).length;



  const approved =
    applications.filter(
      app =>
        app.status === "Approved"
    ).length;



  const rejected =
    applications.filter(
      app =>
        app.status === "Rejected"
    ).length;



  if (loading) {

    return (

      <div className="loading-container">

        <h2>
          Loading Applications...
        </h2>

      </div>

    );

  }

  return (
    <div>



      {/* ===========================
          Header
      ============================ */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Application Review
        </h1>


        <p className="text-gray-500 mt-1">
          Review, approve or reject submitted applications.
        </p>


      </div>



      {/* ===========================
          Success / Error Message
      ============================ */}


      {
        message && (

          <div
            className={`mb-4 px-4 py-3 rounded-lg font-medium ${messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"

              }`}
          >

            {message}

          </div>

        )
      }




      {/* ===========================
          Application Table
      ============================ */}


      <div className="bg-white rounded-xl shadow-md overflow-hidden">


        {/* Search */}

        <div className="table-header">
          <div className="search-box"></div>
          <input
            type="text"
            placeholder="Search Application..."
            value={search}
            onChange={
              (e) => setSearch(e.target.value)
            }
          />
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                Application #
              </th>
              <th className="px-6 py-4 text-left">
                Applicant
              </th>
              <th className="px-6 py-4 text-left">
                Product
              </th>
              <th className="px-6 py-4 text-left">
    Production Date
</th>
              <th className="px-6 py-4 text-left">
                Status
              </th>
              <th className="px-6 py-4 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {
              filteredApplications.length > 0 ?
                (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b hover:bg-gray-50"
                    >
                      {/* Application Number */}
                      <td className="px-6 py-4">
                        {app.applicationNumber}
                      </td>




                      {/* Applicant */}

                      <td className="px-6 py-4">

                        {app.applicant}

                      </td>




                      {/* Product */}

                      <td className="px-6 py-4">

                        {app.product}

                      </td>




                      {/* Date */}

                      <td className="px-6 py-4">

                        {app.productionDate}

                      </td>





                      {/* Status */}

                      <td className="px-6 py-4">


                        <span
                          className={`status-badge ${statusStyle(app.status)}`}
                        >

                          {app.status}

                        </span>


                      </td>





                      {/* Actions */}

                      <td className="px-6 py-4">


                        <div className="flex gap-3">



                          {/* View */}

                          <button
                            className="
                              p-2
                              rounded-lg
                              bg-blue-100
                              text-blue-600
                              hover:bg-blue-200
                              "
                            onClick={() => viewApplication(app.id)}
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            className="
                              p-2
                              rounded-lg
                              bg-yellow-100
                              text-yellow-700
                              hover:bg-yellow-200
                            "
                            onClick={() => editApplicationData(app.id)}
                          >
                            <Pencil size={18} />
                          </button>

                          {/* Approve */}

                          <button
                            disabled={app.status === "Approved"}
                            className={`
        p-2
        rounded-lg

        ${app.status === "Approved"
                                ?
                                "bg-gray-200 text-gray-400 cursor-not-allowed"
                                :
                                "bg-green-100 text-green-600 hover:bg-green-200"
                              }
      `}
                            onClick={() =>
                              changeStatus(
                                app.id,
                                "Approved"
                              )
                            }
                          >
                            <CheckCircle size={18} />
                          </button>


                          {/* Reject */}

                          <button
                            disabled={app.status === "Rejected"}
                            className={`
        p-2
        rounded-lg

        ${app.status === "Rejected"
                                ?
                                "bg-gray-200 text-gray-400 cursor-not-allowed"
                                :
                                "bg-red-100 text-red-600 hover:bg-red-200"
                              }
      `}
                            onClick={() =>
                              changeStatus(
                                app.id,
                                "Rejected"
                              )
                            }
                          >
                            <XCircle size={18} />
                          </button>
                        </div>


                      </td>



                    </tr>


                  ))


                )



                :


                (

                  <tr>


                    <td

                      colSpan="6"

                      className="
                  text-center
                  py-8
                  text-gray-500
                  "

                    >

                      No applications found.

                    </td>


                  </tr>


                )


            }


          </tbody>



        </table>


        {/* ===========================
          Application Details Modal
      ============================ */}


        {
          selectedApplication && (

            <div className="modal-overlay">


              <div className="application-modal">


                <h2>
                  Application Details
                </h2>



                <p>
                  <strong>
                    Application #
                  </strong>

                  <br />

                  {
                    selectedApplication.applicationNumber
                  }

                </p>




                <p>
                  <strong>
                    Applicant
                  </strong>

                  <br />

                  {
                    selectedApplication.applicant
                  }

                </p>




                <p>
                  <strong>
                    Email
                  </strong>

                  <br />

                  {
                    selectedApplication.email
                  }

                </p>




                <p>
                  <strong>
                    Phone
                  </strong>

                  <br />

                  {
                    selectedApplication.phone
                  }

                </p>




                <p>

                  <strong>
                    CNIC
                  </strong>

                  <br />

                  {
                    selectedApplication.cnic
                  }

                </p>





                <p>

                  <strong>
                    Product
                  </strong>

                  <br />

                  {
                    selectedApplication.product
                  }

                </p>





                <p>

                  <strong>
                    Production Date
                  </strong>

                  <br />

                  {
                    selectedApplication.productionDate
                  }

                </p>





                <p>

                  <strong>
                    Submitted Date
                  </strong>

                  <br />

                  {
                    selectedApplication.submittedDate
                  }

                </p>





                <p>

                  <strong>
                    Status
                  </strong>

                  <br />

                  {
                    selectedApplication.status
                  }

                </p>





                <p>

                  <strong>
                    Remarks
                  </strong>

                  <br />

                  {
                    selectedApplication.remarks
                  }

                </p>





                <button

                  className="
                mt-4
                px-4
                py-2
                bg-blue-600
                text-white
                rounded-lg
                hover:bg-blue-700
                "

                  onClick={() =>
                    setSelectedApplication(null)
                  }

                >

                  Close

                </button>




              </div>


            </div>


          )
        }

        {
          editApplication && (

            <div className="modal-overlay">

              <div className="application-modal">

                <h2>Edit Application</h2>

                <div className="form-group">

                  <label>Product</label>

                  <select
                    value={editForm.productId}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        productId: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Select Product</option>

                    {products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.productName}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="form-group">

                  <label>Production Date</label>

                  <input
                    type="date"
                    value={editForm.productionDate}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        productionDate: e.target.value
                      })
                    }
                  />

                </div>

                <div className="form-group">
                  <label>CNIC</label>
                  <input
                    type="text"
                    value={editForm.cnic}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        cnic: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">

                  <label>Remarks</label>

                  <textarea
                    rows="4"
                    value={editForm.remarks}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        remarks: e.target.value
                      })
                    }
                  />

                </div>

                <div className="modal-buttons">

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      setEditApplication(null)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="save-btn"
                    disabled={updating}
                    onClick={handleUpdateApplication}
                  >
                  {updating ? "Updating..." : "Update"}
                    Update
                  </button>

                </div>

              </div>

            </div>

          )
        }

      </div>





      {/* ===========================
          Summary Cards
      ============================ */}



      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">





        {/* Pending */}

        <div className="bg-white shadow rounded-xl p-5">


          <div className="flex items-center gap-3">


            <Clock className="text-yellow-500" />


            <div>


              <p className="text-gray-500">
                Pending
              </p>


              <h2 className="text-2xl font-bold">
                {pending}
              </h2>


            </div>


          </div>


        </div>







        {/* Approved */}

        <div className="bg-white shadow rounded-xl p-5">


          <div className="flex items-center gap-3">


            <CheckCircle className="text-green-500" />


            <div>


              <p className="text-gray-500">
                Approved
              </p>


              <h2 className="text-2xl font-bold">
                {approved}
              </h2>


            </div>


          </div>


        </div>








        {/* Rejected */}

        <div className="bg-white shadow rounded-xl p-5">


          <div className="flex items-center gap-3">


            <XCircle className="text-red-500" />


            <div>


              <p className="text-gray-500">
                Rejected
              </p>


              <h2 className="text-2xl font-bold">
                {rejected}
              </h2>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


export default ApplicationReview;