import { LeadService } from "../services/leadService";
import type {
  CreateLeadData,
  UpdateLeadData,
  Lead as LeadType,
} from "../types/Lead";

export class Lead {
  static async create(data: CreateLeadData): Promise<LeadType> {
    return LeadService.create(data);
  }

  static async list(orderBy?: string): Promise<LeadType[]> {
    return LeadService.list(orderBy);
  }

  static async get(id: string): Promise<LeadType> {
    return LeadService.get(id);
  }

  static async update(id: string, data: UpdateLeadData): Promise<LeadType> {
    return LeadService.update(id, data);
  }

  static async delete(id: string): Promise<void> {
    return LeadService.delete(id);
  }
}
