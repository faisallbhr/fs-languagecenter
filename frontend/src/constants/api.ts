export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/user/register",
    LOGIN: "/user/login",
  },
  LEAVE: {
    GET: "/leave",
    CREATE: "/leave",
    PATCH: "/leave/:id/status",
  },
};
