export type VolunteerGender = "L" | "P" | "Laki-laki" | "Perempuan";
export type VolunteerStatus = "ACTIVE" | "INACTIVE" | "TRAINING" | "SUSPENDED";

export interface VolunteerItem {
  id: string;
  district_id: string;
  name: string;
  gender: VolunteerGender | string;
  age: number | null;
  address: string | null;
  phone: string | null;
  phone_normalized?: string | null;
  status: VolunteerStatus | string;
  created_at: string;
  created_by?: string | null;
  district_name?: string;
}

export type CreateVolunteerState = {
  error?: string | null;
  fieldErrors?: {
    name?: string;
    gender?: string;
    age?: string;
    address?: string;
    phone?: string;
  };
  success?: boolean;
  message?: string | null;
};

export interface ImportVolunteerInputRow {
  name: string;
  gender: "Laki-laki" | "Perempuan";
  age: number | null;
  address: string;
  phone: string;
  phone_normalized: string;
}

export interface ImportVolunteerResult {
  success: boolean;
  error?: string | null;
  imported_count?: number;
  message?: string | null;
}
