import axios from "axios";

/* ================= BASE URL ================= */
const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
    params: { search, filter },
  });

/* ================= MATCH REQUESTS ================= */
export const sendMatchRequest = (receiver_id) =>
  API.post("/match-requests", { receiver_id });

export const getIncomingRequests = () =>
  API.get("/match-requests/incoming");

export const acceptMatchRequest = (requestId) =>
  API.post(`/match-requests/${requestId}/accept`);

export const rejectMatchRequest = (requestId) =>
  API.post(`/match-requests/${requestId}/reject`);