import {useEffect,useState} from "react";

import {getUsers} from "../services/userService";


function UserList(){


    const [users,setUsers]=useState([]);



    useEffect(()=>{

        loadUsers();

    },[]);




    const loadUsers=async()=>{


        try{


            const response = await getUsers();


            setUsers(response.data);



        }
        catch(error){

            console.log(
                "Error loading users",
                error
            );

        }


    };




    return(

        <div>


            <h1>
                Users From Database
            </h1>



            {

                users.map((user)=>(


                    <div key={user.id}>


                        <h3>

                        {
                        user.firstName
                        }
                        {" "}
                        {
                        user.lastName
                        }

                        </h3>


                        <p>
                        Username:
                        {" "}
                        {user.username}
                        </p>


                        <p>
                        Email:
                        {" "}
                        {user.email}
                        </p>


                        <hr/>


                    </div>


                ))

            }



        </div>


    );

}


export default UserList;