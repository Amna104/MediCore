"use server";

import { ID, Query } from "node-appwrite";

import {
  databases,
  DATABASE_ID,
  DOCTOR_AVAILABILITY_COLLECTION_ID,
  DOCTOR_BLOCKED_SLOTS_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// ============================================
// DOCTOR AVAILABILITY MANAGEMENT
// ============================================

/**
 * Get doctor's weekly availability schedule
 */
export const getDoctorAvailability = async (doctorName: string) => {
  try {
    const availability = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_AVAILABILITY_COLLECTION_ID!,
      [Query.equal("doctorName", doctorName), Query.orderAsc("dayOfWeek")]
    );

    return parseStringify(availability.documents);
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return [];
  }
};

/**
 * Set doctor's availability for a specific day
 */
export const setDoctorAvailability = async (
  availabilityData: DoctorAvailability
) => {
  try {
    // Check if availability already exists for this doctor and day
    const existing = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_AVAILABILITY_COLLECTION_ID!,
      [
        Query.equal("doctorName", availabilityData.doctorName),
        Query.equal("dayOfWeek", availabilityData.dayOfWeek),
      ]
    );

    if (existing.documents.length > 0) {
      // Update existing
      const updated = await databases.updateDocument(
        DATABASE_ID!,
        DOCTOR_AVAILABILITY_COLLECTION_ID!,
        existing.documents[0].$id,
        {
          startTime: availabilityData.startTime,
          endTime: availabilityData.endTime,
          isAvailable: availabilityData.isAvailable,
        }
      );
      return parseStringify(updated);
    } else {
      // Create new
      const newAvailability = await databases.createDocument(
        DATABASE_ID!,
        DOCTOR_AVAILABILITY_COLLECTION_ID!,
        ID.unique(),
        availabilityData
      );
      return parseStringify(newAvailability);
    }
  } catch (error) {
    console.error("Error setting doctor availability:", error);
    throw error;
  }
};

/**
 * Block a specific time slot for a doctor
 */
export const blockDoctorSlot = async (blockData: DoctorBlockedSlot) => {
  try {
    const blockedSlot = await databases.createDocument(
      DATABASE_ID!,
      DOCTOR_BLOCKED_SLOTS_COLLECTION_ID!,
      ID.unique(),
      {
        ...blockData,
        date: new Date(blockData.date).toISOString(),
      }
    );

    return parseStringify(blockedSlot);
  } catch (error) {
    console.error("Error blocking doctor slot:", error);
    throw error;
  }
};

/**
 * Get blocked slots for a doctor on a specific date
 */
export const getBlockedSlots = async (doctorName: string, date: Date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const blockedSlots = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_BLOCKED_SLOTS_COLLECTION_ID!,
      [
        Query.equal("doctorName", doctorName),
        Query.greaterThanEqual("date", startOfDay.toISOString()),
        Query.lessThanEqual("date", endOfDay.toISOString()),
      ]
    );

    return parseStringify(blockedSlots.documents);
  } catch (error) {
    console.error("Error fetching blocked slots:", error);
    return [];
  }
};

/**
 * Remove a blocked slot
 */
export const unblockDoctorSlot = async (slotId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID!,
      DOCTOR_BLOCKED_SLOTS_COLLECTION_ID!,
      slotId
    );
    return { success: true };
  } catch (error) {
    console.error("Error unblocking doctor slot:", error);
    throw error;
  }
};

/**
 * Get available time slots for a doctor on a specific date
 */
export const getAvailableTimeSlots = async (
  doctorName: string,
  date: Date
): Promise<TimeSlot[]> => {
  try {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }) as DayOfWeek;

    // Get doctor's availability for this day
    const availability = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_AVAILABILITY_COLLECTION_ID!,
      [
        Query.equal("doctorName", doctorName),
        Query.equal("dayOfWeek", dayOfWeek),
      ]
    );

    if (availability.documents.length === 0 || !availability.documents[0].isAvailable) {
      return [];
    }

    const schedule = availability.documents[0];
    const startTime = schedule.startTime; // "09:00"
    const endTime = schedule.endTime; // "17:00"

    // Generate 30-minute time slots
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      const timeString = `${String(currentHour).padStart(2, "0")}:${String(
        currentMinute
      ).padStart(2, "0")}`;

      slots.push({
        time: timeString,
        isAvailable: true,
        isBooked: false,
      });

      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }

    // Get blocked slots for this date
    const blockedSlots = await getBlockedSlots(doctorName, date);

    // Get booked appointments for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("primaryPhysician", doctorName),
        Query.greaterThanEqual("schedule", startOfDay.toISOString()),
        Query.lessThanEqual("schedule", endOfDay.toISOString()),
        Query.notEqual("status", "cancelled"),
      ]
    );

    // Mark slots as unavailable or booked
    slots.forEach((slot) => {
      // Check if slot is blocked
      const isBlocked = blockedSlots.some((blocked: any) => {
        return slot.time >= blocked.startTime && slot.time < blocked.endTime;
      });

      // Check if slot is booked
      const isBooked = appointments.documents.some((apt: any) => {
        const aptTime = new Date(apt.schedule);
        const aptTimeString = `${String(aptTime.getHours()).padStart(
          2,
          "0"
        )}:${String(aptTime.getMinutes()).padStart(2, "0")}`;
        return aptTimeString === slot.time;
      });

      if (isBlocked) {
        slot.isAvailable = false;
      }
      if (isBooked) {
        slot.isBooked = true;
        slot.isAvailable = false;
      }
    });

    return slots;
  } catch (error) {
    console.error("Error getting available time slots:", error);
    return [];
  }
};

/**
 * Check if a doctor is available at a specific date and time
 */
export const isDoctorAvailable = async (
  doctorName: string,
  dateTime: Date
): Promise<boolean> => {
  try {
    const slots = await getAvailableTimeSlots(doctorName, dateTime);
    const timeString = `${String(dateTime.getHours()).padStart(2, "0")}:${String(
      dateTime.getMinutes()
    ).padStart(2, "0")}`;

    const slot = slots.find((s) => s.time === timeString);
    return slot ? slot.isAvailable : false;
  } catch (error) {
    console.error("Error checking doctor availability:", error);
    return false;
  }
};


