import { NextResponse } from "next/server";
import { getPatient } from "@/lib/actions/patient.actions";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const patient = await getPatient(params.userId);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}

