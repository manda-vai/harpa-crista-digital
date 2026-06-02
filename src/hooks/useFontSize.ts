"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "harpa:fontSize";
const MIN = 0.875; // 14px
const MAX = 1.5; // 24px
const STEP = 0.125; // 2px
const DEFAULT = 1.0; // 16px

function read(): number {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const v = parseFloat(raw);
    if (Number.isFinite(v) && v >= MIN && v <= MAX) return v;
  } catch {
    // ignore
  }
  return DEFAULT;
}

export function useFontSize() {
  const [size, setSize] = useState(DEFAULT);

  useEffect(() => {
    setSize(read());
  }, []);

  const update = useCallback((next: number) => {
    const clamped = Math.max(MIN, Math.min(MAX, next));
    setSize(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(clamped));
    } catch {
      // ignore
    }
  }, []);

  const increase = useCallback(() => update(Math.round((size + STEP) * 1000) / 1000), [size, update]);
  const decrease = useCallback(() => update(Math.round((size - STEP) * 1000) / 1000), [size, update]);
  const reset = useCallback(() => update(DEFAULT), [update]);

  return { size, increase, decrease, reset, min: MIN, max: MAX, default: DEFAULT };
}
