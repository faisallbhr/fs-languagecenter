import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LeaveParams } from "@/types/request/leave";

interface LeaveFormProps {
  userId: string;
  userName: string;
  onSubmit: (data: LeaveParams) => void;
  isPending: boolean;
}

const formSchema = z.object({
  id: z.string(),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  reason: z.string().min(1, "Alasan wajib diisi"),
});

const LeaveForm = ({
  userId,
  userName,
  onSubmit,
  isPending,
}: LeaveFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: userId,
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="id"
          render={() => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
                  disabled
                  value={userName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" className="rounded" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" className="rounded" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="rounded"
                  placeholder="Leave reason"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full rounded" type="submit" disabled={isPending}>
          Send Request
        </Button>
      </form>
    </Form>
  );
};

export default LeaveForm;
