import { NextResponse } from "next/server";

/**
 * Debug endpoint to check which environment variables are configured
 * This helps diagnose Vercel deployment issues
 */
export async function GET() {
  const envStatus = {
    // Appwrite
    NEXT_PUBLIC_ENDPOINT: !!process.env.NEXT_PUBLIC_ENDPOINT,
    PROJECT_ID: !!process.env.PROJECT_ID,
    API_KEY: !!process.env.API_KEY,
    DATABASE_ID: !!process.env.DATABASE_ID,
    OTP_COLLECTION_ID: !!process.env.OTP_COLLECTION_ID,
    PATIENT_COLLECTION_ID: !!process.env.PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID: !!process.env.DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID: !!process.env.APPOINTMENT_COLLECTION_ID,

    // Resend (Email)
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: !!process.env.RESEND_FROM_EMAIL,

    // Sentry (optional)
    SENTRY_AUTH_TOKEN: !!process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: !!process.env.SENTRY_ORG,
    SENTRY_PROJECT: !!process.env.SENTRY_PROJECT,

    // Other
    NEXT_PUBLIC_ADMIN_PASSKEY: !!process.env.NEXT_PUBLIC_ADMIN_PASSKEY,
  };

  const missing = Object.entries(envStatus)
    .filter(([_, isSet]) => !isSet)
    .map(([key]) => key);

  const configured = Object.entries(envStatus)
    .filter(([_, isSet]) => isSet)
    .map(([key]) => key);

  return NextResponse.json({
    status: missing.length === 0 ? "all_configured" : "missing_some",
    configured,
    missing,
    totalChecked: Object.keys(envStatus).length,
    environment: process.env.VERCEL_ENV || "development",
  });
}

