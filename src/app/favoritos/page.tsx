import type { Metadata } from "next";
import { FavoritosList } from "@/components/FavoritosList";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Meus favoritos",
};

export default function FavoritosPage() {
  return (
    <main
      id="main"
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <Heart
          className="h-7 w-7 text-rose-500"
          fill="currentColor"
          aria-hidden
        />
        <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-50">
          Meus favoritos
        </h1>
      </div>
      <p className="mb-6 text-purple-700 dark:text-purple-300">
        Seus hinos favoritos ficam salvos no seu navegador (localStorage).{" "}
        <span className="text-sm opacity-80">
          Em breve: sincronização na nuvem com Supabase.
        </span>
      </p>

      <FavoritosList />
    </main>
  );
}
