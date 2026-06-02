import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center"
    >
      <p
        className="mb-4 text-7xl font-bold"
        style={{ color: "var(--color-primary)" }}
      >
        404
      </p>
      <h1 className="mb-2 text-2xl font-bold">Hino não encontrado</h1>
      <p className="mb-6 opacity-70">
        Esse número de hino não existe na Harpa Cristã. Os hinos vão de 1 a
        640.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-full px-6 font-semibold text-white"
        style={{ background: "var(--color-primary)" }}
      >
        Voltar ao início
      </Link>
    </main>
  );
}
