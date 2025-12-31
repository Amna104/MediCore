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

    // If TEST_EMAIL is set, use it for both storage and sending
    // This ensures OTP verification works with the email that received the OTP
    const actualEmail = process.env.TEST_EMAIL || email;

    console.log(`Sending OTP to ${actualEmail} (original: ${email})`);

    // Generate OTP
    const otp = await generateOTP();

    // Store OTP with the ACTUAL email that will receive it
    const storeResult = await storeOTP(actualEmail, otp);

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

    // Send OTP email (it will also use TEST_EMAIL internally if set)
    const emailResult = await sendOTPEmail({
      userName: name,
      userEmail: email, // Original email for display in email body
      otp,
    });

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to send OTP email. Check GMAIL_USER / GMAIL_APP_PASSWORD in environment.",
          details: emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error),
        },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        // Return the actual email so frontend knows which email to verify
        email: actualEmail,
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


