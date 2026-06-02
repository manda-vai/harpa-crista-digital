import Link from "next/link";
import { getAllHinos, getMeta, getTotalHinos } from "@/lib/hinos";
import { Music, Search, Heart, BookOpen, ArrowRight } from "lucide-react";

export default function HomePage() {
  const hinos = getAllHinos();
  const meta = getMeta();
  const total = getTotalHinos();
  const algunsHinos = hinos.slice(0, 10);

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      {/* Hero */}
      <header className="mb-10 text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--color-primary)" }}
        >
          <Music className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Harpa Cristã Digital
        </h1>
        <p className="text-lg opacity-80">
          {total} hinos com busca, favoritos e modo offline
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/hinos"
            className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Ver todos os 640 hinos
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/hino/1"
            className="inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors hover:bg-[var(--color-primary-50)]"
            style={{ borderColor: "var(--color-primary-300)" }}
          >
            Começar pelo Hino 1
          </Link>
        </div>
      </header>

      {/* Feature cards */}
      <section
        className="mb-10 grid gap-4 sm:grid-cols-3"
        aria-label="Funcionalidades"
      >
        <FeatureCard
          icon={<Search className="h-6 w-6" />}
          title="Busca completa"
          description="Por título, palavra do coro ou verso"
        />
        <FeatureCard
          icon={<Heart className="h-6 w-6" />}
          title="Favoritos locais"
          description="Seus hinos salvos no dispositivo"
        />
        <FeatureCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Offline"
          description="Funciona sem internet depois do 1º acesso"
        />
      </section>

      {/* Atalho: ir para um hino específico */}
      <section className="mb-10 rounded-lg border border-purple-200 bg-white/60 p-4 dark:border-purple-800 dark:bg-purple-950/30">
        <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
          💡 Dica: pressione{" "}
          <kbd className="rounded border border-purple-300 bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            /
          </kbd>{" "}
          a qualquer momento para buscar,{" "}
          <kbd className="rounded border border-purple-300 bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            j
          </kbd>
          /
          <kbd className="rounded border border-purple-300 bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            k
          </kbd>{" "}
          pra navegar entre hinos,{" "}
          <kbd className="rounded border border-purple-300 bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            g l
          </kbd>{" "}
          pra lista.
        </p>
      </section>

      {/* Primeiros 10 hinos */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">
          Primeiros {algunsHinos.length} hinos
        </h2>
        <ul
          className="divide-y"
          style={{ borderColor: "var(--color-primary-200)" }}
        >
          {algunsHinos.map((h) => (
            <li key={h.numero}>
              <Link
                href={`/hino/${h.numero}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-[var(--color-primary-50)]"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold"
                  style={{
                    background: "var(--color-primary-100)",
                    color: "var(--color-primary-900)",
                  }}
                >
                  {h.numero}
                </span>
                <span className="font-medium">{h.titulo}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-center">
          <Link
            href="/hinos"
            className="text-sm font-medium text-purple-700 hover:underline dark:text-purple-300"
          >
            Ver todos os 640 →
          </Link>
        </div>
      </section>

      {/* Atribuição */}
      <footer className="mt-12 border-t pt-6 text-sm opacity-70">
        <p>
          Dados:{" "}
          <a
            href={meta.fonte}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Harpa-Crista-JSON-640-Hinos-Completa
          </a>{" "}
          por {meta.autor} · Licença MIT
        </p>
        <p className="mt-1">
          Feito com 💜 por Silas · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article
      className="rounded-lg border p-4"
      style={{ borderColor: "var(--color-primary-200)" }}
    >
      <div
        className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-white"
        style={{ background: "var(--color-primary)" }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm opacity-70">{description}</p>
    </article>
  );
}
