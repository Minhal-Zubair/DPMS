import axios from "axios";

const API = "http://localhost:8080/api/profile";

export const getProfile = (userId) =>
    axios.get(`${API}/${userId}`);

export const updateProfile = (userId, data) =>
    axios.put(`${API}/${userId}`, data);