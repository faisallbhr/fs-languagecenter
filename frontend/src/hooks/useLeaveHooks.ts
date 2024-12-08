import useCreateLeave from "@/features/leave/useCreateLeave";
import useFetchLeave from "@/features/leave/useFetchLeave";
import useUpdateStatus from "@/features/leave/useUpdateStatus";
import { toast } from "./use-toast";

const useLeaveHooks = () => {
  const { data, isPending: pendingData, refetch } = useFetchLeave();

  const { mutate: createLeave, isPending: pendingCreate } = useCreateLeave({
    onSuccess: (res) => {
      toast({
        title: "Success!",
        description: res.message,
        duration: 3000,
      });
      refetch();
    },
    onError: (err) =>
      toast({
        variant: "destructive",
        title: "Error!",
        description: err.response?.data.message,
        duration: 3000,
      }),
  });

  const { mutate: updateStatus } = useUpdateStatus({
    onSuccess: (res) => {
      toast({
        title: "Success!",
        description: res.message,
        duration: 3000,
      });
      refetch();
    },
    onError: (err) =>
      toast({
        variant: "destructive",
        title: "Error!",
        description: err.response?.data.message,
        duration: 3000,
      }),
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  return {
    data,
    pendingData,
    createLeave,
    pendingCreate,
    handleStatusChange,
  };
};

export default useLeaveHooks;
