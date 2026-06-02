"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Não rodar no servidor (Next.js renderiza layout root no SSR)
    if (typeof window === "undefined") return;

    const supabase = getSupabaseBrowserClient();

    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Escuta mudanças (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      },
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
