import { ENDPOINTS } from "@/constants/api";
import api from "@/lib/api";
import { CommonResponse } from "@/types/common";
import { LeaveParams } from "@/types/request/leave";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useCreateLeave = (
  options: UseMutationOptions<
    CommonResponse<null>,
    AxiosError<CommonResponse<null>>,
    LeaveParams
  >
) => {
  return useMutation({
    mutationFn: async (data: LeaveParams) => {
      const res = await api.post(ENDPOINTS.LEAVE.CREATE, data);
      return res.data;
    },
    ...options,
  });
};

export default useCreateLeave;
