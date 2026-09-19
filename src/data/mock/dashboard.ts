export interface StatItem {
  title: string;
  value: string | number;
  iconName: "Map" | "Users" | "UserRound" | "ShieldCheck" | "UserPlus" | "DatabaseCheck" | "Building2";
  subtitle: string;
  trend?: string;
  trendDirection?: "up" | "down";
  badge?: string;
}

export interface DistrictDistribution {
  district: string;
  count: number;
}

export interface GenderRatio {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export interface AgeDistribution {
  range: string;
  percentage: number;
  count: number;
  color: string;
}

export interface DistrictStatusItem {
  id: string;
  district: string;
  admin: string;
  relawan: number;
  status: "Aktif" | "Belum Aktif" | "Siaga";
  districtCode: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: "admin" | "volunteer" | "update" | "alert";
  description: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  href?: string;
  actionKey?: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface RecentVolunteerItem {
  id: string;
  name: string;
  gender: "Laki-laki" | "Perempuan";
  age: number;
  status: "Aktif" | "Inaktif" | "Siaga";
  role: string;
  phone: string;
}

export interface DistrictInfoItem {
  kabupaten: string;
  code: string;
  administrator: string;
  email: string;
  phone: string;
  status: "Aktif" | "Belum Aktif";
}

export interface WilayahDashboardData {
  header: {
    title: string;
    subtitle: string;
    badge: string;
    status: string;
  };
  summary: StatItem[];
  volunteerStats: {
    distribution: DistrictDistribution[];
    gender: GenderRatio[];
  };
  districtStatuses: DistrictStatusItem[];
  recentActivities: ActivityItem[];
  quickActions: QuickActionItem[];
}

export interface DaerahDashboardData {
  header: {
    title: string;
    subtitle: string;
    badge: string;
    status: string;
  };
  summary: StatItem[];
  volunteerStats: {
    gender: GenderRatio[];
    age: AgeDistribution[];
  };
  recentVolunteers: RecentVolunteerItem[];
  quickActions: QuickActionItem[];
  districtInfo: DistrictInfoItem;
}

export const wilayahDashboardData: WilayahDashboardData = {
  header: {
    title: "Dashboard MDMC Bali",
    subtitle: "Monitoring kesiapsiagaan relawan dan aktivitas daerah",
    badge: "Wilayah Bali",
    status: "ACTIVE",
  },
  summary: [
    {
      title: "Total Kabupaten/Kota",
      value: 9,
      iconName: "Map",
      subtitle: "8 Kabupaten, 1 Kota (Denpasar)",
      trend: "100% Terdaftar",
      trendDirection: "up",
    },
    {
      title: "Administrator Daerah",
      value: "6 Admin",
      iconName: "Users",
      subtitle: "Pengurus daerah aktif bertugas",
      badge: "6/9 Terisi",
    },
    {
      title: "Total Relawan",
      value: "2.500",
      iconName: "UserRound",
      subtitle: "Relawan terdaftar di Bali",
      trend: "+120 bulan ini",
      trendDirection: "up",
    },
    {
      title: "Relawan Aktif",
      value: "2.350",
      iconName: "ShieldCheck",
      subtitle: "Siaga tanggap darurat posko",
      trend: "94% Aktif",
      trendDirection: "up",
    },
  ],
  volunteerStats: {
    distribution: [
      { district: "Badung", count: 450 },
      { district: "Bangli", count: 220 },
      { district: "Buleleng", count: 380 },
      { district: "Denpasar", count: 500 },
      { district: "Gianyar", count: 300 },
      { district: "Jembrana", count: 150 },
      { district: "Karangasem", count: 200 },
      { district: "Klungkung", count: 120 },
      { district: "Tabanan", count: 250 },
    ],
    gender: [
      { name: "Laki-laki", percentage: 70, count: 1750, color: "#124E8C" },
      { name: "Perempuan", percentage: 30, count: 750, color: "#0EA5E9" },
    ],
  },
  districtStatuses: [
    {
      id: "d1010000-0000-0000-0000-000000000001",
      district: "Badung",
      districtCode: "BALI-BDG",
      admin: "I Made Agus Suardana",
      relawan: 450,
      status: "Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000002",
      district: "Bangli",
      districtCode: "BALI-BGL",
      admin: "-",
      relawan: 220,
      status: "Belum Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000003",
      district: "Buleleng",
      districtCode: "BALI-BLL",
      admin: "Ketut Artawa",
      relawan: 380,
      status: "Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000004",
      district: "Denpasar",
      districtCode: "BALI-DPS",
      admin: "I Gede Putu Dharma",
      relawan: 500,
      status: "Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000005",
      district: "Gianyar",
      districtCode: "BALI-GNY",
      admin: "Wayan Sukarsa",
      relawan: 300,
      status: "Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000006",
      district: "Jembrana",
      districtCode: "BALI-JBR",
      admin: "-",
      relawan: 150,
      status: "Belum Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000007",
      district: "Karangasem",
      districtCode: "BALI-KRA",
      admin: "I Nyoman Kariasa",
      relawan: 200,
      status: "Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000008",
      district: "Klungkung",
      districtCode: "BALI-KLK",
      admin: "-",
      relawan: 120,
      status: "Belum Aktif",
    },
    {
      id: "d1010000-0000-0000-0000-000000000009",
      district: "Tabanan",
      districtCode: "BALI-TBN",
      admin: "I Komang Widiarta",
      relawan: 250,
      status: "Aktif",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      title: "Admin Badung dibuat",
      timestamp: "2 hari lalu",
      type: "admin",
      description: "Penugasan akun Admin Daerah Badung atas nama I Made Agus Suardana.",
    },
    {
      id: "act-2",
      title: "50 relawan baru ditambahkan",
      timestamp: "5 hari lalu",
      type: "volunteer",
      description: "Pendaftaran & verifikasi anggota KSR MDMC Kota Denpasar.",
    },
    {
      id: "act-3",
      title: "Update data relawan Denpasar",
      timestamp: "1 minggu lalu",
      type: "update",
      description: "Pembaruan nomor kontak dan keahlian tim medis Denpasar.",
    },
  ],
  quickActions: [
    {
      id: "qa-1",
      title: "Kelola Kabupaten/Kota",
      description: "Lihat dan atur 9 wilayah kerja daerah MDMC Bali",
      buttonText: "Lihat Semua",
      href: "/admin/wilayah/districts",
    },
    {
      id: "qa-2",
      title: "Kelola Admin Daerah",
      description: "Atur penugasan dan status keaktifan administrator daerah",
      buttonText: "Kelola Admin",
      href: "/admin/wilayah/districts?filter=admin",
    },
    {
      id: "qa-3",
      title: "Data Relawan",
      description: "Pantau database relawan kesiapsiagaan se-Provinsi Bali",
      buttonText: "Lihat Data",
      href: "/admin/wilayah/volunteers",
    },
  ],
};

export const daerahDashboardData: DaerahDashboardData = {
  header: {
    title: "MDMC Kabupaten Badung",
    subtitle: "Manajemen relawan kesiapsiagaan daerah",
    badge: "Kabupaten Badung",
    status: "ACTIVE",
  },
  summary: [
    {
      title: "Total Relawan",
      value: 500,
      iconName: "Users",
      subtitle: "Terdaftar di Kabupaten Badung",
      trend: "+25 Bulan Ini",
      trendDirection: "up",
    },
    {
      title: "Relawan Aktif",
      value: 470,
      iconName: "ShieldCheck",
      subtitle: "Siaga tanggap posko lokal",
      trend: "94% Ready",
      trendDirection: "up",
    },
    {
      title: "Relawan Baru Bulan Ini",
      value: 25,
      iconName: "UserPlus",
      subtitle: "Registrasi bulan berjalan",
      badge: "Bulan Ini",
    },
    {
      title: "Status Data",
      value: "Lengkap",
      iconName: "DatabaseCheck",
      subtitle: "Terverifikasi oleh Admin Daerah",
      badge: "Verified",
    },
  ],
  volunteerStats: {
    gender: [
      { name: "Laki-laki", percentage: 70, count: 350, color: "#124E8C" },
      { name: "Perempuan", percentage: 30, count: 150, color: "#0EA5E9" },
    ],
    age: [
      { range: "18-25", percentage: 25, count: 125, color: "#0EA5E9" },
      { range: "26-40", percentage: 55, count: 275, color: "#124E8C" },
      { range: "40+", percentage: 20, count: 100, color: "#0B1F3A" },
    ],
  },
  recentVolunteers: [
    {
      id: "rv-1",
      name: "Ahmad Fauzi",
      gender: "Laki-laki",
      age: 34,
      status: "Aktif",
      role: "Tim Evakuasi / SAR",
      phone: "081234567890",
    },
    {
      id: "rv-2",
      name: "Siti Rahma",
      gender: "Perempuan",
      age: 28,
      status: "Aktif",
      role: "Tim Medis & Pertolongan Pertama",
      phone: "081398765432",
    },
    {
      id: "rv-3",
      name: "I Wayan Gede",
      gender: "Laki-laki",
      age: 25,
      status: "Aktif",
      role: "Logistik Posko",
      phone: "081555666777",
    },
    {
      id: "rv-4",
      name: "Ni Made Astuti",
      gender: "Perempuan",
      age: 31,
      status: "Aktif",
      role: "Layanan Psikososial",
      phone: "081777888999",
    },
  ],
  quickActions: [
    {
      id: "dqa-1",
      title: "Tambah Relawan Baru",
      description: "Daftarkan relawan kesiapsiagaan baru di daerah Badung",
      buttonText: "Tambah Data",
      actionKey: "add_volunteer",
      variant: "primary",
    },
    {
      id: "dqa-2",
      title: "Lihat Semua Relawan",
      description: "Kelola daftar lengkap anggota relawan Badung",
      buttonText: "Lihat Data",
      href: "/admin/daerah/volunteers",
      variant: "secondary",
    },
    {
      id: "dqa-3",
      title: "Export Data",
      description: "Unduh ringkasan data relawan daerah Badung",
      buttonText: "Export Data",
      actionKey: "export_data",
      variant: "outline",
    },
  ],
  districtInfo: {
    kabupaten: "Badung",
    code: "BALI-BDG",
    administrator: "I Made Agus Suardana",
    email: "admin.badung@mdmc.id",
    phone: "081234567890",
    status: "Aktif",
  },
};
