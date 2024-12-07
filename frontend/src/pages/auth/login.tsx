import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { LoginParams } from "@/types/request/login";
import useAuthHooks from "@/hooks/useAuthHooks";

const formSchema = z.object({
  email: z.string().min(1, "Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function Login() {
  const form = useForm<LoginParams>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login, pendingLogin } = useAuthHooks();

  const onSubmit = (data: LoginParams) => {
    login(data);
  };
  return (
    <div className="p-4 m-4 max-w-xl w-full">
      <h1 className="text-center font-bold text-2xl">Let's Authenticate</h1>
      <p className="text-center text-sm mb-8">
        Start your session by providing valid credentials
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="rounded"
                    placeholder="lc@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="rounded"
                    placeholder="*******"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full rounded" disabled={pendingLogin}>
            Login
          </Button>
        </form>
      </Form>
      <small className="block text-center mt-6">
        Don't have an account?{" "}
        <Link to={"/register"} className="text-blue-500 hover:underline">
          Come join us!
        </Link>
      </small>
    </div>
  );
}
