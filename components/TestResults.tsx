"use client";

import { motion } from "framer-motion";

interface TestResult {
  $id?: string;
  testName: string;
  testType: string;
  result: string;
  resultDate: Date;
  normalRange?: string;
  notes?: string;
  doctorName: string;
  status: "pending" | "completed" | "abnormal";
}

interface TestResultsProps {
  testResults: TestResult[];
}

export function TestResults({ testResults }: TestResultsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "abnormal":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-dark-500/10 text-dark-700 border-dark-500/20";
    }
  };

  const getTestIcon = (type: string) => {
    const icons: Record<string, string> = {
      blood: "🩸",
      xray: "📷",
      mri: "🧲",
      urine: "🧪",
      ecg: "📈",
      ultrasound: "🔊",
      default: "🔬",
    };
    return icons[type.toLowerCase()] || icons.default;
  };

  if (testResults.length === 0) {
    return (
      <div className="rounded-2xl border border-dark-500 bg-dark-400 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark-500">
            <span className="text-3xl">🔬</span>
          </div>
          <div>
            <h3 className="text-18-bold text-light-200 mb-2">No Test Results</h3>
            <p className="text-14-regular text-dark-700">
              Your test results will appear here when available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {testResults.map((test, index) => (
        <motion.div
          key={test.$id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-2xl border border-dark-500 bg-dark-400 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
                <span className="text-2xl">{getTestIcon(test.testType)}</span>
              </div>
              <div>
                <h3 className="text-18-bold text-light-200">{test.testName}</h3>
                <p className="text-14-regular text-dark-700">
                  {test.testType} Test
                </p>
                <p className="text-12-regular text-dark-700">
                  Dr. {test.doctorName} •{" "}
                  {new Date(test.resultDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div
              className={`status-badge ${getStatusColor(test.status)}`}
            >
              <span className="text-12-semibold capitalize">{test.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-dark-300 rounded-lg p-4">
              <p className="text-12-regular text-dark-700 mb-1">Result</p>
              <p className="text-16-bold text-light-200">{test.result}</p>
            </div>
            {test.normalRange && (
              <div className="bg-dark-300 rounded-lg p-4">
                <p className="text-12-regular text-dark-700 mb-1">Normal Range</p>
                <p className="text-16-bold text-light-200">{test.normalRange}</p>
              </div>
            )}
          </div>

          {test.notes && (
            <div className={`rounded-lg p-3 ${
              test.status === "abnormal"
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-dark-300"
            }`}>
              <p className="text-12-medium text-light-200 mb-1">Notes:</p>
              <p className="text-14-regular text-dark-700">{test.notes}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}


