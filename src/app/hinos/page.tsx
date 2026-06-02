import { Suspense } from "react";
import { getAllHinos } from "@/lib/hinos";
import { HinosList } from "@/components/HinosList";

export const metadata = {
  title: "Todos os 640 hinos · Harpa Cristã Digital",
  description:
    "Lista completa dos 640 hinos da Harpa Cristã. Busque por título, verso ou palavra. Navegue, favorite e leia offline.",
};

export default function HinosPage() {
  // Pré-renderiza índice leve pra busca (numero, titulo, coro, verses joined)
  const hinos = getAllHinos().map((h) => ({
    numero: h.numero,
    titulo: h.titulo,
    coro: h.coro,
    versesText: h.verses.join(" "),
  }));

  return (
    <main
      id="main"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="hinos-title"
    >
      <div className="mb-6">
        <h1
          id="hinos-title"
          className="text-3xl font-bold text-purple-900 dark:text-purple-50"
        >
          Todos os 640 hinos
        </h1>
        <p className="mt-2 text-purple-700 dark:text-purple-300">
          Busque por título, palavra do coro ou trecho de verso. Use{" "}
          <kbd className="rounded border border-purple-300 bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            /
          </kbd>{" "}
          a qualquer momento para focar a busca. Pressione{" "}
          <kbd className="rounded border border-purple-300 bg-purple-50 px-1.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            Esc
          </kbd>{" "}
          para limpar.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-12 text-center text-purple-500">
            Carregando lista de hinos…
          </div>
        }
      >
        <HinosList hinos={hinos} />
      </Suspense>
    </main>
  );
}
