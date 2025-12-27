import { NextRequest, NextResponse } from "next/server";
import { resendOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();

    if (!email || !userName) {
      return NextResponse.json(
        { success: false, message: "Email and user name are required" },
        { status: 400 }
      );
    }

    const result = await resendOTP(email);

    if (result.success && result.otp) {
      // Send OTP email
      await sendOTPEmail({
        userName,
        userEmail: email,
        otp: result.otp,
      });

      return NextResponse.json({
        success: true,
        message: "New OTP sent successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to resend OTP",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in resend-otp API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

