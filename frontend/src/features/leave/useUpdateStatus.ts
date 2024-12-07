import { ENDPOINTS } from "@/constants/api";
import api from "@/lib/api";
import { CommonResponse } from "@/types/common";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useUpdateStatus = (
  options: UseMutationOptions<
    CommonResponse<null>,
    AxiosError<CommonResponse<null>>,
    { id: string; status: string }
  >
) => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const url = ENDPOINTS.LEAVE.PATCH.replace(":id", id);
      const res = await api.patch(url, { status });
      return res.data;
    },
    ...options,
  });
};

export default useUpdateStatus;
