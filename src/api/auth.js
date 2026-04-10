import axios from "axios";

/* ================= BASE URL ================= */
const BASE_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://skillswap-server-1-hn4n.onrender.com/api";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: BASE_URL,
});

/* ================= REQUEST INTERCEPTOR ================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Auto logout if token invalid/expired
    if (error.response?.status === 401) {
      console.error("🔐 Unauthorized - logging out");

      localStorage.removeItem("token");

      // optional: redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => {
  localStorage.removeItem("token"); // 🔥 important now
  return Promise.resolve();
};
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