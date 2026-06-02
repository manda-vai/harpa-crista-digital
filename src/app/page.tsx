import Link from "next/link";
import { getAllHinos, getMeta, getTotalHinos } from "@/lib/hinos";
import { Music, Search, Heart, BookOpen } from "lucide-react";

export default function HomePage() {
  const hinos = getAllHinos();
  const meta = getMeta();
  const total = getTotalHinos();
  const algunsHinos = hinos.slice(0, 10);

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <header className="mb-12 text-center">
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
      </header>

      {/* Feature cards */}
      <section
        className="mb-12 grid gap-4 sm:grid-cols-3"
        aria-label="Funcionalidades"
      >
        <FeatureCard
          icon={<Search className="h-6 w-6" />}
          title="Busca completa"
          description="Por título, número ou conteúdo da letra"
        />
        <FeatureCard
          icon={<Heart className="h-6 w-6" />}
          title="Favoritos"
          description="Seus hinos favoritos em todos os devices"
        />
        <FeatureCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Leitura limpa"
          description="Tipografia otimizada pra leitura"
        />
      </section>

      {/* Hino 1 destaque */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Comece a ler</h2>
        <Link
          href="/hino/1"
          className="block rounded-lg border p-6 transition-colors hover:bg-[var(--color-primary-50)]"
          style={{ borderColor: "var(--color-primary-200)" }}
        >
          <div className="flex items-center gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ background: "var(--color-primary)" }}
            >
              1
            </span>
            <div>
              <div className="text-xl font-semibold">
                {hinos[0].titulo}
              </div>
              <div className="text-sm opacity-70">Toque pra abrir o hino</div>
            </div>
          </div>
        </Link>
      </section>

      {/* Primeiros 10 hinos */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Primeiros {algunsHinos.length} hinos
        </h2>
        <ul className="divide-y" style={{ borderColor: "var(--color-primary-200)" }}>
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
      </section>

      {/* Atribuição */}
      <footer className="mt-16 border-t pt-6 text-sm opacity-70">
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
