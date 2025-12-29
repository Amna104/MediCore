"use server";

import { ID } from "node-appwrite";

import { databases, DATABASE_ID } from "./appwrite.config";

// OTP Collection ID - you'll need to create this collection in Appwrite
const OTP_COLLECTION_ID = process.env.OTP_COLLECTION_ID;

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
    // Find OTP document for this email
    const response = await databases.listDocuments(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      [
        // Query for matching email and OTP
      ]
    );

    if (response.documents.length === 0) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Appwrite SDK types documents as generic `Document`, so we assert our OTP schema here.
    const otpDoc = response.documents[0] as typeof response.documents[number] & {
      otp?: string;
      expiresAt?: string;
      verified?: boolean;
    };

    // Check if OTP matches
    if (!otpDoc.otp || otpDoc.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    // Check if OTP is expired
    if (!otpDoc.expiresAt || new Date(otpDoc.expiresAt) < new Date()) {
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
      return { success: false, message: "OTP already used" };
    }

    // Mark as verified
    await databases.updateDocument(
      DATABASE_ID!,
      OTP_COLLECTION_ID!,
      otpDoc.$id,
      { verified: true }
    );

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

