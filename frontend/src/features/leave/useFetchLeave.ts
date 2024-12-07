import { ENDPOINTS } from "@/constants/api";
import api from "@/lib/api";
import { Leave, LeaveResponse } from "@/types/response/leave";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useFetchLeave = () => {
  return useQuery<Leave[], AxiosError<LeaveResponse>>({
    queryKey: ["leave"],
    queryFn: async () => {
      const { data } = await api.get(ENDPOINTS.LEAVE.GET);
      return data.data;
    },
  });
};

export default useFetchLeave;
