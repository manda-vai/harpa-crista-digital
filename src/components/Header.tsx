"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, BookOpen, Heart } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { useFavoritesCount } from "@/hooks/useFavorites";
import type { HinoIndex } from "@/lib/hinos";

interface HeaderProps {
  searchIndex: HinoIndex[];
}

export function Header({ searchIndex }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const favCount = useFavoritesCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-purple-200/60 bg-white/80 backdrop-blur-md dark:border-purple-900/40 dark:bg-purple-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-100"
          aria-label="Harpa Cristã Digital — página inicial"
        >
          <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden />
          <span className="hidden sm:inline">Harpa Cristã</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchBox hinos={searchIndex} />
        </div>

        <nav className="flex items-center gap-1" aria-label="Navegação principal">
          <Link
            href="/hinos"
            className="rounded-md p-2 text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
            aria-label="Ver todos os 640 hinos"
            title="Todos os hinos (g l)"
          >
            <BookOpen className="h-5 w-5" aria-hidden />
          </Link>

          <Link
            href="/favoritos"
            className="relative rounded-md p-2 text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
            aria-label={`Favoritos${favCount > 0 ? ` (${favCount})` : ""}`}
            title="Favoritos (g f)"
          >
            <Heart className="h-5 w-5" aria-hidden />
            {mounted && favCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>

          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-2 text-purple-700 hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/40"
              aria-label={
                theme === "dark"
                  ? "Mudar para tema claro"
                  : "Mudar para tema escuro"
              }
              title="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden />
              ) : (
                <Moon className="h-5 w-5" aria-hidden />
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
