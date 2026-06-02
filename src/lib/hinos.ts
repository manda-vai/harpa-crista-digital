import type { Hino, HinoMeta, HinoRaw } from "@/types/hino";
import rawData from "@/data/harpa_crista_640_hinos.json";

/**
 * Carrega e normaliza os 640 hinos da Harpa Cristã.
 *
 * - Lê o JSON estático (build-time embed)
 * - Normaliza `<br>` HTML → `\n` (XSS-safe, sem dangerouslySetInnerHTML)
 * - Valida que há 640 hinos (1..640)
 * - Extrai metadados da chave "-1"
 */

const RAW = rawData as Record<string, HinoRaw | Record<string, string>>;

const FONTE =
  "https://github.com/DanielLiberato/Harpa-Crista-JSON-640-Hinos-Completa";

function normalize(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

function extractNumberFromTitle(hinoField: string): number {
  // "1 - Chuvas de Graça" → 1
  const match = hinoField.match(/^(\d+)\s*-/);
  return match ? Number.parseInt(match[1], 10) : NaN;
}

function extractTitle(hinoField: string): string {
  return hinoField.replace(/^\d+\s*-\s*/, "").trim();
}

/**
 * Cria o Hino a partir do objeto raw. Lança erro se inválido.
 */
function buildHino(numero: number, raw: HinoRaw): Hino {
  if (!raw.hino || raw.coro === undefined || !raw.verses) {
    throw new Error(
      `Hino ${numero} inválido: campos faltando (hino, coro ou verses)`
    );
  }

  const expectedNumero = extractNumberFromTitle(raw.hino);
  if (expectedNumero !== numero) {
    throw new Error(
      `Hino ${numero} tem número errado no título: "${raw.hino}"`
    );
  }

  // Converte verses pra array ordenado ["1", "2", "3", ...]
  // Filtra versos vazios
  const verses = Object.keys(raw.verses)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => normalize(raw.verses[k]))
    .filter((v) => v.length > 0);

  const coro = normalize(raw.coro);
  const titulo = extractTitle(raw.hino);

  const fullText = [titulo, coro, ...verses].join("\n").toLowerCase();

  return { numero, titulo, coro, verses, fullText };
}

/** Carrega todos os hinos (chamado uma vez no module load) */
function loadAllHinos(): Hino[] {
  const result: Hino[] = [];
  for (let n = 1; n <= 640; n++) {
    const raw = RAW[String(n)] as HinoRaw | undefined;
    if (!raw) {
      throw new Error(`Hino ${n} não encontrado no JSON`);
    }
    result.push(buildHino(n, raw));
  }
  return result;
}

/** Extrai metadados do dataset */
function loadMeta(): HinoMeta {
  const metaRaw = RAW["-1"] as Record<string, string> | undefined;
  if (!metaRaw) {
    throw new Error("Metadado chave '-1' não encontrado no JSON");
  }
  return {
    autor: metaRaw.Author || metaRaw.autor || "Daniel Liberato da Silva",
    data: metaRaw.date || metaRaw.data || "2023-11-11",
    github:
      metaRaw.github ||
      "https://github.com/DanielLiberato/Harpa-Crista-JSON-640-Hinos-Completa",
    linkedin: metaRaw.linkedin,
    fonte: FONTE,
    total: 640,
  };
}

// Carrega uma vez no module init
const HINOS: Hino[] = loadAllHinos();
const META: HinoMeta = loadMeta();

/** Retorna todos os 640 hinos */
export function getAllHinos(): Hino[] {
  return HINOS;
}

/** Retorna os metadados do dataset (autor, fonte, etc) */
export function getMeta(): HinoMeta {
  return META;
}

/** Retorna um hino pelo número (1-640). Lança se não existir. */
export function getHinoByNumero(numero: number): Hino {
  if (!Number.isInteger(numero) || numero < 1 || numero > 640) {
    throw new Error(`Número de hino inválido: ${numero}`);
  }
  return HINOS[numero - 1];
}

/** Total de hinos (sempre 640) */
export function getTotalHinos(): number {
  return HINOS.length;
}

/** Calcula o hino anterior (com wrap: 1 → 640) */
export function getHinoAnterior(numero: number): number {
  return numero === 1 ? 640 : numero - 1;
}

/** Calcula o próximo hino (com wrap: 640 → 1) */
export function getHinoProximo(numero: number): number {
  return numero === 640 ? 1 : numero + 1;
}
