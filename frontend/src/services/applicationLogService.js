import axios from "axios";

const API = "http://localhost:8080/api/logs";

export const getAllLogs = () => {
    return axios.get(API);
};

export const getLogsByApplicationId = (applicationId) => {
    return axios.get(`${API}/${applicationId}`);
};
