import { NextRequest, NextResponse } from "next/server";

import { sendOTPEmail } from "@/lib/email";
import { generateOTP, storeOTP } from "@/lib/otp";

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
        {
          success: false,
          message:
            "Failed to store OTP. Check Appwrite env vars and OTP_COLLECTION_ID in Vercel.",
        },
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
        {
          success: false,
          message:
            "Failed to send OTP email. Check RESEND_API_KEY / RESEND_FROM_EMAIL in Vercel.",
        },
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
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}


