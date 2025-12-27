import { NextResponse } from "next/server";
import { setDoctorAvailability } from "@/lib/actions/availability.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorName, dayOfWeek, startTime, endTime, isAvailable } = body;

    if (!doctorName || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const availability = await setDoctorAvailability({
      doctorName,
      dayOfWeek: dayOfWeek as DayOfWeek,
      startTime,
      endTime,
      isAvailable: isAvailable ?? true,
    });

    return NextResponse.json({
      success: true,
      data: availability,
      message: "Availability set successfully",
    });
  } catch (error) {
    console.error("Error setting availability:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set availability" },
      { status: 500 }
    );
  }
}

