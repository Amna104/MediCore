"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationProps {
  email: string;
  userName: string;
  onVerified: () => void;
  onResend: () => Promise<{ success: boolean; message?: string }>;
}

export function OTPVerification({
  email,
  userName,
  onVerified,
  onResend,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Email verified successfully!");
        console.log("OTP verified, calling onVerified in 1 second...");
        setTimeout(() => {
          console.log("Calling onVerified callback now");
          onVerified();
        }, 1000);
      } else {
        setError(data.message || "Invalid or expired OTP");
        setOtp(""); // Clear OTP on error
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await onResend();
      
      if (result.success) {
        setSuccess("New code sent! Check your email.");
        setOtp("");
        // Start 60 second cooldown
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.message || "Failed to resend code");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen items-center justify-center bg-dark-300">
      {/* Main Content */}
      <section className="remove-scrollbar container">
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[500px]"
          >
            {/* Logo Text Only */}
            <div className="mb-12">
              <h2 className="text-24-bold text-light-200">MediCore</h2>
            </div>

            {/* Main Card */}
            <div className="space-y-8">
              {/* Icon & Title */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    {/* Animated rings */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-blue-500 blur-xl"
                    />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 shadow-lg">
                      <span className="text-5xl">🔐</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="header mb-2">Verify Your Email</h1>
                  <p className="text-dark-700 text-16-regular">
                    We&apos;ve sent a verification code to
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-dark-400 px-4 py-2 border border-dark-500">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-16-semibold text-light-200">{email}</span>
                  </div>
                </motion.div>
              </div>

              {/* OTP Input Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* OTP Input */}
                <div className="flex flex-col items-center space-y-4 bg-dark-400 rounded-2xl p-6 border border-dark-500">
                  <p className="text-14-regular text-dark-700 mb-2">Enter your 6-digit code</p>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => {
                      setOtp(value);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    <InputOTPGroup className="gap-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          className="relative h-14 w-14 text-2xl font-bold rounded-xl border-2 border-dark-500 bg-dark-300 text-light-200 transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          index={index}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 w-full"
                    >
                      <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-14-regular text-red-500">{error}</p>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 w-full"
                    >
                      <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-14-regular text-green-500">{success}</p>
                    </motion.div>
                  )}
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerify}
                  disabled={otp.length !== 6 || isVerifying}
                  className="shad-primary-btn w-full h-12 text-16-semibold"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Verify Email</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </Button>

                {/* Resend Section */}
                <div className="flex items-center justify-between rounded-xl bg-dark-400 border border-dark-500 p-4">
                  <div>
                    <p className="text-14-medium text-light-200">Didn&apos;t receive the code?</p>
                    <p className="text-12-regular text-dark-700">Check your spam folder</p>
                  </div>
                  <Button
                    onClick={handleResend}
                    disabled={isResending || resendCooldown > 0}
                    variant="outline"
                    className="shad-gray-btn"
                    size="sm"
                  >
                    {isResending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark-700 border-t-transparent" />
                        Sending...
                      </div>
                    ) : resendCooldown > 0 ? (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {resendCooldown}s
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Resend
                      </div>
                    )}
                  </Button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-dark-400 border border-dark-500 p-3 text-center">
                    <div className="text-2xl mb-1">⏱️</div>
                    <p className="text-12-regular text-dark-700">10 min expiry</p>
                  </div>
                  <div className="rounded-lg bg-dark-400 border border-dark-500 p-3 text-center">
                    <div className="text-2xl mb-1">🔒</div>
                    <p className="text-12-regular text-dark-700">Secure</p>
                  </div>
                  <div className="rounded-lg bg-dark-400 border border-dark-500 p-3 text-center">
                    <div className="text-2xl mb-1">📧</div>
                    <p className="text-12-regular text-dark-700">Email sent</p>
                  </div>
                </div>

                {/* Change Email */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="text-14-regular text-dark-700 hover:text-green-500 transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Wrong email? Go back
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Copyright */}
            <p className="copyright py-12 text-center">
              © 2025 MediCore. All rights reserved.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

