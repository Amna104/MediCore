"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TimeSlotPickerProps {
  doctorName: string;
  selectedDate: Date;
  onSelectTime: (time: string) => void;
  selectedTime?: string;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export function TimeSlotPicker({
  doctorName,
  selectedDate,
  onSelectTime,
  selectedTime,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (doctorName && selectedDate) {
      fetchTimeSlots();
    }
  }, [doctorName, selectedDate]);

  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/availability/${encodeURIComponent(doctorName)}/slots?date=${selectedDate.toISOString()}`
      );
      const data = await response.json();

      if (data.success) {
        setSlots(data.slots || []);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupSlotsByPeriod = () => {
    const morning = slots.filter((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      return hour < 12;
    });

    const afternoon = slots.filter((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      return hour >= 12 && hour < 17;
    });

    const evening = slots.filter((slot) => {
      const hour = parseInt(slot.time.split(":")[0]);
      return hour >= 17;
    });

    return { morning, afternoon, evening };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          <p className="text-14-regular text-dark-700">Loading available times...</p>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-dark-500 bg-dark-400 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-500">
            <svg
              className="h-6 w-6 text-dark-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-16-semibold text-light-200 mb-1">
              No slots available
            </h3>
            <p className="text-14-regular text-dark-700">
              Dr. {doctorName} is not available on this date. Please select another date.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { morning, afternoon, evening } = groupSlotsByPeriod();

  const SlotGrid = ({ slots: periodSlots, title }: { slots: TimeSlot[]; title: string }) => {
    if (periodSlots.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-16-semibold text-light-200 mb-3">{title}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {periodSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isDisabled = !slot.isAvailable;

            return (
              <motion.button
                key={slot.time}
                whileHover={isDisabled ? {} : { scale: 1.05 }}
                whileTap={isDisabled ? {} : { scale: 0.95 }}
                onClick={() => !isDisabled && onSelectTime(slot.time)}
                disabled={isDisabled}
                className={`
                  relative rounded-lg px-3 py-2 text-14-medium transition-all
                  ${
                    isSelected
                      ? "bg-green-500 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-dark-300"
                      : isDisabled
                      ? "bg-dark-500 text-dark-600 cursor-not-allowed"
                      : "bg-dark-400 text-light-200 hover:bg-dark-500 border border-dark-500 hover:border-green-500"
                  }
                `}
              >
                {formatTime(slot.time)}
                {slot.isBooked && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-dark-300" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-18-bold text-light-200">Available Time Slots</h3>
        <div className="flex items-center gap-2 text-12-regular text-dark-700">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-dark-500" />
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dark-500 bg-dark-400 p-6">
        <SlotGrid slots={morning} title="🌅 Morning (Before 12 PM)" />
        <SlotGrid slots={afternoon} title="☀️ Afternoon (12 PM - 5 PM)" />
        <SlotGrid slots={evening} title="🌙 Evening (After 5 PM)" />
      </div>

      {selectedTime && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3"
        >
          <svg
            className="h-5 w-5 text-green-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-14-regular text-green-500">
            Selected time: <span className="font-semibold">{formatTime(selectedTime)}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}


