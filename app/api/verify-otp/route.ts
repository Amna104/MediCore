import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const result = await verifyOTP(email, otp);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Invalid or expired OTP",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify-otp API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

