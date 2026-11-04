export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  description: string;
  recipient: string;
  date: string;
  credentialUrl?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  venue: string;
  year: string;
  authors: string;
  paperUrl?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organizer: string;
  year: string;
  description: string;
}

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Dicoding – Data Visualization",
    issuer: "Dicoding Academy",
    description: "Sertifikasi keahlian analisis data, visualisasi interaktif, dan storytelling data menggunakan Python dan modern charting library.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2024",
    credentialUrl: "https://dicoding.com"
  },
  {
    id: "cert-2",
    title: "TensorFlow Developer Certificate",
    issuer: "DeepLearning.AI / Google",
    description: "Kompetensi membangun dan melatih model deep learning, computer vision, dan pemrosesan bahasa alami menggunakan TensorFlow.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2024",
    credentialUrl: "#"
  },
  {
    id: "cert-3",
    title: "Machine Learning Specialization",
    issuer: "Stanford Online / Coursera",
    description: "Penguasaan algoritma supervised/unsupervised learning, reinforcement learning, dan implementasi best-practices AI industri.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2023",
    credentialUrl: "#"
  },
  {
    id: "cert-4",
    title: "Fullstack Web Engineering",
    issuer: "PT Winnicode Garuda Teknologi",
    description: "Penyelesaian program magang rekayasa web intensif dengan predikat Sangat Baik Sekali (A).",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2025",
    credentialUrl: "#"
  },
  {
    id: "cert-5",
    title: "Next.js & React Professional",
    issuer: "Vercel Ecosystem",
    description: "Arsitektur App Router, Server Components, SSR/SSG, dan optimasi performa skala produksi.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2024",
    credentialUrl: "#"
  },
  {
    id: "cert-6",
    title: "Cloud Infrastructure & APIs",
    issuer: "Google Cloud Skills",
    description: "Deployment microservices, containerization, dan integrasi API aman berskala tinggi.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2024",
    credentialUrl: "#"
  },
  {
    id: "cert-7",
    title: "Applied Generative AI & LLMs",
    issuer: "AI Research Hub",
    description: "Penerapan teknik prompt engineering, RAG architecture, dan orkestrasi autonomous agent pipelines.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2024",
    credentialUrl: "#"
  },
  {
    id: "cert-8",
    title: "Algorithmic Problem Solving",
    issuer: "Competitive Programming Lab",
    description: "Penguasaan struktur data tingkat lanjut, algoritma graf, dan optimasi komputasi efisien.",
    recipient: "Muhamad Fahreza Andina Rizki",
    date: "2023",
    credentialUrl: "#"
  }
];

export const PUBLICATIONS_DATA: PublicationItem[] = [
  {
    id: "pub-1",
    title: "Optimasi Inferensi Model Large Language Models Berbasis Arsitektur Hybrid di Perangkat Edge",
    venue: "Jurnal Rekayasa Sistem & Kecerdasan Buatan Nasional",
    year: "2024",
    authors: "Muhamad Fahreza Andina Rizki, Tim Peneliti AI",
    paperUrl: "#"
  },
  {
    id: "pub-2",
    title: "Analisis Kinerja GPGPU Particle Simulation pada WebGL untuk Visualisasi Data Interaktif",
    venue: "Seminar Nasional Ilmu Komputer & Rekayasa Perangkat Lunak",
    year: "2024",
    authors: "Muhamad Fahreza Andina Rizki, Rekan Peneliti",
    paperUrl: "#"
  },
  {
    id: "pub-3",
    title: "Implementasi Sistem Otomasi Berbasis Agentic Workflow pada Pengelolaan Data Terdistribusi",
    venue: "Konferensi Teknologi Informasi & Rekayasa Komputasi",
    year: "2023",
    authors: "Muhamad Fahreza Andina Rizki",
    paperUrl: "#"
  }
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: "hon-1",
    title: "Juara 1 – National AI Innovation & Hackathon Challenge",
    organizer: "Kementerian Komunikasi & Informatika / Asosiasi AI",
    year: "2024",
    description: "Membangun sistem automasi berbasis agentic AI dan inferensi model cerdas berkinerja tinggi untuk optimasi layanan publik."
  },
  {
    id: "hon-2",
    title: "Lulusan Magang Terbaik (Predikat A – Sangat Baik Sekali)",
    organizer: "PT Winnicode Garuda Teknologi",
    year: "2025",
    description: "Penghargaan atas dedikasi teknis unggul, penyelesaian milestone tepat waktu, dan kontribusi nyata pada produk perusahaan."
  },
  {
    id: "hon-3",
    title: "Finalis – Software Engineering Collegiate Championship",
    organizer: "Kompetisi Mahasiswa Bidang Komputer Nasional",
    year: "2023",
    description: "Pengembangan arsitektur backend terdistribusi yang efisien dan tangguh dalam pengujian beban berskala jutaan request."
  }
];
