import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api",
  withCredentials: true, // 🔒 important for cookies/JWT
});

/* ================= AUTH ================= */
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");

/* ================= PROFILE ================= */
export const createProfile = (data) => API.post("/profile", data);
export const getProfile = () => API.get("/profile");

/* ================= USER DISCOVERY ================= */
export const getUsers = (search = "", filter = "all") =>
  API.get("/users", {
    params: {
      search,
      filter,
    },
  });

/* ================= MATCH REQUESTS ================= */

// Send match request
export const sendMatchRequest = (receiver_id) =>
  API.post("/match-requests", { receiver_id });

// 🔹 Get incoming match requests
export const getIncomingRequests = () =>
  API.get("/match-requests/incoming");

// 🔹 Accept match request
export const acceptMatchRequest = (requestId) =>
  API.post(`/match-requests/${requestId}/accept`);

// 🔹 Reject match request
export const rejectMatchRequest = (requestId) =>
  API.post(`/match-requests/${requestId}/reject`);
