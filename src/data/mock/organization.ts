export interface MockAdminProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  district_id?: string | null;
  district_name?: string;
  created_at?: string;
}

export interface MockDistrictItem {
  id: string;
  name: string;
  code: string;
  type: "KABUPATEN" | "KOTA";
  created_at: string;
  adminProfile: MockAdminProfile | null;
  volunteerCount: number;
  status: "ACTIVE" | "BELUM DIKELOLA";
}

export const adminMockData: MockAdminProfile[] = [
  {
    id: "p1010000-0000-0000-0000-000000000001",
    full_name: "I Made Agus Suardana, S.Kom.",
    email: "badung@mdmc.or.id",
    phone: "081234567890",
    is_active: true,
    district_id: "d1010000-0000-0000-0000-000000000001",
    district_name: "Badung",
    created_at: "2026-01-15T08:30:00Z",
  },
  {
    id: "p1010000-0000-0000-0000-000000000003",
    full_name: "Ketut Artawa, S.Pd.",
    email: "buleleng@mdmc.or.id",
    phone: "081987654321",
    is_active: true,
    district_id: "d1010000-0000-0000-0000-000000000003",
    district_name: "Buleleng",
    created_at: "2026-01-20T10:00:00Z",
  },
  {
    id: "p1010000-0000-0000-0000-000000000004",
    full_name: "I Gede Putu Dharma, S.T.",
    email: "denpasar@mdmc.or.id",
    phone: "081333444555",
    is_active: true,
    district_id: "d1010000-0000-0000-0000-000000000004",
    district_name: "Denpasar",
    created_at: "2026-01-18T09:15:00Z",
  },
  {
    id: "p1010000-0000-0000-0000-000000000005",
    full_name: "Wayan Sukarsa, M.Kes.",
    email: "gianyar@mdmc.or.id",
    phone: "081555666777",
    is_active: true,
    district_id: "d1010000-0000-0000-0000-000000000005",
    district_name: "Gianyar",
    created_at: "2026-01-22T11:45:00Z",
  },
  {
    id: "p1010000-0000-0000-0000-000000000007",
    full_name: "I Nyoman Kariasa, S.E.",
    email: "karangasem@mdmc.or.id",
    phone: "081777888999",
    is_active: true,
    district_id: "d1010000-0000-0000-0000-000000000007",
    district_name: "Karangasem",
    created_at: "2026-02-01T14:20:00Z",
  },
  {
    id: "p1010000-0000-0000-0000-000000000009",
    full_name: "I Komang Widiarta, S.Sos.",
    email: "tabanan@mdmc.or.id",
    phone: "081888999000",
    is_active: false,
    district_id: "d1010000-0000-0000-0000-000000000009",
    district_name: "Tabanan",
    created_at: "2026-02-10T16:00:00Z",
  },
];

export const districtMockData: MockDistrictItem[] = [
  {
    id: "d1010000-0000-0000-0000-000000000001",
    name: "Badung",
    code: "BALI-BDG",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: adminMockData[0],
    volunteerCount: 42,
    status: "ACTIVE",
  },
  {
    id: "d1010000-0000-0000-0000-000000000002",
    name: "Bangli",
    code: "BALI-BGL",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: null,
    volunteerCount: 18,
    status: "BELUM DIKELOLA",
  },
  {
    id: "d1010000-0000-0000-0000-000000000003",
    name: "Buleleng",
    code: "BALI-BLL",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: adminMockData[1],
    volunteerCount: 56,
    status: "ACTIVE",
  },
  {
    id: "d1010000-0000-0000-0000-000000000004",
    name: "Denpasar",
    code: "BALI-DPS",
    type: "KOTA",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: adminMockData[2],
    volunteerCount: 88,
    status: "ACTIVE",
  },
  {
    id: "d1010000-0000-0000-0000-000000000005",
    name: "Gianyar",
    code: "BALI-GNY",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: adminMockData[3],
    volunteerCount: 35,
    status: "ACTIVE",
  },
  {
    id: "d1010000-0000-0000-0000-000000000006",
    name: "Jembrana",
    code: "BALI-JBR",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: null,
    volunteerCount: 20,
    status: "BELUM DIKELOLA",
  },
  {
    id: "d1010000-0000-0000-0000-000000000007",
    name: "Karangasem",
    code: "BALI-KRA",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: adminMockData[4],
    volunteerCount: 64,
    status: "ACTIVE",
  },
  {
    id: "d1010000-0000-0000-0000-000000000008",
    name: "Klungkung",
    code: "BALI-KLK",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: null,
    volunteerCount: 15,
    status: "BELUM DIKELOLA",
  },
  {
    id: "d1010000-0000-0000-0000-000000000009",
    name: "Tabanan",
    code: "BALI-TBN",
    type: "KABUPATEN",
    created_at: "2026-01-15T00:00:00Z",
    adminProfile: adminMockData[5],
    volunteerCount: 30,
    status: "ACTIVE",
  },
];
