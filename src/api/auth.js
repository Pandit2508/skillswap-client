import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api", // match your backend
});

// Signup user
export const signupUser = (data) => API.post("/auth/signup", data);

// Login user
export const loginUser = (data) => API.post("/auth/login", data);
