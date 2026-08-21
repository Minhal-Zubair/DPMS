import axios from "axios";


const API_URL =
    "http://localhost:8080/api/users";



// Upload image

export const uploadProfileImage = (
    userId,
    file
)=>{


    const formData = new FormData();


    formData.append(
        "file",
        file
    );


    return axios.post(
        `${API_URL}/${userId}/profile-image`,
        formData,
        {
            headers:{
                "Content-Type":
                "multipart/form-data"
            }
        }
    );


};




// Get image URL

export const getProfileImageUrl = (
    userId
)=>{


    return `${API_URL}/${userId}/profile-image`;


};