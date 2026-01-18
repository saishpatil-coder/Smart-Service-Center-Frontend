// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   withCredentials: true,
// });

// export default api;

import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api", // your express API
  baseURL :"https://smart-service-center-backend.onrender.com/api",
  withCredentials: true, // allow cookies
});

export default api;
