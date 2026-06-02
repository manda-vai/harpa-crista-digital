/* eslint-disable no-restricted-globals */
/**
 * Harpa Cristã Digital — Service Worker (PWA offline)
 *
 * Estratégia: cache-first para conteúdo estático + páginas pré-renderizadas.
 * Como os 640 hinos são gerados em build (SSG), todos são cacheáveis.
 *
 * Versão do cache — bump para forçar atualização
 */
const CACHE_VERSION = "v1.0.0";
const STATIC_CACHE = `harpa-static-${CACHE_VERSION}`;
const PAGES_CACHE = `harpa-pages-${CACHE_VERSION}`;

// Recursos críticos pra shell da app
const PRECACHE_URLS = [
  "/",
  "/hinos",
  "/favoritos",
  "/manifest.webmanifest",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/icons/icon-maskable.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES_CACHE);
      // Tenta pré-cachear; se falhar (offline no install), segue
      await Promise.allSettled(PRECACHE_URLS.map((u) => cache.add(u)));
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Limpa caches antigos
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGES_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Só intercepta GET do mesmo origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Páginas HTML: cache-first com fallback network
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(pageStrategy(request));
    return;
  }

  // Assets estáticos (_next/static, /icons/, manifest): cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(staticStrategy(request));
    return;
  }

  // Resto: network-first, fallback cache
  event.respondWith(networkFirstStrategy(request));
});

async function pageStrategy(request) {
  const cache = await caches.open(PAGES_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    // Atualiza em background (stale-while-revalidate)
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) cache.put(request, res.clone());
      })
      .catch(() => {});
    return cached;
  }
  try {
    const res = await fetch(request);
    if (res && res.status === 200) cache.put(request, res.clone());
    return res;
  } catch (err) {
    // Fallback offline
    const offline = await cache.match("/");
    if (offline) return offline;
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function staticStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res && res.status === 200) cache.put(request, res.clone());
    return res;
  } catch (err) {
    return new Response("Asset offline", { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.status === 200) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}
