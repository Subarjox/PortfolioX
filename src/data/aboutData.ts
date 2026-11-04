export interface TechItem {
  name: string;
  icon: string;
  category: "softeng" | "ai";
}

export interface RoleDetail {
  id: "ai" | "softeng";
  title: string;
  color: string;
  accentClass: string;
  borderClass: string;
  bgTintClass: string;
  description: string;
  stack: TechItem[];
}

export const SOFTENG_STACK: TechItem[] = [
  { name: "NextJS", icon: "/icons/tech/nextjs.svg", category: "softeng" },
  { name: "Laravel", icon: "/icons/tech/laravel.svg", category: "softeng" },
  { name: "Java", icon: "/icons/tech/java.svg", category: "softeng" },
  { name: "Supabase", icon: "/icons/tech/supabase.svg", category: "softeng" },
  { name: "FastAPI", icon: "/icons/tech/fastapi.svg", category: "softeng" },
  { name: "React", icon: "/icons/tech/react.svg", category: "softeng" },
  { name: "Express", icon: "/icons/tech/express.svg", category: "softeng" },
  { name: "And Many More", icon: "/icons/tech/more.svg", category: "softeng" },
];

export const AI_STACK: TechItem[] = [
  { name: "Llama cpp", icon: "/icons/tech/llamacpp.svg", category: "ai" },
  { name: "TensorFlow", icon: "/icons/tech/tensorflow.svg", category: "ai" },
  { name: "Keras", icon: "/icons/tech/keras.svg", category: "ai" },
  { name: "ComfyUI", icon: "/icons/tech/comfyui.svg", category: "ai" },
  { name: "Claude Code", icon: "/icons/tech/claude.svg", category: "ai" },
  { name: "Agy", icon: "/icons/tech/agy.svg", category: "ai" },
  { name: "PyTorch", icon: "/icons/tech/pytorch.svg", category: "ai" },
  { name: "And Many More", icon: "/icons/tech/more.svg", category: "ai" },
];

export const ROLES_DATA: Record<"ai" | "softeng", RoleDetail> = {
  ai: {
    id: "ai",
    title: "AI Engineer",
    color: "#2f6bff",
    accentClass: "text-[#2f6bff]",
    borderClass: "border-[#2f6bff]",
    bgTintClass: "bg-[#2f6bff]/10",
    description:
      "Merancang, melatih, dan men-deploy model kecerdasan buatan, inferensi LLM lokal, sistem generative AI, serta automasi agentic workflow untuk memecahkan masalah industri riil.",
    stack: AI_STACK,
  },
  softeng: {
    id: "softeng",
    title: "Software Engineer",
    color: "#ff6a2b",
    accentClass: "text-[#ff6a2b]",
    borderClass: "border-[#ff6a2b]",
    bgTintClass: "bg-[#ff6a2b]/10",
    description:
      "Membangun arsitektur aplikasi full-stack modern, sistem backend terdistribusi yang tangguh, antarmuka web performa tinggi, dan API skalabel dengan standar rekayasa perangkat lunak terbaik.",
    stack: SOFTENG_STACK,
  },
};

export const ABOUT_STATS = [
  { value: "3,64 / 4", label: "GPA" },
  { value: "10 +", label: "Projects" },
  { value: "3", label: "Publications" },
];
