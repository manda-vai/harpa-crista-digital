"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "harpa:favoritos";

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

function ensureGlobal(): Set<number> {
  if (globalFavoritos === null) {
    globalFavoritos = readFavoritos();
  }
  return globalFavoritos;
}

function notify() {
  writeFavoritos(globalFavoritos!);
  listeners.forEach((l) => l());
}

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
    notify();
  }, []);

  const isFavorite = useCallback(
    (numero: number) => favoritos.has(numero),
    [favoritos]
  );

  const clear = useCallback(() => {
    globalFavoritos = new Set();
    notify();
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
