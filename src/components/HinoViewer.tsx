import type { Hino } from "@/types/hino";

/**
 * Renderiza um hino: número, título, coro e versos.
 * Respeita WCAG 2.2 AA+ — semântica, contraste, focus, etc.
 */
export function HinoViewer({ hino }: { hino: Hino }) {
  return (
    <article aria-labelledby={`hino-${hino.numero}-titulo`}>
      <header className="mb-8 text-center">
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ background: "var(--color-primary)" }}
          aria-hidden="true"
        >
          {hino.numero}
        </div>
        <h1
          id={`hino-${hino.numero}-titulo`}
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {hino.titulo}
        </h1>
      </header>

      {/* Coro (destaque) */}
      {hino.coro && (
        <section
          className="mb-8 rounded-lg p-6"
          style={{
            background: "var(--color-primary-50)",
            borderLeft: "4px solid var(--color-cta)",
          }}
          aria-labelledby={`hino-${hino.numero}-coro`}
        >
          <h2
            id={`hino-${hino.numero}-coro`}
            className="mb-2 text-sm font-semibold uppercase tracking-wide"
            style={{ color: "var(--color-primary-700)" }}
          >
            Coro
          </h2>
          <p
            className="whitespace-pre-line text-lg leading-relaxed italic"
            style={{ color: "var(--color-primary-900)" }}
          >
            {hino.coro}
          </p>
        </section>
      )}

      {/* Versos */}
      <section
        aria-label="Versos"
        className="space-y-6"
      >
        {hino.verses.map((verso, idx) => (
          <div key={idx} className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: "var(--color-primary-100)",
                color: "var(--color-primary-900)",
              }}
              aria-hidden="true"
            >
              {idx + 1}
            </span>
            <p className="whitespace-pre-line text-lg leading-relaxed">
              {verso}
            </p>
          </div>
        ))}
      </section>
    </article>
  );
}
