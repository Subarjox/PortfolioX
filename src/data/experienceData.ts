export interface ExperienceAsset {
  title: string;
  image: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  shortName: string;
  tagline: string;
  period: string;
  location: string;
  type: string;
  role: string;
  predicate: string;
  recipient: string;
  summary: string;
  responsibilities: string[];
  impact: string[];
  techStack: string[];
  certificatePdf: string;
  screenshots: ExperienceAsset[];
  teamPhotos?: ExperienceAsset[];
  accentColor: string;
}

export const WINNICODE_EXPERIENCE: ExperienceItem = {
  id: "winnicode",
  company: "PT Winnicode Garuda Teknologi",
  shortName: "Winnicode",
  tagline: "Fullstack Engineer · Remote (Bandung) · Feb – Jul 2025",
  period: "Feb – Jul 2025",
  location: "Bandung (Remote)",
  type: "Magang Mandiri · Kampus Merdeka",
  role: "Fullstack Engineer Intern",
  predicate: "Sangat Baik Sekali (A)",
  recipient: "Muhamad Fahreza Andina Rizki",
  summary:
    "Membangun Content Management System (CMS) portal berita lengkap dengan dasbor analitik terintegrasi untuk pemangku kepentingan internal dan jurnalis, serta mengembangkan sistem pelacakan interaksi pembaca real-time.",
  responsibilities: [
    "Membangun Content Management System (CMS) portal berita lengkap dengan dasbor analitik terintegrasi untuk jurnalis dan manajemen.",
    "Mengembangkan sistem pelacakan metrik keterlibatan pembaca secara real-time, mengagregasi jumlah tayangan, like, dan dislike artikel sebagai dasar strategi konten.",
    "Mengembangkan antarmuka penulisan berita responsif dengan performa tinggi dan integrasi REST API yang optimal."
  ],
  impact: [
    "Menuntaskan seluruh target proyek penugasan tepat waktu dengan predikat Sangat Baik Sekali (A).",
    "Meningkatkan efisiensi publikasi jurnalis dan kecepatan visualisasi analitik artikel berita."
  ],
  techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Git"],
  certificatePdf: "/docs/experience/winnicode_certificate.pdf",
  accentColor: "#2563eb",
  screenshots: [
    {
      title: "CMS Kelola Berita",
      image: "/images/experience/winnicode/20.png",
      description: "Tabel dan dashboard manajemen artikel berita untuk jurnalis"
    },
    {
      title: "Dasbor Analitik Pembaca",
      image: "/images/experience/winnicode/21.png",
      description: "Visualisasi metrik views, like/dislike ratio, dan interaksi pembaca"
    },
    {
      title: "Editor & Penulisan Berita",
      image: "/images/experience/winnicode/22.png",
      description: "Antarmuka pembuatan konten berita interaktif"
    },
    {
      title: "Review & Pengaturan Berita",
      image: "/images/experience/winnicode/23.png",
      description: "Pengelolaan kategori berita dan status publikasi"
    },
    {
      title: "Portal Jurnalisme",
      image: "/images/experience/winnicode/24.png",
      description: "Portal berita Winnicode Garuda"
    }
  ]
};

export const IROSTECH_EXPERIENCE: ExperienceItem = {
  id: "irostech",
  company: "PT Irostech Solusi Inteligen",
  shortName: "Irostech",
  tagline: "Backend Engineer · Bandung (Hybrid) · Aug 2025 – Feb 2026",
  period: "Aug 2025 – Feb 2026",
  location: "Bandung (Hybrid)",
  type: "Magang Industri",
  role: "Backend Engineer Intern",
  predicate: "Sangat Baik",
  recipient: "Muhamad Fahreza Andina Rizki",
  summary:
    "Mengembangkan platform pemantauan program Makan Bergizi Gratis (MBG) terpusat bersama BRIN, dengan integrasi Model LLM untuk analisis nutrisi otomatis dari foto dan webhook Discord real-time guna mendeteksi anomali keamanan pangan.",
  responsibilities: [
    "Mengembangkan platform pemantauan program Makan Bergizi Gratis (MBG) terpusat bersama BRIN, dengan hub data scalable untuk SPPG, sekolah daerah, dan admin Badan Gizi Nasional.",
    "Mengintegrasikan model LLM untuk analisis kandungan gizi otomatis dari foto makanan sekolah secara real-time.",
    "Merancang sistem pencatatan insiden berlatensi rendah dengan webhook Discord real-time untuk memicu peringatan anomali keamanan pangan cepat.",
    "Berkolaborasi aktif bersama tim engineering di kantor dalam standup harian, code review, dan sprint review sistem."
  ],
  impact: [
    "Mencegah insiden keracunan pangan sejak dini lewat otomasi webhook notifikasi anomali secara real-time.",
    "Mempercepat validasi nutrisi ratusan menu makanan sekolah secara otomatis dengan model AI."
  ],
  techStack: ["Python", "FastAPI", "LLM Integration", "Discord Webhook", "PostgreSQL", "Docker", "Git"],
  certificatePdf: "/docs/experience/irostech_transcript.pdf",
  accentColor: "#10b981",
  teamPhotos: [
    {
      title: "Team Engineering & Kolaborasi",
      image: "/images/experience/irostech/orang/team-1.jpg",
      description: "Momen kebersamaan tim engineering Irostech saat demo aplikasi bersama di kantor"
    },
    {
      title: "Sprint Review & Presentasi Sistem",
      image: "/images/experience/irostech/orang/team-2.jpg",
      description: "Sesi presentasi dashboard dan arsitektur backend di ruang rapat"
    },
    {
      title: "Kebersamaan Rekan Tim",
      image: "/images/experience/irostech/orang/team-3.jpg",
      description: "Diskusi santai dan kekompakan tim developer di kantor Bandung"
    },
    {
      title: "Standup & Diskusi Teknis",
      image: "/images/experience/irostech/orang/team-4.jpg",
      description: "Koordinasi teknis tim engineering saat evaluasi fitur sistem"
    }
  ],
  screenshots: [
    {
      title: "Admin Dashboard MBG",
      image: "/images/experience/irostech/projects/dashboard-admin.png",
      description: "Pusat pemantauan data makanan sekolah dan SPPG"
    },
    {
      title: "Evaluasi & Cek Nutrisi AI",
      image: "/images/experience/irostech/projects/nutrion-result.png",
      description: "Hasil analisis gizi otomatis menggunakan model AI"
    },
    {
      title: "Sistem Peringatan Insiden",
      image: "/images/experience/irostech/projects/keracunan-web.png",
      description: "Pelaporan insiden makanan dan integrasi webhook peringatan"
    }
  ]
};

export const EXPERIENCES: ExperienceItem[] = [
  WINNICODE_EXPERIENCE,
  IROSTECH_EXPERIENCE,
];

export const TIMELINE_STOPS = [
  { id: "intro", label: "Intro", targetId: "exp-intro" },
  { id: "winnicode", label: "Winnicode", targetId: "exp-win" },
  { id: "irostech", label: "Irostech", targetId: "exp-iro" },
  { id: "projects", label: "Projects", targetId: "exp-end" }
];
