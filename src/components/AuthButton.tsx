"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { LogIn, LogOut, Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthButton() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function handleLogout() {
    if (typeof window === "undefined") return;
    const supabase = getSupabaseBrowserClient();
    startTransition(async () => {
      await supabase.auth.signOut();
      setOpen(false);
    });
  }

  if (loading) {
    return (
      <div
        className="rounded-md p-2 text-purple-700 dark:text-purple-300"
        aria-hidden
      >
        <Loader2 className="h-5 w-5 animate-spin opacity-40" />
      </div>
    );
  }

  // Logado: avatar + menu dropdown
  if (user) {
    const avatar = user.user_metadata?.avatar_url as string | undefined;
    const name =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Usuário";

    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={`Menu da conta (${name})`}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full p-1 hover:bg-purple-100 dark:hover:bg-purple-900/40"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-7 w-7 rounded-full object-cover ring-2 ring-purple-500/30"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-amber-500 text-xs font-bold text-white">
              {name[0]?.toUpperCase()}
            </span>
          )}
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-purple-200 bg-white shadow-xl dark:border-purple-800 dark:bg-purple-950"
          >
            <div className="border-b border-purple-100 px-4 py-3 dark:border-purple-900">
              <p className="truncate text-sm font-semibold text-purple-950 dark:text-purple-50">
                {name}
              </p>
              <p className="truncate text-xs text-purple-600 dark:text-purple-400">
                {user.email}
              </p>
            </div>
            <div className="p-1">
              <p className="flex items-center gap-2 px-3 py-2 text-xs text-purple-700 dark:text-purple-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sincronização ativa
              </p>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50 disabled:opacity-60 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <LogOut className="h-4 w-4" aria-hidden />
                )}
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Deslogado: botão "Entrar"
  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
      aria-label="Entrar com email"
    >
      <LogIn className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Entrar</span>
    </Link>
  );
}
