"use client";

import { motion } from "framer-motion";

interface Prescription {
  $id?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  prescribedDate: Date;
  doctorName: string;
  status: "active" | "completed" | "discontinued";
}

interface PrescriptionListProps {
  prescriptions: Prescription[];
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "discontinued":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-dark-500/10 text-dark-700 border-dark-500/20";
    }
  };

  if (prescriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dark-500 bg-dark-400 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark-500">
            <span className="text-3xl">💊</span>
          </div>
          <div>
            <h3 className="text-18-bold text-light-200 mb-2">No Prescriptions</h3>
            <p className="text-14-regular text-dark-700">
              Your prescriptions will appear here when prescribed by doctors
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription, index) => (
        <motion.div
          key={prescription.$id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-2xl border border-dark-500 bg-dark-400 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                <span className="text-2xl">💊</span>
              </div>
              <div>
                <h3 className="text-18-bold text-light-200">{prescription.medicationName}</h3>
                <p className="text-14-regular text-dark-700">
                  Prescribed by Dr. {prescription.doctorName}
                </p>
                <p className="text-12-regular text-dark-700">
                  {new Date(prescription.prescribedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div
              className={`status-badge ${getStatusColor(prescription.status)}`}
            >
              <span className="text-12-semibold capitalize">{prescription.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-dark-300 rounded-lg p-3">
              <p className="text-12-regular text-dark-700 mb-1">Dosage</p>
              <p className="text-14-semibold text-light-200">{prescription.dosage}</p>
            </div>
            <div className="bg-dark-300 rounded-lg p-3">
              <p className="text-12-regular text-dark-700 mb-1">Frequency</p>
              <p className="text-14-semibold text-light-200">{prescription.frequency}</p>
            </div>
            <div className="bg-dark-300 rounded-lg p-3">
              <p className="text-12-regular text-dark-700 mb-1">Duration</p>
              <p className="text-14-semibold text-light-200">{prescription.duration}</p>
            </div>
            <div className="bg-dark-300 rounded-lg p-3">
              <p className="text-12-regular text-dark-700 mb-1">Status</p>
              <p className="text-14-semibold text-light-200 capitalize">{prescription.status}</p>
            </div>
          </div>

          {prescription.instructions && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-12-medium text-blue-400 mb-1">Instructions:</p>
              <p className="text-14-regular text-light-200">{prescription.instructions}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}


