import { Client, Databases, Account } from "appwrite";

const client = new Client();

// Configure Appwrite
client
  .setEndpoint(
    import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
  )
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "");

export const databases = new Databases(client);
export const account = new Account(client);

export { client };

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
export const LEADS_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_LEADS_COLLECTION_ID || "";
