import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your express API
  withCredentials: true, // allow cookies
});

export default api;
