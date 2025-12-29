import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { databases, DATABASE_ID, PATIENT_COLLECTION_ID } from "@/lib/appwrite.config";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Find patient by email
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("email", email)]
    );

    if (patients.documents.length === 0) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    const patient = patients.documents[0];

    return NextResponse.json({
      success: true,
      userId: patient.userId,
      patient: patient,
    });
  } catch (error) {
    console.error("Error finding patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to find patient" },
      { status: 500 }
    );
  }
}


