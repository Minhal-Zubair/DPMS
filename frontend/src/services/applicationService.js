import axios from "axios";
const API = "http://localhost:8080/api/applications";
// Get all applications
export const getAllApplications = () => {
  return axios.get(API);
};
// Get one application
export const getApplication = (id) => {
  return axios.get(`${API}/${id}`);
};
export const updateApplication = (id, data) => {
  return axios.put(`${API}/${id}`, data);
};
// Approve / Reject
export const updateApplicationStatus = (id, status) => {
  return axios.put(`${API}/${id}/status`, {
    status,
  });
};
// User applications (for My Applications page)
export const getUserApplications = (userId) => {
  return axios.get(`${API}/user/${userId}`);
};
// Create application
export const createApplication = (data) => {
  return axios.post(API, data);
};