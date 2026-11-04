"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Sparkles, Check } from "lucide-react";
import { INITIAL_STICKY_NOTES, type StickyNote } from "@/data/stickyNotesData";

const COLOR_MAP = {
  yellow: {
    bg: "#fff4a3",
    fold: "#e6d56a",
    swatch: "#fff4a3",
  },
  salmon: {
    bg: "#f5bfae",
    fold: "#d99a87",
    swatch: "#f5bfae",
  },
  blue: {
    bg: "#8fb0dc",
    fold: "#6286b8",
    swatch: "#8fb0dc",
  },
};

export function StickyNotesSection() {
  const [notes, setNotes] = useState<StickyNote[]>(INITIAL_STICKY_NOTES);
  const [zoomedNote, setZoomedNote] = useState<StickyNote | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    message: string;
    author: string;
    color: "yellow" | "salmon" | "blue";
  }>({
    message: "",
    author: "",
    color: "yellow",
  });
  const [formError, setFormError] = useState<string>("");

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomedNote) setZoomedNote(null);
        if (isFormOpen) setIsFormOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedNote, isFormOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMsg = formData.message.trim();
    if (!trimmedMsg) {
      setFormError("Tulis pesanmu terlebih dahulu.");
      return;
    }

    if (trimmedMsg.length > 80) {
      setFormError("Pesan maksimal 80 karakter.");
      return;
    }

    // Add note to board
    const newNote: StickyNote = {
      id: `user-note-${Date.now()}`,
      author: formData.author.trim() || "Anonymous",
      message: trimmedMsg,
      color: formData.color,
      x: 35 + Math.floor(Math.random() * 30),
      y: 25 + Math.floor(Math.random() * 25),
      rotation: Math.floor(Math.random() * 10 - 5),
      isUserAdded: true,
    };

    setNotes((prev) => [newNote, ...prev]);
    setIsFormOpen(false);
    setFormData({ message: "", author: "", color: "yellow" });
    setFormError("");
    showToast("Terima kasih! Pesan sticky note-mu berhasil tertempel di dinding.");
  };

  return (
    <section
      id="notes-section"
      className="relative w-full bg-white text-black py-20 sm:py-32 px-4 sm:px-8 selection:bg-neutral-200 overflow-hidden border-t border-neutral-100"
      aria-label="Community Sticky Notes Board"
    >
      <div className="relative max-w-7xl mx-auto min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex flex-col justify-center">
        {/* CENTER CONTENT */}
        <div className="relative z-10 max-w-xl mx-auto text-center px-4 my-auto">

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 leading-[1.1]">
            Leave Your{" "}
            <span className="relative inline-block text-neutral-950">
              Mark Here!
              <svg
                className="absolute left-0 -bottom-2 w-full h-3 overflow-visible pointer-events-none"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8 C 80 2, 200 3, 297 6"
                  fill="none"
                  stroke="#ffd23f"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 font-normal mt-4 mb-7 max-w-md mx-auto leading-relaxed">
            Tinggalkan pesan singkat, kesan, atau dukungan untuk Fahreza. Catatanmu akan langsung
            tertempel di papan interaktif ini!
          </p>

          <button
            type="button"
            onClick={() => {
              setFormError("");
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white font-bold text-sm tracking-wide hover:bg-neutral-800 transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Stick a note</span>
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* DESKTOP SCATTERED STICKY NOTES */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {notes.map((note) => {
            const colors = COLOR_MAP[note.color];

            return (
              <article
                key={note.id}
                role="button"
                tabIndex={0}
                onClick={() => setZoomedNote(note)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setZoomedNote(note);
                  }
                }}
                aria-label={`Buka pesan dari ${note.author}`}
                style={{
                  left: `${note.x}%`,
                  top: `${note.y}%`,
                  transform: `rotate(${note.rotation}deg)`,
                  backgroundColor: colors.bg,
                }}
                className="pointer-events-auto absolute w-28 sm:w-32 md:w-36 aspect-square p-2.5 sm:p-3 flex flex-col justify-between shadow-[0_12px_24px_-10px_rgba(0,0,0,0.45)] hover:shadow-[0_22px_35px_-12px_rgba(0,0,0,0.5)] transition-all duration-200 hover:scale-115 hover:rotate-0 hover:z-30 cursor-pointer overflow-hidden rounded-sm group select-none"
              >
                {/* Note message in handwriting font */}
                <p className="font-handwriting text-sm sm:text-base font-semibold leading-[1.15] text-neutral-800 line-clamp-4 overflow-hidden">
                  &ldquo;{note.message}&rdquo;
                </p>

                {/* Author signature */}
                <span className="font-handwriting text-xs sm:text-sm font-bold text-neutral-700/80 self-end block truncate max-w-full">
                  — {note.author}
                </span>

                {/* Folded Corner at Bottom-Right */}
                <div
                  className="absolute right-0 bottom-0 w-4 h-4 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${colors.fold} 50%)`,
                  }}
                />

                {/* User-added tag */}
                {note.isUserAdded && (
                  <span className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    New
                  </span>
                )}
              </article>
            );
          })}
        </div>

        {/* MOBILE RESPONSIVE GRID (BELOW MD BREAKPOINT) */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 px-2">
          {notes.map((note) => {
            const colors = COLOR_MAP[note.color];

            return (
              <article
                key={note.id}
                role="button"
                tabIndex={0}
                onClick={() => setZoomedNote(note)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setZoomedNote(note);
                  }
                }}
                aria-label={`Buka pesan dari ${note.author}`}
                style={{
                  backgroundColor: colors.bg,
                }}
                className="relative aspect-square p-3 flex flex-col justify-between shadow-md hover:shadow-lg transition-all rounded-sm cursor-pointer overflow-hidden"
              >
                <p className="font-handwriting text-sm font-semibold leading-tight text-neutral-800 line-clamp-4">
                  &ldquo;{note.message}&rdquo;
                </p>

                <span className="font-handwriting text-xs font-bold text-neutral-700/80 self-end">
                  — {note.author}
                </span>

                <div
                  className="absolute right-0 bottom-0 w-3.5 h-3.5"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${colors.fold} 50%)`,
                  }}
                />
              </article>
            );
          })}
        </div>
      </div>

      {/* ZOOM MODAL (CLICKED STICKY NOTE) */}
      {zoomedNote && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Detail Sticky Note"
          onClick={() => setZoomedNote(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: COLOR_MAP[zoomedNote.color].bg,
            }}
            className="relative w-full max-w-sm sm:max-w-md aspect-square p-7 sm:p-10 flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.5)] -rotate-1 rounded-sm animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setZoomedNote(null)}
              aria-label="Tutup Catatan"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Note Full Text */}
            <p className="font-handwriting text-2xl sm:text-3xl font-bold leading-snug text-neutral-900 overflow-y-auto pr-2 mt-4">
              &ldquo;{zoomedNote.message}&rdquo;
            </p>

            {/* Author Name */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-between">
              <span className="font-handwriting text-lg sm:text-xl font-bold text-neutral-800">
                — {zoomedNote.author}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                Sticky Note
              </span>
            </div>

            {/* Corner Fold */}
            <div
              className="absolute right-0 bottom-0 w-10 h-10 shadow-md"
              style={{
                background: `linear-gradient(135deg, transparent 50%, ${COLOR_MAP[zoomedNote.color].fold
                  } 50%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* CREATE NOTE FORM MODAL */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="stick-note-modal-title"
          onClick={() => setIsFormOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 select-none"
        >
          <form
            onSubmit={handlePostNote}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-2xl text-black animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              aria-label="Tutup Form"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3
              id="stick-note-modal-title"
              className="text-2xl font-black tracking-tight text-neutral-950 mb-1"
            >
              Stick a note
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Maksimal 80 karakter. Tuliskan pesan semangat, apresiasi, atau rekomendasi untuk Fahreza.
            </p>

            {/* Message Textarea */}
            <label
              htmlFor="sticky-msg"
              className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider"
            >
              Pesan Kamu
            </label>
            <textarea
              id="sticky-msg"
              maxLength={80}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Contoh: Fahreza jagonya rekayasa AI & problem solving..."
              className="w-full h-24 p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
            />
            <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-1 mb-4">
              <span>{formError && <b className="text-red-500">{formError}</b>}</span>
              <span>{formData.message.length}/80</span>
            </div>

            {/* Nickname Input */}
            <label
              htmlFor="sticky-author"
              className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider"
            >
              Nama Kamu (Opsional)
            </label>
            <input
              id="sticky-author"
              type="text"
              maxLength={20}
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              placeholder="Misal: Budi / Kolega"
              className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black text-sm mb-4"
            />

            {/* Color Swatch Picker */}
            <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
              Pilih Warna Sticky Note
            </label>
            <div className="flex items-center gap-3 mb-6">
              {(["yellow", "salmon", "blue"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: c }))}
                  style={{ backgroundColor: COLOR_MAP[c].swatch }}
                  aria-label={`Warna ${c}`}
                  className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer shadow-sm ${formData.color === c
                      ? "border-black scale-110 shadow-md ring-2 ring-black/20"
                      : "border-neutral-300"
                    }`}
                >
                  {formData.color === c && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!formData.message.trim()}
                className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              >
                Stick it!
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full bg-neutral-900 text-white font-mono text-xs font-medium shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
