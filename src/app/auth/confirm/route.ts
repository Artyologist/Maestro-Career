import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const runtime = "nodejs";

function getSafeRedirectTarget(rawNext: string | null, type: string | null) {
    if (type === "recovery") {
        return "/login?recovery=1";
    }

    if (!rawNext || !rawNext.startsWith("/")) {
        return "/dashboard";
    }

    if (rawNext === "/auth") {
        return "/login";
    }

    if (rawNext.startsWith("/auth?")) {
        const nextUrl = new URL(rawNext, "http://localhost");
        return `${nextUrl.searchParams.get("setup") === "1" ? "/register" : "/login"}${nextUrl.search}`;
    }

    return rawNext;
}

export async function GET(request: NextRequest) {
    const { url, anonKey } = getSupabaseConfig();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = getSafeRedirectTarget(searchParams.get("next"), type);

    const errorToRedirect = (msg: string) => {
        const fallback = new URL("/login", request.url);
        fallback.searchParams.set("error", "invalid_or_expired_link");
        fallback.searchParams.set("details", msg);
        return NextResponse.redirect(fallback);
    };

    if (!url || !anonKey) {
        return errorToRedirect("missing_config");
    }

    const { supabase, applyToResponse } = createRouteHandlerClient(request);

    // 1. Handle PKCE Flow (code)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            return errorToRedirect(error.message);
        }
        const redirectUrl = new URL(next, request.url);
        return applyToResponse(NextResponse.redirect(redirectUrl));
    }

    // 2. Handle Token Hash Flow (OTP/Recovery)
    if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
        });

        if (error) {
            return errorToRedirect(error.message);
        }

        const redirectUrl = new URL(next, request.url);
        return applyToResponse(NextResponse.redirect(redirectUrl));
    }

    // 3. Fallback: Check if session already exists (session might be set by middleware or previous attempt)
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const redirectUrl = new URL(next, request.url);
            return applyToResponse(NextResponse.redirect(redirectUrl));
        }
    } catch {
        // Ignore and proceed to error
    }

    // No valid parameters found or established session
    return errorToRedirect("missing_parameters");
}
