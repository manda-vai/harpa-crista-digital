import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getHinoByNumero,
  getHinoAnterior,
  getHinoProximo,
  getTotalHinos,
} from "@/lib/hinos";
import { HinoViewer } from "@/components/HinoViewer";

export async function generateStaticParams() {
  // Pre-renderiza todas as 640 páginas em build time
  return Array.from({ length: 640 }, (_, i) => ({
    numero: String(i + 1),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const n = Number.parseInt(numero, 10);
  if (!Number.isInteger(n) || n < 1 || n > 640) {
    return { title: "Hino não encontrado" };
  }
  const h = getHinoByNumero(n);
  return {
    title: `${h.numero} - ${h.titulo}`,
    description: `Hino ${h.numero} da Harpa Cristã: ${h.titulo}`,
  };
}

export default async function HinoPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const n = Number.parseInt(numero, 10);
  if (!Number.isInteger(n) || n < 1 || n > 640) {
    notFound();
  }
  const hino = getHinoByNumero(n);
  const anterior = getHinoAnterior(hino.numero);
  const proximo = getHinoProximo(hino.numero);
  const total = getTotalHinos();

  return (
    <main
      id="main"
      className="mx-auto max-w-3xl px-4 py-6 sm:py-10"
    >
      {/* Top bar: voltar + navegação */}
      <nav
        className="mb-6 flex items-center justify-between"
        aria-label="Navegação entre hinos"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Início
        </Link>
        <div className="text-sm opacity-70">
          {hino.numero} / {total}
        </div>
      </nav>

      <HinoViewer hino={hino} />

      {/* Bottom navigation: anterior/próximo */}
      <nav
        className="mt-10 flex items-center justify-between gap-2"
        aria-label="Navegação anterior e próximo"
      >
        <Link
          href={`/hino/${anterior}`}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors hover:bg-[var(--color-primary-50)]"
          style={{ borderColor: "var(--color-primary-300)" }}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{anterior}</span>
        </Link>
        <Link
          href={`/hino/${proximo}`}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          <span className="hidden sm:inline">{proximo}</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}
