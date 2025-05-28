import { ID, Query } from "appwrite";
import { databases, DATABASE_ID, LEADS_COLLECTION_ID } from "../lib/appwrite";
import type { Lead, CreateLeadData, UpdateLeadData } from "../types/Lead";

export class LeadService {
  /**
   * Create a new lead
   */
  static async create(data: CreateLeadData): Promise<Lead> {
    try {
      const lead = await databases.createDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        ID.unique(),
        {
          email: data.email,
          message: data.message,
          status: data.status || "new",
          source: data.source || "website",
          contact_date: data.contact_date,
        }
      );
      return lead as unknown as Lead;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  }

  /**
   * Get all leads with optional sorting
   */
  static async list(orderBy?: string): Promise<Lead[]> {
    try {
      const queries = [];

      if (orderBy) {
        // Convert Base44 ordering format to Appwrite format
        if (orderBy.startsWith("-")) {
          const field = orderBy.substring(1);
          queries.push(
            Query.orderDesc(field === "created_date" ? "$createdAt" : field)
          );
        } else {
          queries.push(
            Query.orderAsc(orderBy === "created_date" ? "$createdAt" : orderBy)
          );
        }
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        queries
      );

      return response.documents as unknown as Lead[];
    } catch (error) {
      console.error("Error listing leads:", error);
      throw error;
    }
  }

  /**
   * Get a lead by ID
   */
  static async get(id: string): Promise<Lead> {
    try {
      const lead = await databases.getDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        id
      );
      return lead as unknown as Lead;
    } catch (error) {
      console.error("Error getting lead:", error);
      throw error;
    }
  }

  /**
   * Update a lead
   */
  static async update(id: string, data: UpdateLeadData): Promise<Lead> {
    try {
      const lead = await databases.updateDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        id,
        data
      );
      return lead as unknown as Lead;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  }

  /**
   * Delete a lead
   */
  static async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, LEADS_COLLECTION_ID, id);
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  }
}
