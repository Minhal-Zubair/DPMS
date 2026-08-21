import axios from "axios";

const API = "http://localhost:8080/api/settings";

export const getSettings = (userId) =>
  axios.get(`${API}/${userId}`);

export const saveSettings = (userId, data) =>
  axios.put(`${API}/${userId}`, data);