import useCreateLeave from "@/features/leave/useCreateLeave";
import useFetchLeave from "@/features/leave/useFetchLeave";
import useUpdateStatus from "@/features/leave/useUpdateStatus";

const useLeaveHooks = () => {
  const { data, isPending: pendingData, refetch } = useFetchLeave();

  const { mutate: createLeave, isPending: pendingCreate } = useCreateLeave({
    onSuccess: () => refetch(),
    onError: (err) => console.error(err.response?.data.message),
  });

  const { mutate: updateStatus } = useUpdateStatus({
    onSuccess: () => refetch(),
    onError: (err) => console.error(err.response?.data.message),
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
