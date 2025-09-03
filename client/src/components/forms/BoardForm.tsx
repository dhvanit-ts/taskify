"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import axios from "axios";
import { IBoard } from "@/types/IBoard";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

function BoardForm({
  initialState,
  boardId,
  children,
}: {
  initialState?: IBoard;
  boardId: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialState,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const endpoint = initialState ? `update/${initialState._id}` : `create`;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${endpoint}`,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
                name="name"
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
    </Dialog>
  );
}

export default BoardForm;
