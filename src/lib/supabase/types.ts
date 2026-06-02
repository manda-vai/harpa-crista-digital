// Tipos do banco Supabase
// Gerado manualmente pra refletir o schema em supabase/migrations/001_favoritos.sql
// Quando a tabela mudar, atualize este arquivo (ou use `supabase gen types typescript` via CLI)

export interface FavoritoRow {
  id: string;
  user_id: string;
  hino_numero: number;
  created_at: string;
}

export interface FavoritoInsert {
  id?: string;
  user_id: string;
  hino_numero: number;
  created_at?: string;
}

// Schema do banco. O formato de Views/Functions/Enums/CompositeTypes
// tem que ser `Record<string, never>` (e Relationships = `[]`) pro
// generic do Database propagar corretamente nas queries.
export interface Database {
  public: {
    Tables: {
      favoritos: {
        Row: FavoritoRow;
        Insert: FavoritoInsert;
        Update: Partial<FavoritoInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
