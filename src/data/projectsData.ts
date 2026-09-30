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
    title: "Coming Soon",
    subtitle: "On Progress",
    image: "/images/projects/3.png",
    accentColor: "#d94314",
    externalUrl: "https://oakley.com",
  },
  {
    id: "02",
    title: "6 Days to go",
    subtitle: "On Progress",
    image: "/images/projects/4.png",
    accentColor: "#4a5568",
  },
];
