"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function OtpVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [otp, setOtp] = useState("");

  const { email } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const sendOtp = useCallback(async () => {
    try {
      if (!email) return;
      const decodedEmail = decodeURIComponent(email.toString());
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/otp/send`,
        {
          email: decodedEmail,
        }
      );

      if (res.status !== 200) {
        toast.error("Failed to send a new OTP");
        return;
      }

      toast.success("A new otp has been sent to your account!");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }, [email]);

  const verifyOTP = async () => {
    try {
      if (!email) {
        toast.error("Email is required");
        return;
      }
      const decodedEmail = decodeURIComponent(email.toString());
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/otp/verify`,
        {
          email: decodedEmail,
          otp,
        }
      );

      if (res.status !== 200) {
        toast.error("Invalid OTP, try again");
        return;
      }

      toast.success("OTP verified");
      router.push(`/auth/setup/${decodedEmail}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setAttempts((a) => a++);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      verifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResendOTP = () => {
    setTimeLeft(60);
    sendOtp();
  };

  useEffect(() => {
    sendOtp();
  }, [email, sendOtp]);

  return (
    <div className="p-4 border-zinc-800 border rounded-md text-zinc-100 space-y-4 w-96">
      <h3 className="text-3xl text-center py-2">Verify email</h3>
      <p className="text-sm text-center text-zinc-300">
        Enter the 6-digit code we emailed to{" "}
        <b>
          {email ? decodeURIComponent(email.toString()) : "example@email.com"}
        </b>
        . If you did not receive it, you can request a new one{" "}
        {timeLeft > 0 ? (
          <span>
            in <b>{timeLeft}</b> seconds
          </span>
        ) : (
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={handleResendOTP}
          >
            Resend OTP
          </span>
        )}
        .
      </p>
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator className="text-zinc-600" />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <button
        disabled={otp.length < 6 || loading}
        onClick={verifyOTP}
        className="px-4 py-2 bg-zinc-200 text-zinc-900 font-semibold w-full rounded-md hover:bg-zinc-300 cursor-pointer disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
      {attempts > 4 && (
        <p className="text-zinc-500">
          Max attempts reached, Try after some minutes.
        </p>
      )}
      <p className="text-sm text-center text-zinc-300">
        Want to login?{" "}
        <Link className="text-blue-500 hover:underline" href="/auth/signin">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default OtpVerificationPage;
