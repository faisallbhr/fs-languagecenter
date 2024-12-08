import useLogin from "@/features/auth/useLogin";
import useRegister from "@/features/auth/useRegister";
import { saveAuthData } from "@/lib/auth";
import { useNavigate } from "react-router";
import { toast } from "./use-toast";

const useAuthHooks = () => {
  const navigate = useNavigate();

  const { mutate: register, isPending: pendingRegister } = useRegister({
    onSuccess: (res) => {
      toast({
        title: "Success!",
        description: res.message,
        duration: 3000,
      });
      navigate("/login");
    },
    onError: (err) =>
      toast({
        variant: "destructive",
        title: "Error!",
        description: err.response?.data.message,
        duration: 3000,
      }),
  });

  const { mutate: login, isPending: pendingLogin } = useLogin({
    onSuccess: (res) => {
      if (res.data) {
        saveAuthData(res.data);
        navigate("/dashboard");
      }
    },
    onError: (err) =>
      toast({
        variant: "destructive",
        title: "Error!",
        description: err.response?.data.message,
        duration: 3000,
      }),
  });

  return {
    register,
    pendingRegister,
    login,
    pendingLogin,
  };
};

export default useAuthHooks;
