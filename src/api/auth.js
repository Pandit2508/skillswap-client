import axios from "axios";

/* ================= BASE URL ================= */
const BASE_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://skillswap-server-1-hn4n.onrender.com/api";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for cookies
});

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    // Routes where redirect should NOT happen
    const ignoredRoutes = ["/login", "/signup"];

    // 🔥 Also ignore auth-check endpoint
    const isAuthCheck = error.config?.url?.includes("/auth/me");

    if (
      status === 401 &&
      !ignoredRoutes.includes(currentPath) &&
      !isAuthCheck
    ) {
      console.error("Unauthorized - redirecting to login");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

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

export default API;