"use server";

import { ID, InputFile, Query } from "node-appwrite";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    console.log("Creating Appwrite user:", { email: user.email, name: user.name, phone: user.phone });
    
    // Try to create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    console.log("Appwrite user created successfully:", newuser.$id);
    return parseStringify(newuser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    // Check if user already exists (409 conflict)
    if (error && error?.code === 409) {
      console.log("User already exists (409 conflict), searching...");
      
      try {
        // Search with larger limit and proper queries
        const searchQueries = [Query.equal("email", user.email.toLowerCase())];
        
        let foundUser = null;
        
        // Try searching with query first
        try {
          const searchResult = await users.list(searchQueries);
          console.log(`Query search found ${searchResult.total} users`);
          if (searchResult.users.length > 0) {
            foundUser = searchResult.users[0];
          }
        } catch (queryError) {
          console.log("Query search failed, trying manual search:", queryError);
        }
        
        // If query didn't work, try getting all users with higher limit
        if (!foundUser) {
          const allUsers = await users.list([], 500); // Get up to 500 users
          console.log(`Manual search through ${allUsers.total} users (returned ${allUsers.users.length})`);
          
          foundUser = allUsers.users.find(u => {
            const matches = u.email?.toLowerCase() === user.email.toLowerCase();
            if (matches) {
              console.log("Found matching user:", u.$id, u.email);
            }
            return matches;
          });
        }
        
        if (foundUser) {
          console.log("Returning existing user:", foundUser.$id);
          return parseStringify(foundUser);
        }
        
        // If we still can't find the user, the email might be associated with a different identifier
        console.error("User exists (409) but not found in search. Email:", user.email);
        throw new Error(
          "This email is already registered. Please use a different email address."
        );
      } catch (searchError: any) {
        console.error("Error during user search:", searchError);
        
        // If the search error is our custom message, re-throw it
        if (searchError.message?.includes("already registered")) {
          throw searchError;
        }
        
        // Otherwise, give a generic error
        throw new Error(
          "This email may already be in use. Please try a different email."
        );
      }
    }
    
    // For other errors, throw a generic message
    console.error("Unexpected error creating user:", error);
    throw new Error("Failed to create account. Please try again.");
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  userId,
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId, 
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
