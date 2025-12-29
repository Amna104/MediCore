"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DoctorCalendar } from "@/components/DoctorCalendar";
import { Doctors } from "@/constants";

export default function DoctorAvailabilityPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(Doctors[0].name);
  const [showBlockSlotModal, setShowBlockSlotModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [blockSlotData, setBlockSlotData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  const handleBlockSlot = async () => {
    try {
      const response = await fetch("/api/availability/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...blockSlotData,
          doctorName: selectedDoctor,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Time slot blocked successfully!");
        setShowBlockSlotModal(false);
        setBlockSlotData({ date: "", startTime: "", endTime: "", reason: "" });
        // Refresh calendar
        setRefreshKey(prev => prev + 1);
      } else {
        alert(data.message || "Failed to block slot");
      }
    } catch (error) {
      console.error("Error blocking slot:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="flex h-screen max-h-screen">
      <div className="flex flex-col flex-1 overflow-y-auto remove-scrollbar">
        {/* Header */}
        <header className="admin-header">
          <Link href="/" className="cursor-pointer group">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-green-300 group-hover:via-green-400 group-hover:to-emerald-400">
                Medi
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:via-blue-400 group-hover:to-cyan-400">
                Core
              </span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-16-semibold text-light-200">
              ← Back to Admin
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="admin-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="header mb-2">Doctor Availability Calendar</h1>
            <p className="text-dark-700">
              View and manage doctor schedules, appointments, and blocked time slots
            </p>
          </motion.div>

          {/* Doctor Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-18-bold text-light-200">Select Doctor</h2>
              <Button
                onClick={() => setShowBlockSlotModal(true)}
                className="shad-primary-btn"
              >
                Block Time Slot
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Doctors.map((doctor) => (
                <button
                  key={doctor.name}
                  onClick={() => setSelectedDoctor(doctor.name)}
                  className={`
                    flex flex-col items-center gap-2 rounded-xl p-4 transition-all
                    ${
                      selectedDoctor === doctor.name
                        ? "bg-green-500/20 border-2 border-green-500"
                        : "bg-dark-400 border-2 border-dark-500 hover:border-green-500"
                    }
                  `}
                >
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="text-center">
                    <p className="text-14-semibold text-light-200">{doctor.name}</p>
                    <p className="text-12-regular text-dark-700">{doctor.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            key={`${selectedDoctor}-${refreshKey}`}
          >
            <DoctorCalendar doctorName={selectedDoctor} />
          </motion.div>
        </main>
      </div>

      {/* Block Slot Modal */}
      {showBlockSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-300 rounded-2xl p-6 max-w-md w-full mx-4 border border-dark-500"
          >
            <h2 className="text-24-bold text-light-200 mb-4">Block Time Slot</h2>
            <p className="text-14-regular text-dark-700 mb-6">
              Block a specific time slot for Dr. {selectedDoctor}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-14-medium text-light-200 mb-2 block">
                  Date
                </label>
                <input
                  type="date"
                  value={blockSlotData.date}
                  onChange={(e) =>
                    setBlockSlotData({ ...blockSlotData, date: e.target.value })
                  }
                  className="shad-input"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-14-medium text-light-200 mb-2 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={blockSlotData.startTime}
                    onChange={(e) =>
                      setBlockSlotData({ ...blockSlotData, startTime: e.target.value })
                    }
                    className="shad-input"
                  />
                </div>

                <div>
                  <label className="text-14-medium text-light-200 mb-2 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={blockSlotData.endTime}
                    onChange={(e) =>
                      setBlockSlotData({ ...blockSlotData, endTime: e.target.value })
                    }
                    className="shad-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-14-medium text-light-200 mb-2 block">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={blockSlotData.reason}
                  onChange={(e) =>
                    setBlockSlotData({ ...blockSlotData, reason: e.target.value })
                  }
                  placeholder="e.g., Personal leave, Conference"
                  className="shad-input"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBlockSlot}
                disabled={
                  !blockSlotData.date ||
                  !blockSlotData.startTime ||
                  !blockSlotData.endTime
                }
                className="shad-primary-btn flex-1"
              >
                Block Slot
              </Button>
              <Button
                onClick={() => {
                  setShowBlockSlotModal(false);
                  setBlockSlotData({ date: "", startTime: "", endTime: "", reason: "" });
                }}
                variant="outline"
                className="shad-gray-btn flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

