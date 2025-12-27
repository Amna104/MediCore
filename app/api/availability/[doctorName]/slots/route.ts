import { NextResponse } from "next/server";
import { getAvailableTimeSlots } from "@/lib/actions/availability.actions";

export async function GET(
  request: Request,
  { params }: { params: { doctorName: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { success: false, message: "Date parameter is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    const slots = await getAvailableTimeSlots(params.doctorName, date);

    return NextResponse.json({
      success: true,
      slots,
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch time slots" },
      { status: 500 }
    );
  }
}

