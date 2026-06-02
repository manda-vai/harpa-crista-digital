"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { ChevronRight, Search } from "lucide-react";
import type { Hino } from "@/types/hino";

interface HinoListItem {
  numero: number;
  titulo: string;
  coro: string;
  versesText: string;
}

interface HinosListProps {
  hinos: HinoListItem[];
}

export function HinosList({ hinos }: HinosListProps) {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);

  // Atualiza o input quando a URL muda (ex: navegou de /hinos?q=foo)
  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  // Atualiza a URL com debounce
  useEffect(() => {
    const id = setTimeout(() => {
      const url = new URL(window.location.href);
      if (query) {
        url.searchParams.set("q", query);
      } else {
        url.searchParams.delete("q");
      }
      // Não dispara navegação completa, só substitui o history
      window.history.replaceState(null, "", url.toString());
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  const fuse = useMemo(
    () =>
      new Fuse(hinos, {
        keys: [
          { name: "titulo", weight: 0.6 },
          { name: "coro", weight: 0.25 },
          { name: "versesText", weight: 0.15 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
        includeScore: true,
      }),
    [hinos]
  );

  const filtered = useMemo(() => {
    if (query.trim().length < 2) {
      return hinos; // todos os 640
    }
    return fuse.search(query, { limit: 200 }).map((r) => r.item);
  }, [fuse, query, hinos]);

  return (
    <div>
      {/* Input de busca local (redundante com header, mas útil pra mobile sticky) */}
      <div className="mb-6 sm:hidden">
        <label htmlFor="hinos-search" className="sr-only">
          Buscar hino
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400"
            aria-hidden
          />
          <input
            id="hinos-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nos 640 hinos…"
            className="w-full rounded-md border border-purple-200 bg-white py-2 pl-9 pr-3 text-sm text-purple-900 placeholder-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-100"
          />
        </div>
      </div>

      <div
        className="mb-4 flex items-center justify-between text-sm text-purple-600 dark:text-purple-400"
        aria-live="polite"
      >
        <span>
          {query.trim().length < 2
            ? `Mostrando todos os ${hinos.length} hinos`
            : `${filtered.length} resultado${filtered.length === 1 ? "" : "s"} para "${query}"`}
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-purple-700 hover:underline dark:text-purple-300"
          >
            Limpar
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-purple-300 bg-purple-50/40 p-8 text-center dark:border-purple-700 dark:bg-purple-950/40">
          <p className="text-purple-700 dark:text-purple-300">
            Nenhum hino encontrado para &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
            Tente outra palavra ou reduza o termo.
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {query.trim().length < 2 ? (
            // Modo browse: CSS columns (1-4 cols)
            <ul
              className="columns-1 gap-x-6 sm:columns-2 md:columns-3 lg:columns-4"
              aria-label="Lista dos 640 hinos"
            >
              {hinos.map((h) => (
                <HinoListItem key={h.numero} hino={h} />
              ))}
            </ul>
          ) : (
            // Modo busca: lista simples (single column)
            <ul
              className="divide-y divide-purple-100 rounded-lg border border-purple-200 bg-white dark:divide-purple-900/40 dark:border-purple-800 dark:bg-purple-950/30"
              aria-label={`Resultados de busca para ${query}`}
            >
              {filtered.map((h) => (
                <HinoListItem key={h.numero} hino={h} showCoro />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function HinoListItem({
  hino,
  showCoro = false,
}: {
  hino: HinoListItem;
  showCoro?: boolean;
}) {
  return (
    <li className="break-inside-avoid">
      <Link
        href={`/hino/${hino.numero}`}
        className="group flex items-start gap-2 rounded-md px-2 py-1.5 text-sm text-purple-800 hover:bg-purple-100 dark:text-purple-200 dark:hover:bg-purple-900/40"
      >
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-[11px] font-bold text-purple-700 group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-900/40 dark:text-purple-300">
          {hino.numero}
        </span>
        <span className="flex-1 truncate font-medium">{hino.titulo}</span>
        {showCoro && hino.coro && (
          <span className="hidden text-xs text-purple-500 dark:text-purple-400 md:inline">
            {hino.coro.split("\n")[0].slice(0, 40)}
            {hino.coro.length > 40 ? "…" : ""}
          </span>
        )}
        <ChevronRight
          className="h-4 w-4 flex-shrink-0 text-purple-300 group-hover:text-purple-600 dark:text-purple-600 dark:group-hover:text-purple-300"
          aria-hidden
        />
      </Link>
    </li>
  );
}
