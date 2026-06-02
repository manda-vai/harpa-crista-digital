"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  addCloudListener,
  getFavoritosSnapshot,
  markSynced,
  mergeFavoritosFromCloud,
} from "@/hooks/useFavorites";
import type { FavoritoRow } from "@/lib/supabase/types";

/**
 * Componente invisível que mantém localStorage <-> Supabase em sincronia.
 *
 * Estratégia:
 * 1. Quando user loga pela primeira vez: pull cloud → merge com local
 *    (cloud + local ficam como union; nada é perdido)
 * 2. A cada mudança LOCAL (toggle, clear): push pro cloud
 * 3. Quando user desloga: nada acontece (localStorage preserva os dados)
 *
 * Renderiza `null` — apenas side-effects.
 */
export function FavoritesSync() {
  const { user } = useAuth();
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user]);

  // Quando user muda: pull cloud (se logado)
  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;

    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    (async () => {
      // Type assertion: idem ao outro effect
      const fromFavoritos = () => supabase.from("favoritos") as any;

      const { data, error } = await fromFavoritos()
        .select("hino_numero")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (error) {
        console.error("[FavoritesSync] pull failed:", error.message);
        return;
      }

      const rows = (data ?? []) as FavoritoRow[];
      const cloudSet = new Set(rows.map((r) => r.hino_numero));
      mergeFavoritosFromCloud(cloudSet);
      markSynced();
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Sincroniza mudanças locais → cloud
  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;

    const supabase = getSupabaseBrowserClient();
    const userId = user.id;

    const unsubscribe = addCloudListener(async (set, source) => {
      if (source !== "local") return; // mudança veio do cloud, não precisa re-uploar

      // Pega snapshot anterior pra detectar diff
      // (não temos histórico, então a estratégia é: deleta tudo do user e re-insere)
      // Em prod seria melhor diff de verdade, mas com 640 hinos máx isso é barato.
      const current = getFavoritosSnapshot();

      // Type assertion: o generic do Database nem sempre propaga bem
      // via .from() chain quando o client é um singleton. Em runtime tá ok.
      const fromFavoritos = () => supabase.from("favoritos") as any;

      const { data: existing, error: fetchErr } = await fromFavoritos()
        .select("hino_numero")
        .eq("user_id", userId);

      if (fetchErr) {
        console.error("[FavoritesSync] fetch err:", fetchErr.message);
        return;
      }

      const existingRows = (existing ?? []) as FavoritoRow[];
      const existingSet = new Set(existingRows.map((r) => r.hino_numero));
      const toAdd = [...current].filter((n) => !existingSet.has(n));
      const toRemove = [...existingSet].filter((n) => !current.has(n));

      if (toAdd.length > 0) {
        const { error: insErr } = await fromFavoritos().insert(
          toAdd.map((hino_numero) => ({ user_id: userId, hino_numero })),
        );
        if (insErr) {
          console.error("[FavoritesSync] insert err:", insErr.message);
        }
      }

      if (toRemove.length > 0) {
        const { error: delErr } = await fromFavoritos()
          .delete()
          .eq("user_id", userId)
          .in("hino_numero", toRemove);
        if (delErr) {
          console.error("[FavoritesSync] delete err:", delErr.message);
        }
      }

      if (toAdd.length > 0 || toRemove.length > 0) {
        markSynced();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return null;
}
