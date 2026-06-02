"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Atalhos de teclado globais:
 *
 * - "/" → foca o campo de busca (emite evento pro SearchBox auto-focus)
 * - "j" → próximo hino (em /hino/[n])
 * - "k" → hino anterior (em /hino/[n])
 * - "g h" → vai pra home
 * - "g l" → vai pra lista de hinos
 * - "Escape" → blur de inputs / volta atrás
 */
export function KeyboardShortcuts() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchFocusTrigger, setSearchFocusTrigger] = useState(0);

  useEffect(() => {
    let gPressedAt: number | null = null;

    function isTypingInInput(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable
      );
    }

    function handleKey(e: KeyboardEvent) {
      // Ignora se tá digitando em algum input (exceto Esc)
      if (e.key !== "Escape" && isTypingInInput(e.target)) return;
      // Ignora se tem modifier (Ctrl/Cmd/Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // "/" → foca busca
      if (e.key === "/") {
        e.preventDefault();
        setSearchFocusTrigger((n) => n + 1);
        return;
      }

      // Esc → blur inputs / volta
      if (e.key === "Escape") {
        if (isTypingInInput(e.target)) {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Atalhos de navegação (só fora de inputs)
      if (e.key === "j" || e.key === "k") {
        const match = pathname?.match(/^\/hino\/(\d+)$/);
        if (match) {
          e.preventDefault();
          const current = parseInt(match[1], 10);
          const target = e.key === "j" ? current + 1 : current - 1;
          const wrapped = target > 640 ? 1 : target < 1 ? 640 : target;
          router.push(`/hino/${wrapped}`);
        }
        return;
      }

      // "g h" / "g l" (sequência)
      if (e.key === "g") {
        gPressedAt = Date.now();
        return;
      }
      if (gPressedAt && Date.now() - gPressedAt < 1500) {
        if (e.key === "h") {
          e.preventDefault();
          router.push("/");
          gPressedAt = null;
          return;
        }
        if (e.key === "l") {
          e.preventDefault();
          router.push("/hinos");
          gPressedAt = null;
          return;
        }
        if (e.key === "f") {
          e.preventDefault();
          router.push("/favoritos");
          gPressedAt = null;
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pathname, router]);

  return null;
}
