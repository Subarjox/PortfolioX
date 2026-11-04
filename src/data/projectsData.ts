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
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "01",
    title: "Subarvibe",
    subtitle: "Fullstack & AI Engineer · Local LLM & RAG Web Builder",
    description:
      "Sistem pembuatan website otomatis dari nol hingga siap deploy berbasis website yang memadukan LLM lokal Qwen3.5-9B dengan arsitektur RAG (ChromaDB) dan pembuatan gambar Flux1-schnell via ComfyUI pada hardware 12GB VRAM.",
    image: "/images/projects/subarvibe.png",
    accentColor: "#2563eb",
    href: "#",
    externalUrl: "#",
    tags: ["Local LLM", "RAG", "ChromaDB", "ComfyUI", "Next.js", "Python"],
  },
  {
    id: "02",
    title: "FoodGuard",
    subtitle: "Backend Engineer · LLM & Incident Hub Platform",
    description:
      "Infrastruktur backend platform evaluasi gizi makanan sekolah terpusat (MBG) kolaborasi bersama BRIN, dengan integrasi LLM untuk analisis nutrisi otomatis dari foto dan pelaporan insiden real-time via Discord Webhook.",
    image: "/images/projects/foodguard.png",
    accentColor: "#10b981",
    href: "#",
    externalUrl: "#",
    tags: ["FastAPI", "Python", "LLM", "Discord Webhook", "PostgreSQL", "Docker"],
  },
  {
    id: "03",
    title: "TheAgents",
    subtitle: "AI Engineer · Autonomous Multi-Agent Office",
    description:
      "Proyek Agentic Office di mana masing-masing agen AI memiliki peran, tools, dan alurnya sendiri untuk berkolaborasi secara otonom menyelesaikan automasi tugas pekerjaan.",
    image: "/images/projects/theagents.png",
    accentColor: "#8b5cf6",
    href: "#",
    externalUrl: "#",
    tags: ["AI Agents", "Agentic Workflow", "LLM Orchestration", "Python", "TypeScript"],
  },
  {
    id: "04",
    title: "AIgency",
    subtitle: "AI Engineer · AI Business Copilot for SME",
    description:
      "Platform AI Business Copilot untuk digitalisasi UMKM. Mulai dari pembuatan dan pengelolaan website landing page & checkout berbasis AI terintegrasi WhatsApp, manajemen stok, hingga Customer Service AI dan Content Advisor.",
    image: "/images/projects/aigency.png",
    accentColor: "#f97316",
    href: "#",
    externalUrl: "#",
    tags: ["AI Copilot", "Next.js", "WhatsApp API", "Agentic AI", "SME Tech"],
  },
];
