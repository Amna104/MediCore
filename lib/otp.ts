"use server";

import { ID, Query } from "node-appwrite";

import { databases, DATABASE_ID } from "./appwrite.config";

// OTP Collection ID - you'll need to create this collection in Appwrite
const OTP_COLLECTION_ID = process.env.OTP_COLLECTION_ID;

function assertOtpEnv() {
  if (!DATABASE_ID) throw new Error("Missing DATABASE_ID env var (Appwrite).");
  if (!OTP_COLLECTION_ID) throw new Error("Missing OTP_COLLECTION_ID env var (Appwrite).");
}

/**
 * Generate a 6-digit OTP
 * This is a utility function, not exported directly to client
 */
function generateOTPInternal(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate OTP (server action wrapper)
 */
export async function generateOTP(): Promise<string> {
  return generateOTPInternal();
}

/**
 * Store OTP in database (Appwrite)
 * OTP expires after 10 minutes
 */
export async function storeOTP(email: string, otp: string) {
  try {
    assertOtpEnv();

    // Calculate expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete any existing OTPs for this email
    await deleteOTPByEmail(email);

    // Store new OTP
    const otpDocument = await databases.createDocument(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      ID.unique(),
      {
        email: email.toLowerCase(),
        otp,
        expiresAt,
        verified: false,
      }
    );

    return { success: true, data: otpDocument };
  } catch (error) {
    console.error("Error storing OTP:", error);
    return { success: false, error };
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(email: string, otp: string) {
  try {
    assertOtpEnv();

    console.log("Verifying OTP for email:", email.toLowerCase());

    // Find OTP document for this email with proper query
    const response = await databases.listDocuments(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      [
        Query.equal("email", email.toLowerCase()),
        Query.equal("verified", false),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ]
    );

    console.log("Found OTP documents:", response.documents.length);

    if (response.documents.length === 0) {
      console.log("No OTP found for email:", email.toLowerCase());
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Appwrite SDK types documents as generic `Document`, so we assert our OTP schema here.
    const otpDoc = response.documents[0] as typeof response.documents[number] & {
      otp?: string;
      expiresAt?: string;
      verified?: boolean;
      email?: string;
    };

    console.log("OTP Document:", {
      email: otpDoc.email,
      otp: otpDoc.otp ? "***" : "missing",
      expiresAt: otpDoc.expiresAt,
      verified: otpDoc.verified,
    });

    // Check if OTP matches
    if (!otpDoc.otp || otpDoc.otp !== otp) {
      console.log("OTP mismatch. Expected:", otpDoc.otp, "Got:", otp);
      return { success: false, message: "Invalid OTP" };
    }

    // Check if OTP is expired
    if (!otpDoc.expiresAt || new Date(otpDoc.expiresAt) < new Date()) {
      console.log("OTP expired at:", otpDoc.expiresAt);
      // Delete expired OTP
      await databases.deleteDocument(
        DATABASE_ID!,
        OTP_COLLECTION_ID!,
        otpDoc.$id
      );
      return { success: false, message: "OTP has expired" };
    }

    // Check if already verified
    if (otpDoc.verified) {
      console.log("OTP already used");
      return { success: false, message: "OTP already used" };
    }

    // Mark as verified
    await databases.updateDocument(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      otpDoc.$id,
      { verified: true }
    );

    console.log("OTP verified successfully for:", email);
    return { success: true, message: "Email verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Error verifying OTP" };
  }
}

/**
 * Delete OTP by email (cleanup old OTPs)
 */
async function deleteOTPByEmail(email: string) {
  try {
    assertOtpEnv();

    const response = await databases.listDocuments(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      []
    );

    // Delete all OTP documents for this email
    const deletePromises = response.documents
      .filter((doc) => (doc as typeof response.documents[number] & { email?: string }).email === email.toLowerCase())
      .map((doc) =>
        databases.deleteDocument(DATABASE_ID!, OTP_COLLECTION_ID!, doc.$id)
      );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting old OTPs:", error);
  }
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    assertOtpEnv();

    const response = await databases.listDocuments(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      []
    );

    const verifiedOTP = response.documents.find((doc) => {
      const typed = doc as typeof response.documents[number] & {
        email?: string;
        verified?: boolean;
      };
      return typed.email === email.toLowerCase() && typed.verified === true;
    });

    return !!verifiedOTP;
  } catch (error) {
    console.error("Error checking email verification:", error);
    return false;
  }
}

/**
 * Resend OTP (with rate limiting)
 */
export async function resendOTP(email: string) {
  try {
    assertOtpEnv();

    // Check if there's a recent OTP (within last 1 minute)
    const response = await databases.listDocuments(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      []
    );

    const recentOTP = response.documents.find((doc) => {
      const typed = doc as typeof response.documents[number] & { email?: string };
      if (typed.email !== email.toLowerCase()) return false;
      const createdAt = new Date(doc.$createdAt);
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      return createdAt > oneMinuteAgo;
    });

    if (recentOTP) {
      return {
        success: false,
        message: "Please wait 1 minute before requesting a new OTP",
      };
    }

    // Generate and store new OTP
    const newOTP = await generateOTP();
    await storeOTP(email, newOTP);

    return { success: true, otp: newOTP };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { success: false, message: "Error resending OTP" };
  }
}

