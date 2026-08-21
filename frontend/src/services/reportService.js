import axios from "axios";

const API = "http://localhost:8080/api/reports";

export const getReportSummary = () => {
    return axios.get(API);
};