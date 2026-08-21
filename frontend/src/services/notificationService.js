import axios from "axios";


const API_URL = "http://localhost:8080/api/notifications";


// Get all notifications

export const getNotifications = (userId) => {

    return axios.get(
        `${API_URL}/user/${userId}`
    );

};



// Get unread notification count

export const getNotificationCount = (userId) => {

    return axios.get(
        `${API_URL}/user/${userId}/count`
    );

};



// Mark notification read

export const markAsRead = (id) => {

    return axios.put(
        `${API_URL}/read/${id}`
    );

};



// Mark all notifications read

export const markAllRead = (userId) => {

    return axios.put(
        `${API_URL}/read-all/${userId}`
    );

};



// Delete notification

export const deleteNotification = (id) => {

    return axios.delete(
        `${API_URL}/${id}`
    );

};