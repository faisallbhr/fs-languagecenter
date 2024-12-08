import LeaveForm from "@/components/leave-form";
import LeaveTable from "@/components/leave-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import useLeaveHooks from "@/hooks/useLeaveHooks";
import { clearAuthData, getUserInfo } from "@/lib/auth";
import { LeaveParams } from "@/types/request/leave";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { data, pendingData, createLeave, pendingCreate, handleStatusChange } =
    useLeaveHooks();
  const { id, name, role } = getUserInfo();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = (data: LeaveParams) => {
    createLeave(data);
    setIsDialogOpen(false);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };
  return (
    <div className="max-w-7xl mx-auto p-4">
      <Toaster />
      <h1 className="text-center font-bold text-3xl">Data Pengajuan Cuti</h1>
      <div className="flex justify-end gap-4 mt-8">
        <Button
          variant={"secondary"}
          onClick={handleLogout}
          className="rounded">
          Logout
        </Button>
        {role === "employee" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded">Buat pengajuan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat pengajuan cuti</DialogTitle>
                <DialogDescription>
                  Isi formulir di bawah ini untuk pengajuan cuti.
                </DialogDescription>
              </DialogHeader>
              <LeaveForm
                userId={id}
                userName={name}
                onSubmit={onSubmit}
                isPending={pendingCreate}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <LeaveTable
        data={data}
        pendingData={pendingData}
        role={role}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
