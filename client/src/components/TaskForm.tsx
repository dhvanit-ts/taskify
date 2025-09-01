"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { TbProgress, TbProgressBolt, TbProgressCheck } from "react-icons/tb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FaExclamationCircle } from "react-icons/fa";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import axios from "axios";
import { ITask } from "@/types/ITask";
import { useParams } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .min(2, "Task must be at least 2 characters")
    .max(50, "Task must be at most 50 characters"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(100, "Description must be at most 100 characters")
    .optional(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["to-do", "in-progress", "done"]),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
});

function TaskForm({
  setOpen,
  initialState,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialState?: ITask;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { boardId } = useParams<{ boardId: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialState,
      priority: initialState?.priority ?? "low",
      status: initialState?.status ?? "to-do",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const endpoint = initialState ? `update/${initialState._id}` : `create`;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${endpoint}`,
        { ...data, board: boardId },
        {
          withCredentials: true,
        }
      );

      if (response.status !== 201 && response.status !== 200) {
        console.error(`Failed to ${initialState ? "update" : "create"} task`);
        return;
      }

      toast.success(
        `Task ${initialState ? "updated" : "created"} successfully`
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xs text-zinc-500">TASK</DialogTitle>
        <VisuallyHidden>
          <DialogDescription>
            Add/Update task to match your needs.
          </DialogDescription>
        </VisuallyHidden>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      placeholder="Title"
                      className={
                        "py-1 outline-0 border-b-2 focus:border-zinc-700"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      placeholder="Description"
                      className="text-xs py-1 outline-0 border-b-2 focus:border-zinc-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-2 grid grid-cols-2">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? "low"}
                  >
                    <FormControl className="">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { value: "high", color: "text-red-500" },
                        { value: "medium", color: "text-yellow-500" },
                        { value: "low", color: "text-green-500" },
                      ].map((priority) => (
                        <SelectItem
                          className={`rounded-none focus:!${priority.color}`}
                          key={priority.value}
                          value={priority.value}
                        >
                          <FaExclamationCircle
                            className={`mr-0.5 text-xl ${priority.color}`}
                          />
                          <span>{priority.value}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? "to-do"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { value: "to-do", icon: <TbProgress /> },
                        { value: "in-progress", icon: <TbProgressBolt /> },
                        { value: "done", icon: <TbProgressCheck /> },
                      ].map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.icon}
                          <span>{status.value}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Assigned to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">
                        m@example.com
                      </SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Add due date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.root && (
            <p>{form.formState.errors.root.message}</p>
          )}
          <Button className="mt-2 space-x-2" type="submit">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}

export default TaskForm;
