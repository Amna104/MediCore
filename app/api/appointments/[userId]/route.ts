import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { databases, DATABASE_ID, APPOINTMENT_COLLECTION_ID } from "@/lib/appwrite.config";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Fetch all appointments for this user
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("userId", params.userId), Query.orderDesc("schedule")]
    );

    return NextResponse.json(appointments.documents);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}


