export interface ExperienceDocumentation {
  title: string;
  gradient: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
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
  documentation: ExperienceDocumentation[];
}

export const WINNICODE_EXPERIENCE: ExperienceItem = {
  id: "winnicode",
  company: "PT Winnicode Garuda Teknologi",
  tagline: "Magang Mandiri · Remote · Feb – Jun 2025",
  period: "Feb – Jun 2025",
  location: "Remote",
  type: "Magang Mandiri · Kampus Merdeka",
  role: "Software & Web Developer Intern",
  predicate: "Sangat Baik Sekali (A)",
  recipient: "Muhamad Fahreza Andina Rizki",
  summary: "Program magang berfokus pada rekayasa perangkat lunak modern, pengembangan modul antarmuka interaktif, dan optimalisasi sistem web.",
  responsibilities: [
    "Mengembangkan arsitektur antarmuka web responsif dan integrasi API performa tinggi.",
    "Mengimplementasikan komponen reusable modern dengan fokus pada kebersihan kode dan maintainability.",
    "Berkolaborasi aktif dalam sprint rutin dan evaluasi code review berkala bersama tim teknis."
  ],
  impact: [
    "Menuntaskan seluruh target proyek penugasan tepat waktu dengan predikat Sangat Baik Sekali (A).",
    "Meningkatkan konsistensi performa UI/UX serta efisiensi pengembangan modul web."
  ],
  techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Git"],
  documentation: [
    { title: "Sprint & Feature Dev", gradient: "from-amber-200 to-teal-300" },
    { title: "Interface & UI Architecture", gradient: "from-orange-400 to-sky-500" },
    { title: "Codebase & Deployment", gradient: "from-slate-700 to-blue-400" }
  ]
};

export const TIMELINE_STOPS = [
  { id: "intro", label: "Intro", targetId: "exp-intro" },
  { id: "winnicode", label: "Feb – Jun 2025", targetId: "exp-win" },
  { id: "upcoming", label: "Berikutnya", targetId: "exp-next" },
  { id: "projects", label: "Projects", targetId: "exp-end" }
];
