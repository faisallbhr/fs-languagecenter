import { API_BASE_URL } from "@/constants/api";
import { getAuthToken, clearAuthData } from "@/lib/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const token = getAuthToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        clearAuthData();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
