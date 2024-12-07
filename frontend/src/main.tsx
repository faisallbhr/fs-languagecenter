import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AuthLayout from "./layouts/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/dashboard";
import { clearAuthData, getAuthToken } from "./lib/auth";
import { jwtDecode } from "jwt-decode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const RequireAuth = () => {
  const token = getAuthToken();
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        clearAuthData();
        return <Navigate to="/login" replace />;
      }
    } catch (error) {
      console.log("Invalid token:", error);
      clearAuthData();
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
