import { NextResponse } from "next/server";
import { setDoctorAvailability } from "@/lib/actions/availability.actions";
import { Doctors } from "@/constants";

export async function POST() {
  try {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
    const results = [];

    // Set availability for each doctor
    for (const doctor of Doctors) {
      for (const day of daysOfWeek) {
        try {
          await setDoctorAvailability({
            doctorName: doctor.name,
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          });
          results.push(`${doctor.name} - ${day}: ✅`);
        } catch (error) {
          results.push(`${doctor.name} - ${day}: ❌ ${error}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Doctor availability initialized",
      results,
    });
  } catch (error) {
    console.error("Error initializing availability:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize availability" },
      { status: 500 }
    );
  }
}

