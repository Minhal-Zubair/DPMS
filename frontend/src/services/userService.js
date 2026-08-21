import axios from "axios";

const API = "http://localhost:8080/api/users";


// ===============================
// GET ALL USERS
// ===============================

export const getAllUsers = () => {

    return axios.get(API);

};



// ===============================
// GET USER BY ID
// ===============================

export const getUserById = (id) => {

    return axios.get(`${API}/${id}`);

};



// ===============================
// CREATE USER
// ===============================

export const createUser = (data) => {

    return axios.post(API, data);

};



// ===============================
// UPDATE USER
// ===============================

export const updateUser = (id, data) => {

    return axios.put(
        `${API}/${id}`,
        data
    );

};



// ===============================
// DELETE USER
// ===============================

export const deleteUser = (id) => {

    return axios.delete(
        `${API}/${id}`
    );

};



// ===============================
// ENABLE / DISABLE USER
// ===============================

export const updateUserStatus = (
    id,
    enabled
) => {

    return axios.put(
        `${API}/${id}/status`,
        {
            enabled
        }
    );

};



// ===============================
// LOCK / UNLOCK USER
// ===============================

export const updateUserLock = (
    id,
    accountLocked
) => {

    return axios.put(
        `${API}/${id}/lock`,
        {
            accountLocked
        }
    );

};