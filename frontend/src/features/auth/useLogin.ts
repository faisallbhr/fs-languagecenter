import { ENDPOINTS } from "@/constants/api";
import api from "@/lib/api";
import { LoginParams } from "@/types/request/login";
import { LoginResponse } from "@/types/response/login";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useLogin = (
  options: UseMutationOptions<
    LoginResponse,
    AxiosError<LoginResponse>,
    LoginParams
  >
) => {
  return useMutation({
    mutationFn: async (credentials: LoginParams) => {
      const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return data;
    },
    ...options,
  });
};

export default useLogin;
