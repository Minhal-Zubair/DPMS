import api from "../api/axios";



const register = async(userData)=>{

    const response =
        await api.post(
            "/auth/register",
            userData
        );


    return response.data;

};



const login = async(loginData)=>{

    const response =
        await api.post(
            "/auth/login",
            loginData
        );


    if(response.data.token){

        localStorage.setItem(
            "token",
            response.data.token
        );

        localStorage.setItem(
            "username",
            response.data.username
        );

    }


    return response.data;

};



const logout = ()=>{

    localStorage.removeItem("token");

    localStorage.removeItem("username");

};



export default {

    register,

    login,

    logout

};