import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex justify-center items-center h-dvh">
      <Toaster />
      <Outlet />
    </div>
  );
}
