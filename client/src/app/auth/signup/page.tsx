"use client";

import axios, { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { handleGoogleOAuthRedirect } from "@/utils/googleOAuthRedirect";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/helping/PasswordInput";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Label from "@/components/helping/Label";

export type SignupDataType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

function SigninPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupDataType>();

  const onSubmit: SubmitHandler<SignupDataType> = async (
    data: SignupDataType
  ) => {
    try {
      setLoading(true);
      if (data.password !== data.confirmPassword) {
        toast.error("Password and Confirm Password should be the same");
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/initialize`,
        data,
        {
          withCredentials: true,
        }
      );
      if (res.status !== 200) {
        toast.error(res.data.message ?? "Error initializing sign up");
      }
      router.push(`/auth/verify-otp/${data.email}`);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.error ?? "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-zinc-900 border-zinc-800 border rounded-md text-zinc-100 w-96">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h3 className="text-3xl py-2">Sign Up</h3>
        <Label label="Username" htmlFor="username" />
        <Input
          className="border-zinc-800 bg-zinc-800"
          id="username"
          type="username"
          disabled={loading}
          {...register("username")}
          placeholder="Enter your Username"
        />
        <Label label="Email" htmlFor="email" />
        <Input
          className="border-zinc-800 bg-zinc-800"
          id="email"
          type="email"
          disabled={loading}
          {...register("email")}
          placeholder="Enter your Email"
        />
        <Label label="Password" htmlFor="password" />
        <PasswordInput
          id="password"
          disabled={loading}
          placeholder="Enter Password"
          {...register("password")}
        />
        <Label label="Confirm Password" htmlFor="confirmPassword" />
        <PasswordInput
          id="confirmPassword"
          disabled={loading}
          placeholder="Confirm Password"
          {...register("confirmPassword")}
        />
        <button
          disabled={loading}
          className="px-4 py-2 mt-3 space-x-1.5 flex justify-center items-center bg-zinc-200 text-zinc-900 font-semibold w-full rounded-md hover:bg-zinc-300 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Signing Up</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>
        {errors.root?.message && (
          <span className="text-sm text-red-500">{errors.root.message}</span>
        )}
      </form>
      <div className="flex justify-center items-center my-3 text-xs">
        <Separator className="shrink bg-zinc-500" />
        <span className="px-4 text-zinc-500 dark:text-zinc-500 text-xs">
          Or
        </span>
        <Separator className="shrink bg-zinc-500" />
      </div>
      <form onSubmit={handleGoogleOAuthRedirect}>
        <button
          disabled={loading}
          className="px-4 py-2 flex justify-center items-center space-x-2.5 bg-zinc-200 text-zinc-900 font-semibold w-full rounded-md hover:bg-zinc-300 cursor-pointer disabled:opacity-60"
        >
          <FaGoogle />
          <span>Signup with Google</span>
        </button>
      </form>
      <p className={cn("text-center text-sm pt-3", loading && "opacity-50")}>
        Already have an account?{" "}
        <Link className="text-blue-500 hover:underline" href="/auth/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SigninPage;
