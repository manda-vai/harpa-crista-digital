// Magic link (OTP) callback handler
// Supabase redireciona pra cá depois do user clicar no link do email.
// Trocamos o código por uma sessão (cookie) e mandamos pro destino.
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }

    // Se falhou, redireciona pra /login com erro
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "auth-callback-failed");
    return NextResponse.redirect(loginUrl);
  }

  // Sem code, manda pro home
  return NextResponse.redirect(new URL("/", origin));
}
