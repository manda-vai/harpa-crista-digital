"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === "auth-callback-failed"
      ? "Falha ao confirmar o link. Tente de novo."
      : null,
  );
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Email inválido.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    startTransition(async () => {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSent(true);
    });
  }

  return (
    <div className="rounded-2xl border border-purple-200/60 bg-white/80 p-8 shadow-lg backdrop-blur dark:border-purple-900/40 dark:bg-purple-950/50">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-purple-100 p-2.5 dark:bg-purple-900/50">
          <Mail className="h-5 w-5 text-purple-700 dark:text-purple-300" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-purple-950 dark:text-purple-50">
          Entrar
        </h1>
      </div>

      {sent ? (
        <div className="space-y-3" role="status">
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Link enviado!</p>
              <p className="mt-1">
                Confirme no email <strong>{email}</strong> pra entrar. O link
                expira em 1 hora.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="text-sm text-purple-700 hover:underline dark:text-purple-300"
          >
            Usar outro email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            Vamos te enviar um link mágico por email. Sem senha pra lembrar.
          </p>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-purple-900 dark:text-purple-100"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-purple-300 bg-white px-4 py-2.5 text-purple-950 placeholder:text-purple-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 disabled:opacity-60 dark:border-purple-700 dark:bg-purple-950/50 dark:text-purple-50"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !email}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Enviando...
              </>
            ) : (
              "Enviar link de acesso"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="rounded-2xl border border-purple-200/60 bg-white/80 p-8 shadow-lg backdrop-blur dark:border-purple-900/40 dark:bg-purple-950/50">
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" aria-hidden />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col justify-center px-4 py-12"
    >
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-purple-700 hover:underline dark:text-purple-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar
      </Link>

      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-xs text-purple-700/70 dark:text-purple-300/70">
        Ao entrar, seus favoritos são sincronizados entre todos os seus
        dispositivos.
      </p>
    </main>
  );
}
