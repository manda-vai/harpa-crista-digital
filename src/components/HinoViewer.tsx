"use client";

import { useEffect, useState } from "react";
import { Heart, Maximize2, Minimize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useFontSize } from "@/hooks/useFontSize";
import type { Hino } from "@/types/hino";

interface HinoViewerProps {
  hino: Hino;
}

/**
 * Renderiza um hino com controles de leitura:
 * - Font size (A- / A / A+)
 * - Fullscreen (tela cheia)
 * - Favoritar (localStorage; Sprint 2 sincroniza com Supabase)
 */
export function HinoViewer({ hino }: HinoViewerProps) {
  const { isFavorite, toggle } = useFavorites();
  const { size, increase, decrease, reset } = useFontSize();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fav = isFavorite(hino.numero);

  // Listener de mudança de fullscreen (Esc pelo browser, etc) — registrado 1x
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function toggleFullscreen() {
    const el = document.getElementById(`hino-${hino.numero}-article`);
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }

  return (
    <article
      id={`hino-${hino.numero}-article`}
      aria-labelledby={`hino-${hino.numero}-titulo`}
      className="hino-viewer relative"
      style={{ fontSize: `${size}rem` }}
    >
      {/* Toolbar de leitura */}
      <div
        className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-purple-200 bg-white/60 p-2 dark:border-purple-800 dark:bg-purple-950/30"
        role="toolbar"
        aria-label="Controles de leitura"
      >
        {/* Font size controls */}
        <div className="flex items-center gap-1" role="group" aria-label="Tamanho da fonte">
          <button
            type="button"
            onClick={decrease}
            disabled={size <= 0.875}
            className="rounded-md p-1.5 text-purple-700 hover:bg-purple-100 disabled:opacity-30 dark:text-purple-300 dark:hover:bg-purple-900/40"
            aria-label="Diminuir fonte"
            title="Diminuir fonte"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md px-2 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
            aria-label={`Resetar fonte (atual: ${size.toFixed(2)}rem)`}
            title="Resetar fonte"
          >
            <span className="text-base font-bold">A</span>
            <RotateCcw className="ml-1 inline h-3 w-3" aria-hidden />
          </button>
          <button
            type="button"
            onClick={increase}
            disabled={size >= 1.5}
            className="rounded-md p-1.5 text-purple-700 hover:bg-purple-100 disabled:opacity-30 dark:text-purple-300 dark:hover:bg-purple-900/40"
            aria-label="Aumentar fonte"
            title="Aumentar fonte"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-md p-1.5 text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
            aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden />
            )}
          </button>

          {/* Favoritar */}
          <button
            type="button"
            onClick={() => toggle(hino.numero)}
            className={`rounded-md p-1.5 transition-colors ${
              fav
                ? "bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
                : "text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
            }`}
            aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            aria-pressed={fav}
            title={fav ? "Remover dos favoritos" : "Favoritar"}
          >
            <Heart
              className="h-4 w-4"
              fill={fav ? "currentColor" : "none"}
              aria-hidden
            />
          </button>
        </div>
      </div>

      <header className="mb-8 text-center">
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ background: "var(--color-primary)" }}
          aria-hidden="true"
        >
          {hino.numero}
        </div>
        <h1
          id={`hino-${hino.numero}-titulo`}
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {hino.titulo}
        </h1>
      </header>

      {/* Coro (destaque) */}
      {hino.coro && (
        <section
          className="mb-8 rounded-lg p-6"
          style={{
            background: "var(--color-primary-50)",
            borderLeft: "4px solid var(--color-cta)",
          }}
          aria-labelledby={`hino-${hino.numero}-coro`}
        >
          <h2
            id={`hino-${hino.numero}-coro`}
            className="mb-2 text-sm font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-primary-700)" }}
          >
            Coro
          </h2>
          <p
            className="whitespace-pre-line text-lg leading-relaxed italic"
            style={{ color: "var(--color-primary-900)" }}
          >
            {hino.coro}
          </p>
        </section>
      )}

      {/* Versos */}
      <section aria-label="Versos" className="space-y-6">
        {hino.verses.map((verso, idx) => (
          <div key={idx} className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: "var(--color-primary-100)",
                color: "var(--color-primary-900)",
              }}
              aria-hidden="true"
            >
              {idx + 1}
            </span>
            <p className="whitespace-pre-line text-lg leading-relaxed">
              {verso}
            </p>
          </div>
        ))}
      </section>
    </article>
  );
}
