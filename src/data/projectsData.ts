export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  href: string;
  tags?: string[];
  externalUrl?: string; // backwards compatibility
  details?: string;
  workflow?: string;
  status?: string;
  screenshots?: string[];
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "01",
    title: "Subarvibe",
    subtitle: "Fullstack & AI Engineer · Local LLM & RAG Web Builder",
    description:
      "Sistem pembuatan website otomatis dari nol hingga siap deploy berbasis website yang memadukan LLM lokal Qwen3.5-9B dengan arsitektur RAG (ChromaDB) dan pembuatan gambar Flux1-schnell via ComfyUI pada hardware 12GB VRAM.",
    details:
      "Membangun sistem pembuatan website otomatis dari nol hingga siap deploy berbasis website, yang memadukan LLM lokal Qwen3.5-9B dengan arsitektur Retrieval-Augmented Generation (RAG) berbasis ChromaDB untuk menyusun struktur konten secara dinamis. Merancang pipeline inferensi lokal terpadu pada perangkat keras terbatas (VRAM 12GB), dengan mengatur alokasi memori agar pembuatan website dan pembuatan gambar Flux1-schnell via ComfyUI berjalan otomatis tanpa kegagalan out-of-memory (OOM).",
    workflow:
      "User Login → Create New Website → Deskripsikan Bisnis → Website Terbuat Dinamis → Manajemen Website (Update, Delete, Download, Deploy)",
    image: "/images/projects/Subarvibe-Thumbnail.png",
    accentColor: "#2563eb",
    href: "#",
    externalUrl: "#",
    tags: ["Local LLM", "RAG", "ChromaDB", "ComfyUI", "Next.js", "Python"],
    screenshots: [
      "/images/projects/subarvibe-dashboard.png",
      "/images/projects/subarvibe-create.png",
      "/images/projects/subarvibe-preview&edit.png",
      "/images/projects/subarvibe-recheck_data.png",
      "/images/projects/subarvibe-delete&deploy&download.png",
      "/images/projects/subarvibe-login.png",
    ],
  },
  {
    id: "02",
    title: "FoodGuard",
    subtitle: "Backend Engineer · LLM & Incident Hub Platform",
    description:
      "Infrastruktur backend platform evaluasi gizi makanan sekolah terpusat (MBG) kolaborasi bersama BRIN, dengan integrasi LLM untuk analisis nutrisi otomatis dari foto dan pelaporan insiden real-time via Discord Webhook.",
    details:
      "Membangun infrastruktur backend platform evaluasi gizi makanan sekolah, dengan integrasi LLM untuk pengecekan dan pemantauan kualitas makanan secara otomatis. Merancang dan men-deploy sistem pencatatan insiden berlatensi rendah yang memakai webhook Discord real-time untuk memicu peringatan anomali dan pelaporan keamanan pangan yang aman. Mengintegrasikan model LLM langsung ke backend untuk mengotomatiskan analisis gizi dan deteksi anomali dari foto makanan.",
    workflow:
      "3 Role User (Admin Kementrian, Sekolah, SPPG) → CRUD Data Terkait → Pengecekan Kualitas Gizi dari Foto Makanan Siswa → Peringatan Real-time Discord Webhook saat Keracunan/Anomali",
    image: "/images/projects/FoodGuard-Thumbnail.png",
    accentColor: "#10b981",
    href: "#",
    externalUrl: "#",
    tags: ["FastAPI", "Python", "LLM", "Discord Webhook", "PostgreSQL", "Docker"],
    screenshots: [
      "/images/projects/dashboard-admin.png",
      "/images/projects/dashboard-sekolah.png",
      "/images/projects/dashboard-sppg.png",
      "/images/projects/nutrition-check.png",
      "/images/projects/nutrion-result.png",
      "/images/projects/keracunan-web.png",
      "/images/projects/keracunan-notification.png",
      "/images/projects/resolved-web.png",
      "/images/projects/resolved-notification.png",
    ],
  },
  {
    id: "03",
    title: "TheAgents",
    subtitle: "AI Engineer · Autonomous Multi-Agent Office",
    status: "ON ACTIVE DEVELOPMENT",
    description:
      "Proyek Agentic Office di mana masing-masing agen AI memiliki peran, tools, dan alurnya sendiri untuk berkolaborasi secara otonom menyelesaikan automasi tugas pekerjaan.",
    details:
      "Sebuah projek Agentic Office di mana masing-masing agent mempunyai jobdesk tersendiri, tools mandiri, dan alur kerja terstruktur. Agen-agen ini berkolaborasi secara otonom untuk menyelesaikan tugas-tugas terdistribusi tanpa intervensi manual berulang, dirancang untuk mempermudah dan mengotomasi seluruh alur kerja produktivitas pribadi.",
    workflow:
      "Task Ingestion & Planning → Agent Role Assignment & Tool Execution → Inter-Agent Verification & Feedback → Automated Result Delivery",
    image: "/images/projects/TheAgents-Thumbnail.png",
    accentColor: "#8b5cf6",
    href: "#",
    externalUrl: "#",
    tags: ["AI Agents", "Agentic Workflow", "LLM Orchestration", "Python", "TypeScript"],
    screenshots: [
      "/images/projects/TheAgents-Idle.png",
      "/images/projects/TheAgents-Planning.png",
      "/images/projects/TheAgents-Working.png",
    ],
  },
  {
    id: "04",
    title: "AIgency",
    subtitle: "AI Engineer · AI Business Copilot for SME",
    status: "ON ACTIVE DEVELOPMENT",
    description:
      "Platform AI Business Copilot untuk digitalisasi UMKM. Mulai dari pembuatan dan pengelolaan website landing page & checkout berbasis AI terintegrasi WhatsApp, manajemen stok, hingga Customer Service AI dan Content Advisor.",
    details:
      "Platform AI Business Copilot yang dirancang untuk mendigitalisasi operasional UMKM. Mencakup pembuatan dan pengelolaan landing page beserta checkout dinamis berbasis AI yang terintegrasi langsung dengan WhatsApp API, sistem pengelolaan inventaris/stok toko cerdas, hingga Customer Service AI 24/7 dan Content Advisor otomatis untuk strategi marketing.",
    workflow:
      "User Login → Deskripsikan Profil Bisnis → Otomasi Setup Web Landing Page & Produk → AI WhatsApp Integration → Customer Service AI & Content Advisor",
    image: "/images/projects/AIgency-Thumbnail.png",
    accentColor: "#f97316",
    href: "#",
    externalUrl: "#",
    tags: ["AI Copilot", "Next.js", "WhatsApp API", "Agentic AI", "SME Tech"],
    screenshots: [
      "/images/projects/AIgency-web.png",
      "/images/projects/AIgency-Stock.png",
      "/images/projects/AIgency-Social_media.png",
    ],
  },
];
