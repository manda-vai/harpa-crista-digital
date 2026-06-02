"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "harpa:favoritos";
const SYNC_KEY = "harpa:favoritos:synced"; // última vez que sincronizou com cloud

function readFavoritos(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr.filter((n) => Number.isInteger(n) && n >= 1 && n <= 640));
  } catch {
    return new Set();
  }
}

function writeFavoritos(set: Set<number>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].sort((a, b) => a - b)));
  } catch {
    // localStorage cheio ou indisponível
  }
}

// Estado global simples (singleton entre hooks)
let globalFavoritos: Set<number> | null = null;
const listeners = new Set<() => void>();

// Listeners "cloud" recebem o set + o source da mudança ("local" | "cloud")
type CloudListener = (set: Set<number>, source: "local" | "cloud") => void;
const cloudListeners = new Set<CloudListener>();

function ensureGlobal(): Set<number> {
  if (globalFavoritos === null) {
    globalFavoritos = readFavoritos();
  }
  return globalFavoritos;
}

function notify(source: "local" | "cloud" = "local") {
  if (source === "local") {
    writeFavoritos(globalFavoritos!);
  }
  listeners.forEach((l) => l());
  cloudListeners.forEach((l) => l(globalFavoritos!, source));
}

// =================================================================
// API pública (mesma da Sprint 1, mantida pra não quebrar consumers)
// =================================================================
export function useFavorites() {
  const [favoritos, setFavoritos] = useState<Set<number>>(() => ensureGlobal());

  useEffect(() => {
    const listener = () => setFavoritos(new Set(globalFavoritos!));
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Sincroniza entre abas
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        globalFavoritos = readFavoritos();
        listeners.forEach((l) => l());
        // Não notifica cloudListeners (mudança veio de outra aba, não do user)
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((numero: number) => {
    const set = ensureGlobal();
    if (set.has(numero)) {
      set.delete(numero);
    } else {
      set.add(numero);
    }
    notify("local");
  }, []);

  const isFavorite = useCallback(
    (numero: number) => favoritos.has(numero),
    [favoritos],
  );

  const clear = useCallback(() => {
    globalFavoritos = new Set();
    notify("local");
  }, []);

  return { favoritos, toggle, isFavorite, clear };
}

export function useFavoritesCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const listener = () => setCount(globalFavoritos?.size ?? 0);
    listener();
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return count;
}

// =================================================================
// API estendida (Sprint 2 — usada pelo FavoritesSync pra cloud)
// =================================================================

/** Lê o set atual (snapshot) sem se inscrever em mudanças. */
export function getFavoritosSnapshot(): Set<number> {
  return new Set(ensureGlobal());
}

/** Substitui o estado global por um novo set (típico: merge com cloud).
 * Notifica listeners como source="cloud" pra que o sync saiba que NÃO precisa re-uploar. */
export function replaceFavoritosGlobal(next: Set<number>): void {
  globalFavoritos = new Set(next);
  notify("cloud");
}

/** Faz merge union com cloud (não remove locais que o cloud não tem).
 * Útil no primeiro login: traz tudo do cloud sem perder nada do local. */
export function mergeFavoritosFromCloud(cloud: Set<number>): void {
  const merged = new Set([...ensureGlobal(), ...cloud]);
  if (merged.size === ensureGlobal().size) return; // nada novo
  globalFavoritos = merged;
  notify("cloud");
}

/** Inscreve um listener que recebe (set, source) a cada mudança. */
export function addCloudListener(fn: CloudListener): () => void {
  cloudListeners.add(fn);
  return () => {
    cloudListeners.delete(fn);
  };
}

/** Marca que acabou de sincronizar (pra evitar loop). */
export function markSynced(): void {
  try {
    localStorage.setItem(SYNC_KEY, new Date().toISOString());
  } catch {}
}

export function getLastSync(): string | null {
  try {
    return localStorage.getItem(SYNC_KEY);
  } catch {
    return null;
  }
}
