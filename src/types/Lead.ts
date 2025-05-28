export interface Lead {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  email: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  source: string;
  contact_date: string;
}

export interface CreateLeadData {
  email: string;
  message: string;
  status?: "new" | "contacted" | "qualified" | "converted" | "closed";
  source?: string;
  contact_date: string;
}

export interface UpdateLeadData {
  email?: string;
  message?: string;
  status?: "new" | "contacted" | "qualified" | "converted" | "closed";
  source?: string;
  contact_date?: string;
}
