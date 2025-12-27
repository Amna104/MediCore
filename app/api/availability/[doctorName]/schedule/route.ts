import { NextResponse } from "next/server";
import {
  databases,
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  DOCTOR_BLOCKED_SLOTS_COLLECTION_ID,
} from "@/lib/appwrite.config";
import { Query } from "node-appwrite";

export async function GET(
  request: Request,
  { params }: { params: { doctorName: string } }
) {
  try {
    // Get appointments for the next 30 days
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);

    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.equal("primaryPhysician", params.doctorName),
        Query.greaterThanEqual("schedule", today.toISOString()),
        Query.lessThanEqual("schedule", futureDate.toISOString()),
      ]
    );

    // Get blocked slots
    const blockedSlots = await databases.listDocuments(
      DATABASE_ID!,
      DOCTOR_BLOCKED_SLOTS_COLLECTION_ID!,
      [
        Query.equal("doctorName", params.doctorName),
        Query.greaterThanEqual("date", today.toISOString()),
        Query.lessThanEqual("date", futureDate.toISOString()),
      ]
    );

    return NextResponse.json({
      success: true,
      appointments: appointments.documents,
      blockedSlots: blockedSlots.documents,
    });
  } catch (error) {
    console.error("Error fetching doctor schedule:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch doctor schedule" },
      { status: 500 }
    );
  }
}

