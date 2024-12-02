"use server"
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

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


export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )

  } catch (error: any) {
    if (error && error.code === 409) { // 409 Conflict Error
      const existingUser = await users.list([
        Query.equal('email', [user.email])
      ]);
      return existingUser.users[0];
    }
    throw error; // Re-throw other unexpected errors
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        Query.equal('userId', userId)
      ]

    );
    return parseStringify(patients.documents[0]);
  } catch (error) {
  }
}

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {

  try {
    let file;

    if(identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string,

      )
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);

    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      }
    )
    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }


}
