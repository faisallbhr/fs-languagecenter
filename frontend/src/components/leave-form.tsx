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
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nama"
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
              <FormLabel>Tanggal Mulai</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="rounded"
                  placeholder="Tanggal mulai"
                  {...field}
                />
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
              <FormLabel>Tanggal Selesai</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="rounded"
                  placeholder="Tanggal selesai"
                  {...field}
                />
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
              <FormLabel>Alasan</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="rounded"
                  placeholder="Alasan cuti"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full rounded" type="submit" disabled={isPending}>
          Kirim Pengajuan
        </Button>
      </form>
    </Form>
  );
};

export default LeaveForm;
