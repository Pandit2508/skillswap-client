import axios from 'axios';

axios.defaults.withCredentials = true;
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, //  sends cookies with requests
});

axios.get("http://localhost:5000/api/profile", {
  withCredentials: true
})

// Signup user
export const signupUser = (data) => API.post("/auth/signup", data);

// Login user
export const loginUser = (data) => API.post("/auth/login", data);

// Logout user
export const logoutUser = () => API.post("/auth/logout");

// Get current user
export const getMe = () => API.get("/auth/me");
