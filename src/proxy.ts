import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

const SIGNED_OUT_ONLY = ["/sign-in", "/sign-up", "/forgot-password"];
const SIGNED_IN_HOME = "/dashboard";
const SIGN_IN = "/sign-in";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [key, value] of Object.entries(headers)) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (!signedIn && pathname.startsWith(SIGNED_IN_HOME)) {
    return redirect(request, response, SIGN_IN);
  }
  if (signedIn && SIGNED_OUT_ONLY.includes(pathname)) {
    return redirect(request, response, SIGNED_IN_HOME);
  }
  return response;
}

function redirect(request: NextRequest, from: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const to = NextResponse.redirect(url);
  for (const cookie of from.cookies.getAll()) to.cookies.set(cookie);
  for (const header of ["Cache-Control", "Expires", "Pragma"]) {
    const value = from.headers.get(header);
    if (value) to.headers.set(header, value);
  }
  return to;
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/forgot-password"],
};
