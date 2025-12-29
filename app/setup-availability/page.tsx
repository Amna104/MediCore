"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function SetupAvailabilityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const setupAvailability = async () => {
    setIsLoading(true);
    setResults(["⏳ Initializing doctor availability..."]);

    try {
      const response = await fetch("/api/setup/availability", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setResults([
          "✅ Success! Doctor availability has been set up.",
          "",
          "Details:",
          ...data.results,
          "",
          "✨ You can now:",
          "1. Go to /admin/availability to see calendars",
          "2. Book appointments with real-time time slots",
          "3. Block specific time slots as needed",
        ]);
        setIsComplete(true);
      } else {
        setResults([`❌ Error: ${data.message}`]);
      }
    } catch (error: any) {
      setResults([`❌ Error: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-dark-300 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-dark-200 rounded-2xl border border-dark-500 p-8">
          <h1 className="text-32-bold text-light-200 mb-6">
            🗓️ Setup Doctor Availability
          </h1>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
            <p className="text-16-semibold text-light-200 mb-3">
              What this does:
            </p>
            <p className="text-14-regular text-dark-700 mb-3">
              Sets up default working hours for all doctors:
            </p>
            <ul className="list-disc list-inside text-14-regular text-dark-700 space-y-1 mb-3">
              <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
              <li>All 9 doctors in your system</li>
            </ul>
            <p className="text-14-semibold text-blue-400">
              ⚠️ Run this ONCE to initialize availability.
            </p>
          </div>

          <Button
            onClick={setupAvailability}
            disabled={isLoading || isComplete}
            className="shad-primary-btn w-full mb-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Setting up...
              </div>
            ) : isComplete ? (
              "✅ Setup Complete"
            ) : (
              "Initialize Doctor Availability"
            )}
          </Button>

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-dark-400 rounded-xl p-6 border border-dark-500 max-h-96 overflow-y-auto"
            >
              {results.map((line, index) => (
                <p
                  key={index}
                  className={`text-14-regular mb-1 ${
                    line.includes("✅")
                      ? "text-green-500 font-semibold"
                      : line.includes("❌")
                      ? "text-red-500 font-semibold"
                      : line.includes("⏳")
                      ? "text-blue-500"
                      : line.includes("✨")
                      ? "text-green-400 font-semibold"
                      : "text-light-200"
                  }`}
                >
                  {line}
                </p>
              ))}
            </motion.div>
          )}

          {isComplete && (
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => (window.location.href = "/admin/availability")}
                className="shad-primary-btn flex-1"
              >
                View Calendar
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="shad-gray-btn flex-1"
              >
                Go Home
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


