import { NextRequest, NextResponse } from "next/server";
import { logoutFromSession } from "@/lib/auth-supabase";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        await logoutFromSession(supabase);
        return applyToResponse(NextResponse.json({ success: true, message: "Logged out successfully." }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to log out.";
        const status = message.includes("Supabase auth is not configured") ? 503 : 400;
        return NextResponse.json({ success: false, message }, { status });
    }
}
