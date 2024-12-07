import useLogin from "@/features/auth/useLogin";
import useRegister from "@/features/auth/useRegister";
import { saveAuthData } from "@/lib/auth";
import { useNavigate } from "react-router";

const useAuthHooks = () => {
  const navigate = useNavigate();

  const { mutate: register, isPending: pendingRegister } = useRegister({
    onSuccess: () => navigate("/login"),
    onError: (err) => console.log(err.response?.data.message),
  });

  const { mutate: login, isPending: pendingLogin } = useLogin({
    onSuccess: (res) => {
      if (res.data) {
        saveAuthData(res.data);
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      console.log(err.response?.data.message);
    },
  });

  return {
    register,
    pendingRegister,
    login,
    pendingLogin,
  };
};

export default useAuthHooks;
