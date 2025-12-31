import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-service-center-backend.onrender.com/api", // your express API
  withCredentials: true, // allow cookies
});

export default api;
