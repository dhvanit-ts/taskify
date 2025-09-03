"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/helping/PasswordInput";
import { Loader2 } from "lucide-react";
import Label from "@/components/helping/Label";

type SigninDataType = {
  username: string;
  password: string;
};

function SigninPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninDataType>();

  const onSubmit: SubmitHandler<SigninDataType> = async (
    data: SigninDataType
  ) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
        data,
        {
          withCredentials: true,
        }
      );
      if (res.status !== 200) {
        toast.error(res.data.message ?? "Error loging in");
      }
      router.push("/admin");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 flex justify-center items-center">
      <div className="p-4 bg-zinc-900 border-zinc-800 border rounded-md text-zinc-100 w-96">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <h3 className="text-3xl py-2">Admin Sign In</h3>
          <Label label="Username" htmlFor="username" />
          <Input
            className="border-zinc-800 bg-zinc-800"
            id="username"
            type="text"
            disabled={loading}
            {...register("username")}
            placeholder="Enter your Username"
          />
          <Label label="Password" htmlFor="password" />
          <PasswordInput id="password" placeholder="Enter your Password" disabled={loading} {...register("password")} />
          <button
            disabled={loading}
            className="px-4 py-2 space-x-1.5 flex justify-center items-center bg-zinc-200 text-zinc-900 font-semibold w-full rounded-md hover:bg-zinc-300 cursor-pointer disabled:opacity-60"
          >
            {loading ? <>
            <Loader2 className="animate-spin" />
            <span>Signing In</span>
            </> : "Sign In"}
          </button>
          {errors.root?.message && (
            <span className="text-sm text-red-500">{errors.root.message}</span>
          )}
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
