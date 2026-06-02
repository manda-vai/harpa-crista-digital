"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { HinoIndex } from "@/lib/hinos";

interface SearchBoxProps {
  /** Hinos carregados pelo pai (server) — evita fetch duplicado */
  hinos: HinoIndex[];
}

/**
 * Search box global com dropdown de resultados.
 *
 * - Debounce de 200ms
 * - Top 5 resultados no dropdown
 * - Enter no input → /hinos?q=...
 * - Click no resultado → /hino/[numero]
 * - Esc → fecha dropdown e limpa
 * - "/" foca o input (atalho global tratado em KeyboardShortcuts)
 */
export function SearchBox({ hinos }: SearchBoxProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Listener global pra "/" focar o input
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Debounce 200ms
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(id);
  }, [query]);

  // Constrói índice Fuse (uma vez)
  const fuse = useMemo(() => {
    return new Fuse(hinos, {
      keys: [
        { name: "titulo", weight: 0.7 },
        { name: "coro", weight: 0.3 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, [hinos]);

  const results = useMemo(() => {
    if (!fuse || debounced.length < 2) return [];
    return fuse.search(debounced, { limit: 5 });
  }, [fuse, debounced]);

  // Reset activeIndex quando resultados mudam
  useEffect(() => {
    setActiveIndex(0);
  }, [debounced]);

  // Fecha dropdown ao clicar fora
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        router.push(`/hino/${results[activeIndex].item.numero}`);
        setQuery("");
        setOpen(false);
      } else if (debounced.length >= 2) {
        router.push(`/hinos?q=${encodeURIComponent(debounced)}`);
        setOpen(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = open && (debounced.length >= 2 || results.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar hino, palavra…"
          aria-label="Buscar hino"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          className="w-full rounded-md border border-purple-200 bg-white/70 py-2 pl-9 pr-9 text-sm text-purple-900 placeholder-purple-400 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-100 dark:placeholder-purple-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-purple-400 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/40"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-purple-200 bg-white shadow-xl dark:border-purple-800 dark:bg-purple-950"
        >
          {results.length === 0 && debounced.length >= 2 && (
            <div className="p-4 text-center text-sm text-purple-500">
              Nenhum hino encontrado para &ldquo;{debounced}&rdquo;
            </div>
          )}

          {results.length > 0 && (
            <>
              <ul>
                {results.map((r, i) => (
                  <li key={r.item.numero} role="option" aria-selected={i === activeIndex}>
                    <Link
                      href={`/hino/${r.item.numero}`}
                      onClick={() => {
                        setQuery("");
                        setOpen(false);
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex items-start gap-3 border-b border-purple-100 px-4 py-3 last:border-0 dark:border-purple-900/40 ${
                        i === activeIndex
                          ? "bg-purple-50 dark:bg-purple-900/40"
                          : "hover:bg-purple-50/60 dark:hover:bg-purple-900/20"
                      }`}
                    >
                      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                        {r.item.numero}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-purple-900 dark:text-purple-100">
                          {r.item.titulo}
                        </div>
                        {r.item.coro && (
                          <div className="mt-0.5 line-clamp-1 text-xs text-purple-600 dark:text-purple-400">
                            {r.item.coro.split("\n")[0]}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-purple-100 bg-purple-50/50 px-4 py-2 dark:border-purple-900/40 dark:bg-purple-950/40">
                <Link
                  href={`/hinos?q=${encodeURIComponent(debounced)}`}
                  onClick={() => setOpen(false)}
                  className="text-xs font-medium text-purple-700 hover:underline dark:text-purple-300"
                >
                  Ver todos os resultados &ldquo;{debounced}&rdquo; →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
