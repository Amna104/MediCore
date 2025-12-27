"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PatientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call API to find user by email
      const response = await fetch("/api/patient/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success && data.userId) {
        router.push(`/patients/${data.userId}/dashboard`);
      } else {
        setError("No account found with this email. Please register first.");
      }
    } catch (error) {
      console.error("Error finding patient:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/">
              <Image
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="CarePulse"
                className="mb-12 h-10 w-fit"
              />
            </Link>

            <div className="space-y-8">
              {/* Icon */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500">
                    <span className="text-4xl">👤</span>
                  </div>
                </div>
                <h1 className="header">Access Your Dashboard</h1>
                <p className="text-dark-700">
                  Enter your email to view your appointments and health information
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-14-medium text-dark-700 mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="shad-input"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
                  >
                    <svg
                      className="h-5 w-5 text-red-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-14-regular text-red-500">{error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={!email || isLoading}
                  className="shad-primary-btn w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Accessing...
                    </div>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-dark-500" />
                <span className="text-14-regular text-dark-700">or</span>
                <div className="h-px flex-1 bg-dark-500" />
              </div>

              {/* Register Link */}
              <div className="text-center space-y-4">
                <p className="text-14-regular text-dark-700">
                  Don't have an account yet?
                </p>
                <Button
                  variant="outline"
                  className="shad-gray-btn w-full"
                  asChild
                >
                  <Link href="/patient">Register Now</Link>
                </Button>
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-dark-500 bg-dark-400 p-4">
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="space-y-2">
                    <p className="text-14-medium text-light-200">Quick Access</p>
                    <p className="text-12-regular text-dark-700">
                      Simply enter the email you used during registration to access
                      your dashboard and manage your appointments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
          </motion.div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="Patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}

