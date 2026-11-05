export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  description: string;
  recipient: string;
  date: string;
  credentialUrl?: string;
  badgeId?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  year: string;
  authors: string;
  paperUrl?: string;
  description?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organizer: string;
  year: string;
  description: string;
  documentUrl?: string;
}

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: "cert-mtcna",
    title: "MikroTik Certified Network Associate (MTCNA)",
    issuer: "MikroTik (Mikrotikls SIA, Latvia)",
    description: "Sertifikasi resmi kompetensi routing protokol, firewall, wireless, QoS bandwidth management, dan troubleshooting jaringan komputer berskala industri.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "10 Juli 2026",
    badgeId: "2607NA0217",
    credentialUrl: "/docs/certificates/Mikrotik_MTCNA.pdf"
  },
  {
    id: "cert-ibm-ai-agent",
    title: "Build an AI Agent",
    issuer: "IBM SkillsBuild",
    description: "Perancangan arsitektur autonomous AI agents, integrasi memory, workflow reasoning, dan orkestrasi tools eksternal.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "23 September 2026",
    credentialUrl: "https://www.credly.com/go/jJZyl0hV"
  },
  {
    id: "cert-google-spec-driven",
    title: "Spec-Driven Development with Antigravity CLI",
    issuer: "Google",
    description: "Structured Agent Workflows with Skills and MCP (Model Context Protocol) untuk rekayasa sistem otomatis tingkat lanjut.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "22 Juli 2026",
    credentialUrl: "/docs/certificates/Google_Spec_Driven_Fahreza.pdf"
  },
  {
    id: "cert-google-code-quality",
    title: "Supercharge Code Quality and Security: AI-Assisted Checks",
    issuer: "Google",
    description: "Penerapan AI-assisted checks, automasi evaluasi kualitas kode, dan inspeksi keamanan sistem dengan Antigravity CLI dan SDK.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "24 Juli 2026",
    credentialUrl: "/docs/certificates/Google_Supercharge_code.pdf"
  },
  {
    id: "cert-hacktiv8-ai",
    title: "IT - AI Agent for Programming",
    issuer: "Hacktiv8 Indonesia",
    description: "Pelatihan intensif 9 jam pengembangan dan otomasi perangkat lunak menggunakan agen AI terintegrasi (No: 15708/H8/CSR/ISUE/V/2026).",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "25 September 2026",
    credentialUrl: "/docs/certificates/hacktiv8-AIforIT.pdf"
  },
  {
    id: "cert-dicoding-solid",
    title: "Belajar Prinsip Pemrograman SOLID",
    issuer: "Dicoding Academy",
    description: "Penguasaan 5 pilar SOLID, Object-Oriented Programming (OOP) standar industri, arsitektur software bersih, dan penanganan code smell (15 jam).",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "08 Juli 2025",
    badgeId: "JMZVVQ72RZN9",
    credentialUrl: "https://dicoding.com/certificates/JMZVVQ72RZN9"
  },
  {
    id: "cert-dicoding-python",
    title: "Memulai Pemrograman dengan Python",
    issuer: "Dicoding Academy",
    description: "Kompetensi mendalam 60 jam pemrograman Python, manipulasi data, unit testing otomatis, PEP8 style guide, dan ekosistem library data modern.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "25 Juni 2025",
    badgeId: "QLZ93JJWMZ5D",
    credentialUrl: "https://dicoding.com/certificates/QLZ93JJWMZ5D"
  },
  {
    id: "cert-dicoding-visdata",
    title: "Belajar Dasar Visualisasi Data",
    issuer: "Dicoding Academy",
    description: "Sertifikasi pengolahan dan visualisasi data, storytelling data, transformasi grafik, dan penerapan prinsip desain Gestalt (16 jam).",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "05 Maret 2025",
    badgeId: "1OP827D0VPQK",
    credentialUrl: "https://dicoding.com/certificates/1OP827D0VPQK"
  },
  {
    id: "cert-myskill-wf",
    title: "Website Development Fundamental",
    issuer: "MySkill",
    description: "Specialization path 9 courses (9 jam) meliputi arsitektur web modern, fundamental frontend, dan backend orchestration.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "25 Juni 2025",
    badgeId: "MS-25/6/2025-x1Lz31qouXxEqstpiugj",
    credentialUrl: "/docs/certificates/myskillWF-min.pdf"
  },
  {
    id: "cert-myskill-be",
    title: "Back-End Development Introduction",
    issuer: "MySkill",
    description: "Sertifikasi arsitektur backend, server handling, komunikasi REST API, dan manajemen logika data.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "22 Juni 2025",
    badgeId: "MS-22/6/2025-GU4DawXW1DBeiNWlWBQG",
    credentialUrl: "/docs/certificates/myskillbe-min.pdf"
  },
  {
    id: "cert-myskill-fe",
    title: "Front-End Development Introduction",
    issuer: "MySkill",
    description: "Sertifikasi antarmuka web interaktif, manipulasi DOM modern, dan struktur UI responsif.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "22 Juni 2025",
    badgeId: "MS-22/6/2025-0yt7BBGxKo2z2Oo9CrcD",
    credentialUrl: "/docs/certificates/myskillfe-min.pdf"
  }
];

export const PUBLICATIONS_DATA: PublicationItem[] = [
  {
    id: "pub-1",
    title: "Perancangan Sistem Otomatisasi Pembuatan Website Menggunakan LLM dan RAG Berbasis Website",
    venue: "Universitas Pendidikan Indonesia · Skripsi / Undergraduate Thesis",
    year: "2026",
    authors: "Muhamad Fahreza Andina Rizki",
    description: "Membangun sistem pembuatan website otomatis dari nol hingga siap deploy yang memadukan LLM lokal Qwen3.5-9B dengan arsitektur Retrieval-Augmented Generation (RAG) berbasis ChromaDB.",
    paperUrl: "#"
  },
  {
    id: "pub-2",
    title: "Implementation of Base64 Table-Based LSB Steganography Ciphertext Encryption-Decryption on Website Applications",
    venue: "JIKO (Jurnal Informatika dan Komputer) · (On-Review)",
    year: "2025",
    authors: "Muhamad Fahreza Andina Rizki, dkk.",
    description: "Implementasi algoritma steganografi Least Significant Bit (LSB) berbasis tabel Base64 untuk enkripsi dan dekripsi ciphertext pada aplikasi website.",
    paperUrl: "#"
  },
  {
    id: "pub-3",
    title: "Microcontroller and Web-Based Photo Studio Automation System",
    venue: "JTIKOM (Jurnal Teknologi Informasi dan Komputer)",
    year: "2025",
    authors: "Muhamad Fahreza Andina Rizki, dkk.",
    description: "Rancang bangun sistem otomasi studio foto terintegrasi berbasis mikrokontroler dan antarmuka kontrol web cerdas.",
    paperUrl: "#"
  },
  {
    id: "pub-4",
    title: "Rancangan Aplikasi Penghitung Body Mass Index Dengan Auto Planning Workout",
    venue: "SMART-COMP (Conference on Smart Computing & Applied Technology)",
    year: "2024",
    authors: "Muhamad Fahreza Andina Rizki, dkk.",
    description: "Rancangan aplikasi kalkulator Body Mass Index (BMI) dengan perencanaan program latihan olahraga otomatis terpersonalisasi.",
    paperUrl: "#"
  }
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: "hon-1",
    title: "Google Cloud Gen AI Academy APAC 2026 – Cohort 3 Ideathon",
    organizer: "Google Cloud & Hack2skill (Certificate ID: 2026H2S09GCGENAIAPACC3I-P01457)",
    year: "2026",
    description: "Penghargaan atas keikutsertaan dan perancangan solusi inovatif dalam membangun, men-deploy, serta mengorkestrasikan AI agents menggunakan Cloud Run pada ajang kompetisi regional APAC.",
    documentUrl: "/docs/awards/APAC_Hackathon.pdf"
  },
  {
    id: "hon-2",
    title: "Peraih Medali Perunggu (Bronze Medal) Bidang Matematika",
    organizer: "National Environmental Science Olympiad (NESO 2022)",
    year: "2022",
    description: "Peraih Medali Perunggu dalam kompetisi Matematika tingkat Nasional jenjang SMA/MA/SMK mewakili SMAIT As-Syifa Boarding School Wanareja, Jawa Barat.",
    documentUrl: "/docs/awards/NESO 15 - 24-490.pdf"
  },
  {
    id: "hon-3",
    title: "Predikat A (Sangat Baik Sekali) – Lulusan Magang Fullstack Engineer",
    organizer: "PT Winnicode Garuda Teknologi",
    year: "2025",
    description: "Penghargaan evaluasi kinerja teknis tertinggi atas keberhasilan membangun CMS portal berita, modul analitik pembaca real-time, dan arsitektur web modern.",
    documentUrl: "/docs/certificates/winnicode_certificate.pdf"
  }
];
