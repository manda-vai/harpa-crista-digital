# Harpa Cristã Digital

Os 640 hinos da Harpa Cristã (Assembleia de Deus) em uma PWA moderna, com
busca, favoritos, modo offline e instalável.

## ✨ Features

- 📖 **640 hinos completos** (1-640)
- 🔍 **Busca fuzzy** por título, número ou conteúdo
- ❤️ **Favoritos** com sync via Supabase
- 🌙 **Dark mode** com detecção automática
- 📱 **PWA** instalável (offline-first)
- 🤖 **App Android** (Sprint 3 — via TWA)
- ♿ **WCAG 2.2 AA+** (acessibilidade)

## 🛠 Stack

- [Next.js 16](https://nextjs.org/) + TypeScript + Tailwind v4
- [Supabase](https://supabase.com/) (auth + DB de favoritos)
- [Fuse.js](https://www.fusejs.io/) (busca fuzzy)
- [next-themes](https://github.com/pacocoursey/next-themes) (dark mode)
- [shadcn/ui](https://ui.shadcn.com/) (em breve)

## 🚀 Como rodar

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## 📂 Estrutura

```
src/
├── app/                    # Next.js App Router
│   ├── hino/[numero]/      # Página do hino (SSG, 640 páginas)
│   └── page.tsx            # Home
├── components/             # Componentes React
├── data/                   # JSON dos 640 hinos
├── lib/                    # Lógica de negócio (hinos, search, supabase)
└── types/                  # Tipos TypeScript
```

## 📜 Créditos e Licença

- **Dados dos hinos**: [`DanielLiberato/Harpa-Crista-JSON-640-Hinos-Completa`](https://github.com/DanielLiberato/Harpa-Crista-JSON-640-Hinos-Completa) (MIT) por Daniel Liberato da Silva
- **Harpa Cristã**: publicação da Casa Publicadora das Assembleias de Deus (CPAD)
- **Código**: [MIT](./LICENSE) por Silas
- **Design System**: gerado por [UXProMax](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

## 🤝 Contribuindo

Pull requests são bem-vindos! Veja o [PLAN.md](./PLAN.md) para o roadmap.

---

> "Cantai-lhe um cântico novo, tocai bem e com júbilo." — Salmos 33:3
