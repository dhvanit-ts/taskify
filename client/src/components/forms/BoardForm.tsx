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
import MultipleSelector from "../ui/multiselect";
import useBoardStore from "@/store/boardStore";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  selectedMembers: z.array(z.object({ value: z.string(), label: z.string() })),
});

type Fields = "name" | "select-members" | "manage-member";

function BoardForm({
  initialState,
  boardId,
  children,
  showFields = ["name", "select-members"],
  openForm,
  setOpenForm,
}: {
  initialState?: IBoard;
  boardId?: string;
  showFields?: Fields[];
  children?: React.ReactNode;
  openForm?: boolean;
  setOpenForm?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const addBoard = useBoardStore((s) => s.addBoard);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialState?.name ?? "",
      selectedMembers: initialState?.members
        ? initialState.members.map((member) => ({
            value: member._id,
            label: member.email,
          }))
        : [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const endpoint = initialState ? `update/${initialState._id}` : `create`;

      const members = data.selectedMembers.map((member) => member.value);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${endpoint}`,
        { name: data.name, members, board: boardId },
        {
          withCredentials: true,
        }
      );

      if (response.status !== 201 && response.status !== 200) {
        console.error(`Failed to ${initialState ? "update" : "create"} task`);
        return;
      }

      toast.success(
        `Board ${initialState ? "updated" : "created"} successfully`
      );
      setOpen(false);
      if (setOpenForm) setOpenForm(false);
      if (response.data.data) addBoard(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openForm ?? open} onOpenChange={setOpenForm ?? setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xs text-zinc-500">BOARD</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Add/Update board to match your needs.
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
                        type={showFields?.includes("name") ? "text" : "hidden"}
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
              {showFields?.includes("manage-member") ? (
                <FormField
                  control={form.control}
                  name="selectedMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectMembers
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="selectedMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectMembers
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {form.formState.errors.root && (
              <p>{form.formState.errors.root.message}</p>
            )}
            <Button className="mt-2 space-x-2" type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>{initialState ? "Updating" : "Creating"}</span>
                </>
              ) : (
                <>
                  <span>{initialState ? "Update" : "Create"}</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type Option = {
  value: string;
  label: string;
};

const SelectMembers = ({
  onChange,
  value,
}: {
  onChange: (options: Option[]) => void;
  value: Option[];
}) => {
  const onSearch = async (value: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/search/${value}`,
        {
          withCredentials: true,
        }
      );

      if (res.status !== 200) {
        console.error("Failed to fetch users");
        return [];
      }

      return res.data.data ?? [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return (
    <MultipleSelector
      onChange={onChange}
      commandProps={{
        label: "Add members",
      }}
      className="focus-within:ring-0 focus-within:border-x-0 focus-within:border-t-0 border-b-2 rounded-none focus-visible:border-zinc-900"
      value={value}
      onSearch={onSearch}
      placeholder="Add members"
      emptyIndicator={<p className="text-center text-sm">No results found</p>}
    />
  );
};

export default BoardForm;
