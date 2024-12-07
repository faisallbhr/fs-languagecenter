import { User } from "@/types/response/login";

export const saveAuthData = (data: User) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    })
  );
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getUserInfo = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
