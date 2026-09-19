export interface MockAdminProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface MockDistrict {
  id: string;
  name: string;
  code: string;
  type: "KABUPATEN" | "KOTA";
  created_at: string;
  adminProfile: MockAdminProfile | null;
  volunteerCount: number;
}

export const MOCK_DISTRICTS: MockDistrict[] = [
  {
    id: "d1010000-0000-0000-0000-000000000001",
    name: "Badung",
    code: "BALI-BDG",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: {
      id: "p1010000-0000-0000-0000-000000000001",
      full_name: "I Made Agus Suardana, S.Kom.",
      email: "badung@mdmc.or.id",
      phone: "081234567890",
      is_active: true,
    },
    volunteerCount: 42,
  },
  {
    id: "d1010000-0000-0000-0000-000000000002",
    name: "Bangli",
    code: "BALI-BGL",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: null,
    volunteerCount: 18,
  },
  {
    id: "d1010000-0000-0000-0000-000000000003",
    name: "Buleleng",
    code: "BALI-BLL",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: {
      id: "p1010000-0000-0000-0000-000000000003",
      full_name: "Ketut Artawa, S.Pd.",
      email: "buleleng@mdmc.or.id",
      phone: "081987654321",
      is_active: true,
    },
    volunteerCount: 56,
  },
  {
    id: "d1010000-0000-0000-0000-000000000004",
    name: "Denpasar",
    code: "BALI-DPS",
    type: "KOTA",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: {
      id: "p1010000-0000-0000-0000-000000000004",
      full_name: "I Gede Putu Dharma, S.T.",
      email: "denpasar@mdmc.or.id",
      phone: "081333444555",
      is_active: true,
    },
    volunteerCount: 88,
  },
  {
    id: "d1010000-0000-0000-0000-000000000005",
    name: "Gianyar",
    code: "BALI-GNY",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: {
      id: "p1010000-0000-0000-0000-000000000005",
      full_name: "Wayan Sukarsa, M.Kes.",
      email: "gianyar@mdmc.or.id",
      phone: "081555666777",
      is_active: true,
    },
    volunteerCount: 35,
  },
  {
    id: "d1010000-0000-0000-0000-000000000006",
    name: "Jembrana",
    code: "BALI-JBR",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: null,
    volunteerCount: 20,
  },
  {
    id: "d1010000-0000-0000-0000-000000000007",
    name: "Karangasem",
    code: "BALI-KRA",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: {
      id: "p1010000-0000-0000-0000-000000000007",
      full_name: "I Nyoman Kariasa, S.E.",
      email: "karangasem@mdmc.or.id",
      phone: "081777888999",
      is_active: true,
    },
    volunteerCount: 64,
  },
  {
    id: "d1010000-0000-0000-0000-000000000008",
    name: "Klungkung",
    code: "BALI-KLK",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: null,
    volunteerCount: 15,
  },
  {
    id: "d1010000-0000-0000-0000-000000000009",
    name: "Tabanan",
    code: "BALI-TBN",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: {
      id: "p1010000-0000-0000-0000-000000000009",
      full_name: "I Komang Widiarta, S.Sos.",
      email: "tabanan@mdmc.or.id",
      phone: "081888999000",
      is_active: true,
    },
    volunteerCount: 30,
  },
];
