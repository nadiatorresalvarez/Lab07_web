import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const register = (username, email, password) => {
  return axios.post(`${API_URL}signup`, { username, email, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}signin`, { username, password });
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};