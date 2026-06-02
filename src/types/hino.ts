/**
 * Tipos para os hinos da Harpa Cristã
 *
 * O JSON raw tem estrutura:
 * {
 *   "1": { "hino": "1 - Título", "coro": "...", "verses": { "1": "...", "2": "..." } },
 *   "2": { ... },
 *   "-1": { "Author": "...", "date": "...", "github": "..." }  // metadado
 * }
 *
 * Após processamento (lib/hinos.ts) o Hino tem campos normalizados.
 */

export interface HinoRaw {
  hino: string; // "1 - Chuvas de Graça"
  coro: string; // com <br> HTML
  verses: Record<string, string>; // chaves "1", "2", "3", "4"...
}

export interface Hino {
  numero: number;
  titulo: string;
  coro: string;
  verses: string[];
  /** Texto completo (coro + versos) normalizado para busca */
  fullText: string;
}

export interface HinoMeta {
  autor: string;
  data: string;
  github: string;
  linkedin?: string;
  fonte: string;
  total: number;
}
