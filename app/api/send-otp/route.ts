import { NextRequest, NextResponse } from "next/server";

import { sendOTPEmail } from "@/lib/email-gmail";
import { generateOTP, storeOTP } from "@/lib/otp";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate OTP
    const otp = await generateOTP();

    // Store OTP in database
    const storeResult = await storeOTP(email, otp);

    if (!storeResult.success) {
      console.error("Failed to store OTP:", storeResult.error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to store OTP. Check Appwrite env vars and OTP_COLLECTION_ID in Vercel.",
          details: storeResult.error instanceof Error ? storeResult.error.message : String(storeResult.error),
        },
        { status: 500, headers: corsHeaders }
      );
    }

    // Send OTP email
    const emailResult = await sendOTPEmail({
      userName: name,
      userEmail: email,
      otp,
    });

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to send OTP email. Check RESEND_API_KEY / RESEND_FROM_EMAIL in Vercel.",
          details: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error),
        },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


