"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DoctorCalendarProps {
  doctorName: string;
  onSelectSlot?: (date: Date) => void;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: {
    type: "appointment" | "blocked" | "available";
    status?: string;
  };
}

export function DoctorCalendar({ doctorName, onSelectSlot }: DoctorCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(Date.now());

  useEffect(() => {
    fetchDoctorSchedule();
  }, [doctorName, lastFetch]);

  const fetchDoctorSchedule = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/availability/${doctorName}/schedule`);
      const data = await response.json();

      if (data.success) {
        const formattedEvents: CalendarEvent[] = [];

        // Add booked appointments
        data.appointments?.forEach((apt: any) => {
          const start = new Date(apt.schedule);
          const end = new Date(start.getTime() + 30 * 60000); // 30 minutes

          formattedEvents.push({
            title: `Appointment - ${apt.status}`,
            start,
            end,
            resource: {
              type: "appointment",
              status: apt.status,
            },
          });
        });

        // Add blocked slots
        data.blockedSlots?.forEach((blocked: any) => {
          const start = new Date(blocked.date);
          const [startHour, startMin] = blocked.startTime.split(":");
          start.setHours(parseInt(startHour), parseInt(startMin));

          const end = new Date(blocked.date);
          const [endHour, endMin] = blocked.endTime.split(":");
          end.setHours(parseInt(endHour), parseInt(endMin));

          formattedEvents.push({
            title: `Blocked - ${blocked.reason || "Unavailable"}`,
            start,
            end,
            resource: {
              type: "blocked",
            },
          });
        });

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching doctor schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#24AE7C"; // Green for available
    let color = "#FFFFFF";

    if (event.resource.type === "appointment") {
      if (event.resource.status === "scheduled") {
        backgroundColor = "#24AE7C"; // Green
      } else if (event.resource.status === "pending") {
        backgroundColor = "#3B82F6"; // Blue
      } else if (event.resource.status === "cancelled") {
        backgroundColor = "#EF4444"; // Red
      }
    } else if (event.resource.type === "blocked") {
      backgroundColor = "#6B7280"; // Gray
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: "8px",
        border: "none",
        display: "block",
        fontSize: "12px",
        padding: "4px 8px",
      },
    };
  };

  const handleSelectSlot = ({ start }: { start: Date; end: Date }) => {
    if (onSelectSlot) {
      onSelectSlot(start);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-light-200">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-300 rounded-2xl p-6 border border-dark-500"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-24-bold text-light-200">
            Dr. {doctorName}'s Schedule
          </h2>
          <button
            onClick={() => setLastFetch(Date.now())}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 hover:bg-dark-500 border border-dark-500 hover:border-green-500 transition-colors text-14-medium text-light-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
        <div className="flex flex-wrap gap-4 text-14-regular">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-dark-700">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-dark-700">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-500" />
            <span className="text-dark-700">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-dark-700">Cancelled</span>
          </div>
        </div>
      </div>

      <div className="doctor-calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectSlot={handleSelectSlot}
          selectable
          views={["month", "week", "day"]}
          defaultView="week"
        />
      </div>
    </motion.div>
  );
}

