"use client";

import { motion } from "framer-motion";

interface MedicalTimelineProps {
  entries: Array<{
    date: Date;
    type: "appointment" | "prescription" | "test" | "diagnosis";
    title: string;
    description: string;
    doctorName?: string;
  }>;
}

export function MedicalTimeline({ entries }: MedicalTimelineProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return "📅";
      case "prescription":
        return "💊";
      case "test":
        return "🔬";
      case "diagnosis":
        return "🏥";
      default:
        return "📋";
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "border-green-500 bg-green-500/10";
      case "prescription":
        return "border-blue-500 bg-blue-500/10";
      case "test":
        return "border-purple-500 bg-purple-500/10";
      case "diagnosis":
        return "border-orange-500 bg-orange-500/10";
      default:
        return "border-dark-500 bg-dark-400";
    }
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dark-500 bg-dark-400 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark-500">
            <span className="text-3xl">📋</span>
          </div>
          <div>
            <h3 className="text-18-bold text-light-200 mb-2">No Medical History Yet</h3>
            <p className="text-14-regular text-dark-700">
              Your medical history will appear here as you visit doctors
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-dark-500" />

      <div className="space-y-6">
        {sortedEntries.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            {/* Timeline dot */}
            <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 ${getColor(entry.type)}`}>
              <span className="text-2xl">{getIcon(entry.type)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 rounded-xl border border-dark-500 bg-dark-400 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-16-semibold text-light-200">{entry.title}</h3>
                  <p className="text-12-regular text-dark-700">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {entry.doctorName && (
                  <span className="text-12-medium text-green-500">
                    Dr. {entry.doctorName}
                  </span>
                )}
              </div>
              <p className="text-14-regular text-dark-700">{entry.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

