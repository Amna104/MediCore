import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = await generateOTP();

    // Store OTP in database
    const storeResult = await storeOTP(email, otp);

    if (!storeResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to store OTP" },
        { status: 500 }
      );
    }

    // Send OTP email
    const emailResult = await sendOTPEmail({
      userName: name,
      userEmail: email,
      otp,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

