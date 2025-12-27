"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { OTPVerification } from "@/components/OTPVerification";
import { createUser } from "@/lib/actions/patient.actions";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const phone = searchParams.get("phone");

  useEffect(() => {
    // Redirect if no email provided
    if (!email || !name || !phone) {
      router.push("/patient");
      return;
    }
    setIsLoading(false);
  }, [email, name, phone, router]);

  const handleVerified = async () => {
    if (!email || !name || !phone) return;

    try {
      const user = {
        name,
        email,
        phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!email || !name) {
      return { success: false, message: "Missing user information" };
    }

    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userName: name,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error resending OTP:", error);
      return { success: false, message: "Failed to resend code" };
    }
  };

  if (isLoading || !email || !name) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-light-200">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <OTPVerification
      email={email}
      userName={name}
      onVerified={handleVerified}
      onResend={handleResend}
    />
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            <p className="text-light-200">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

