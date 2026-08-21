import { useEffect, useState } from "react";

import {
  Search,
  Pencil,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Lock,
  Unlock
} from "lucide-react";

import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  updateUserLock
} from "../../services/userService";

import "./ManageUsers.css";


function ManageUsers() {


  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);



  // ==========================
  // LOAD USERS
  // ==========================

  useEffect(() => {

    loadUsers();

  }, []);



  const loadUsers = async () => {

    try {

      const response = await getAllUsers();

      console.log(
        "USERS FROM DATABASE:",
        response.data
      );


      setUsers(response.data);


    } catch(error){

      console.error(
        "Loading users failed:",
        error
      );

    }
    finally{

      setLoading(false);

    }

  };




  // ==========================
  // DELETE USER
  // ==========================

  const handleDelete = async(id)=>{


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );


    if(!confirmDelete)
      return;


    try{

      await deleteUser(id);


      loadUsers();


    }
    catch(error){

      console.error(error);

    }

  };





  // ==========================
  // ENABLE / DISABLE
  // ==========================

  const toggleStatus = async(
    id,
    currentStatus
  )=>{


    try{


      await updateUserStatus(
        id,
        !currentStatus
      );


      loadUsers();


    }
    catch(error){

      console.error(error);

    }

  };





  // ==========================
  // LOCK / UNLOCK
  // ==========================

  const toggleLock = async(
    id,
    locked
  )=>{


    try{


      await updateUserLock(
        id,
        !locked
      );


      loadUsers();


    }
    catch(error){

      console.error(error);

    }


  };





  // ==========================
  // SEARCH
  // ==========================

  const filteredUsers =
    users.filter((user)=>{


      const text =
        search.toLowerCase();



      return (

        user.firstName
        ?.toLowerCase()
        .includes(text)

        ||

        user.lastName
        ?.toLowerCase()
        .includes(text)

        ||

        user.username
        ?.toLowerCase()
        .includes(text)

        ||

        user.email
        ?.toLowerCase()
        .includes(text)

      );


    });





  if(loading){

    return (

      <div className="loading-container">

        <h2>
          Loading Users...
        </h2>

      </div>

    );

  }




  return (

    <div className="manage-users">



      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Manage Users
          </h1>


          <p>
            View, edit and control system users.
          </p>

        </div>


      </div>





      {/* SEARCH */}

      <div className="toolbar">


        <div className="search-box">


          <Search size={18}/>


          <input

            type="text"

            placeholder="Search user..."

            value={search}

            onChange={
              (e)=>
              setSearch(e.target.value)
            }

          />


        </div>


      </div>






      {/* TABLE */}


      <div className="users-table">


        <table>


          <thead>

            <tr>

              <th>ID</th>

              <th>Name</th>

              <th>Username</th>

              <th>Email</th>

              <th>Status</th>

              <th>Account</th>

              <th>Actions</th>


            </tr>


          </thead>





          <tbody>


          {
            filteredUsers.map(
              (user)=>(


              <tr key={user.id}>


                <td>
                  {user.id}
                </td>




                <td>

                  {user.firstName}
                  {" "}
                  {user.lastName}

                </td>




                <td>

                  {user.username}

                </td>




                <td>

                  {user.email}

                </td>





                <td>


                  {

                  user.enabled ?


                  <span className="status active">

                    <UserCheck size={14}/>

                    Active

                  </span>


                  :

                  <span className="status blocked">

                    <UserX size={14}/>

                    Disabled

                  </span>


                  }



                </td>






                <td>


                  {


                  user.accountLocked ?


                  <span className="status blocked">

                    <Lock size={14}/>

                    Locked

                  </span>


                  :

                  <span className="status active">

                    <Unlock size={14}/>

                    Open

                  </span>
                  }
                </td>
                <td>

                  <button
                    className="edit-btn"
                    onClick={()=>
                      toggleStatus(
                        user.id,
                        user.enabled
                      )
                    }
                    title="Enable / Disable"
                  >
                    <UserCheck size={18}/>
                  </button>
                  <button
                    className="lock-btn"
                    onClick={()=>
                      toggleLock(
                        user.id,
                        user.accountLocked
                      )
                    }
                  >
                    {
                      user.accountLocked ?
                      <Unlock size={18}/>
                      :
                      <Lock size={18}/>
                    }
                  </button>
                  <button
                    className="delete-btn"
                    onClick={()=>
                      handleDelete(user.id)
                    }
                  >
                    <Trash2 size={18}/>
                  </button>
              
                </td>
              </tr>
              )
            )
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ManageUsers;