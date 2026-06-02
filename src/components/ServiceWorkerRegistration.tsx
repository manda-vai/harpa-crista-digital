"use client";

import { useEffect } from "react";

/**
 * Registra o service worker PWA (public/sw.js).
 * - Idempotente
 * - Atualiza automaticamente em nova versão
 * - Falha silenciosa se SW não suportado
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Só registra em produção (dev mode tem cache que atrapalha)
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        // Verifica updates a cada carregamento
        reg.update();
      } catch (err) {
        console.warn("[SW] Falha ao registrar:", err);
      }
    };

    register();
  }, []);

  return null;
}
