export interface StickyNote {
  id: string;
  author: string;
  message: string;
  color: "yellow" | "salmon" | "blue";
  x: number; // percentage
  y: number; // percentage
  rotation: number; // degrees
  date?: string;
  isUserAdded?: boolean;
}

export const INITIAL_STICKY_NOTES: StickyNote[] = [
  {
    id: "note-1",
    author: "Wak Hj. Umuh",
    message: "Ulah ragu! Fahreza mah budak pinter, ngulik AI jeung coding-na disiplin pisan. Rekrut budak ieu moal kaduhung!",
    color: "yellow",
    x: 4,
    y: 4,
    rotation: -4,
  },
  {
    id: "note-2",
    author: "Asep S.",
    message: "Solutif pisan mun urusan arsitektur web & automasi sistem. Proyek tuntas leuwih gancang ti target!",
    color: "salmon",
    x: 78,
    y: 6,
    rotation: 3,
  },
  {
    id: "note-3",
    author: "Sri W.",
    message: "Fahreza kerjanya teliti & komunikatif banget waktu kolaborasi tim. Kodenya super clean dan terstruktur rapi!",
    color: "blue",
    x: 82,
    y: 46,
    rotation: -3,
  },
  {
    id: "note-4",
    author: "Ijal P.",
    message: "Tech stack-nya edun! Dari fine-tuning LLM lokal sampe interactive 3D WebGL dilibas tuntas. Top tier engineer!",
    color: "yellow",
    x: 2,
    y: 52,
    rotation: 4,
  },
  {
    id: "note-5",
    author: "Jumadi",
    message: "Dedikasi teknisnya luar biasa waktu sprint bareng. Selalu bawa solusi out-of-the-box pas nemu blocker sulit.",
    color: "salmon",
    x: 8,
    y: 78,
    rotation: -5,
  },
  {
    id: "note-6",
    author: "Ojanx",
    message: "Kalo Fahreza yang megang modul backend & AI pipeline, tim tinggal fokus eksekusi. Hasilnya pasti gaspol!",
    color: "blue",
    x: 44,
    y: 82,
    rotation: 3,
  },
  {
    id: "note-7",
    author: "Pehul",
    message: "Engineer muda berbakat dari Cimahi dengan visi rekayasa masa depan yang jelas. Sukses terus Rez, menyala!",
    color: "yellow",
    x: 74,
    y: 80,
    rotation: -2,
  },
];
