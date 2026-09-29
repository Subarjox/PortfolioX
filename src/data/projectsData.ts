export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
  externalUrl?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "01",
    title: "Oakley Meta HSTN – Mix N Match",
    subtitle: "Connected Eyewear & Audio Experience",
    image: "/images/projects/oakley.png",
    accentColor: "#d94314",
    externalUrl: "https://oakley.com",
  },
  {
    id: "02",
    title: "Minimalist Dev Workspace",
    subtitle: "Hardware & Studio Architectural Rig",
    image: "/images/projects/workspace.png",
    accentColor: "#4a5568",
  },
  {
    id: "03",
    title: "Acrobat Trail Sneaker",
    subtitle: "High-Performance Outdoor Kinetic Footwear",
    image: "/images/projects/sneaker.png",
    accentColor: "#c28e2b",
  },
  {
    id: "04",
    title: "Nordic Architectural Living",
    subtitle: "Brutalist Space, Materiality & Warm Light",
    image: "/images/projects/nordic.png",
    accentColor: "#3d4852",
  },
  {
    id: "05",
    title: "Kinetic Sound Synthesizer",
    subtitle: "Tactile Modular Sound Architecture",
    image: "/images/projects/sound.png",
    accentColor: "#1e3a8a",
  },
  {
    id: "06",
    title: "Autonomous Agent Intelligence",
    subtitle: "Distributed Systems & Ambient Engineering",
    image: "/images/projects/agent.png",
    accentColor: "#10b981",
  },
];
