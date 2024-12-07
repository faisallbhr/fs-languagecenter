import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthHooks from "@/hooks/useAuthHooks";
import { RegisterParams } from "@/types/request/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().min(4).max(50).email(),
    password: z.string().min(8).max(50),
    confirm_password: z.string().min(8).max(50),
    role: z.string(),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm_password"],
        message: "Kata sandi tidak cocok",
      });
    }
  });

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "employee",
    },
  });

  const { register, pendingRegister } = useAuthHooks();

  const onSubmit = (data: RegisterParams) => {
    register(data);
  };
  return (
    <div className="p-4 m-4 max-w-xl w-full">
      <h1 className="text-center font-bold text-2xl">Come Join Us!</h1>
      <p className="text-center text-sm mb-8">
        Please provide your account information
      </p>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="rounded"
                    placeholder="Language Center"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
          <Button disabled={pendingRegister} className="w-full rounded">
            Register
          </Button>
        </form>
      </FormProvider>
      <small className="block text-center mt-6">
        Already have an account?{" "}
        <Link to={"/login"} className="text-blue-500 hover:underline">
          Let's authenticate!
        </Link>
      </small>
    </div>
  );
}
