import axios from "axios";

const API = "http://localhost:8080/api/dashboard";

export const getDashboard = (userId) => {
  return axios.get(`${API}/${userId}`);
};