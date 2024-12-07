import { ENDPOINTS } from "@/constants/api";
import api from "@/lib/api";
import { CommonResponse } from "@/types/common";
import { RegisterParams } from "@/types/request/register";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useRegister = (
  options: UseMutationOptions<
    CommonResponse<null>,
    AxiosError<CommonResponse<null>>,
    RegisterParams
  >
) => {
  return useMutation({
    mutationFn: async (data: RegisterParams) => {
      const res = await api.post(ENDPOINTS.AUTH.REGISTER, data);
      return res.data;
    },
    ...options,
  });
};

export default useRegister;
