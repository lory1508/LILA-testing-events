import axios from "axios";

// baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}:${import.meta.env.VITE_APP_API_BASE_PORT}`,
const api = axios.create({
  withCredentials: false,
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}`,
  headers: {
    "Content-type": "application/json",
  },
});

export default api;
