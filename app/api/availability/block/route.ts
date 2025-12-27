import { NextResponse } from "next/server";
import { blockDoctorSlot } from "@/lib/actions/availability.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorName, date, startTime, endTime, reason } = body;

    if (!doctorName || !date || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const blockedSlot = await blockDoctorSlot({
      doctorName,
      date: new Date(date),
      startTime,
      endTime,
      reason: reason || "Unavailable",
    });

    return NextResponse.json({
      success: true,
      data: blockedSlot,
      message: "Time slot blocked successfully",
    });
  } catch (error) {
    console.error("Error blocking time slot:", error);
    return NextResponse.json(
      { success: false, message: "Failed to block time slot" },
      { status: 500 }
    );
  }
}

