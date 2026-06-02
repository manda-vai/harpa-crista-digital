"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getAllHinos } from "@/lib/hinos";
import { ChevronRight, Heart, Trash2 } from "lucide-react";

export function FavoritosList() {
  const { favoritos, clear } = useFavorites();
  const hinos = useMemo(() => getAllHinos(), []);

  // Mapeia numero → hino (pra pegar título)
  const hinosByNumero = useMemo(() => {
    const map = new Map<number, (typeof hinos)[number]>();
    hinos.forEach((h) => map.set(h.numero, h));
    return map;
  }, [hinos]);

  const sorted = useMemo(() => {
    return [...favoritos].sort((a, b) => a - b);
  }, [favoritos]);

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-purple-300 bg-purple-50/40 p-12 text-center dark:border-purple-700 dark:bg-purple-950/40">
        <Heart
          className="mx-auto mb-4 h-12 w-12 text-purple-300 dark:text-purple-700"
          aria-hidden
        />
        <h2 className="mb-2 text-xl font-semibold text-purple-900 dark:text-purple-100">
          Nenhum favorito ainda
        </h2>
        <p className="mb-4 text-sm text-purple-600 dark:text-purple-400">
          Toque no ícone de coração em qualquer hino pra favoritar.
        </p>
        <Link
          href="/hinos"
          className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          Ver hinos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-purple-600 dark:text-purple-400">
          {sorted.length} hino{sorted.length === 1 ? "" : "s"} favoritado
          {sorted.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={() => {
            if (confirm("Remover todos os favoritos?")) clear();
          }}
          className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-rose-600 dark:text-purple-400 dark:hover:text-rose-400"
        >
          <Trash2 className="h-3 w-3" aria-hidden />
          Limpar tudo
        </button>
      </div>
      <ul
        className="divide-y divide-purple-100 rounded-lg border border-purple-200 bg-white dark:divide-purple-900/40 dark:border-purple-800 dark:bg-purple-950/30"
        aria-label="Lista de favoritos"
      >
        {sorted.map((n) => {
          const h = hinosByNumero.get(n);
          if (!h) return null;
          return (
            <li key={n}>
              <Link
                href={`/hino/${n}`}
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/40"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                  {n}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-purple-900 dark:text-purple-100">
                    {h.titulo}
                  </div>
                  {h.coro && (
                    <div className="mt-0.5 truncate text-xs text-purple-600 dark:text-purple-400">
                      {h.coro.split("\n")[0]}
                    </div>
                  )}
                </div>
                <ChevronRight
                  className="h-5 w-5 flex-shrink-0 text-purple-300 group-hover:text-purple-600 dark:text-purple-600 dark:group-hover:text-purple-300"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
