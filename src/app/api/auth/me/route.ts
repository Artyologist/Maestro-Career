import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/auth-supabase";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "No active session found" },
                { status: 200 } // Return 200 to silence console errors during race conditions
            );
        }

        const dashboard = await getDashboardData(supabase);
        if (!dashboard) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        return applyToResponse(NextResponse.json({ success: true, data: dashboard }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load the current session.";
        const status = message.includes("Supabase auth is not configured") ? 503 : 400;
        return NextResponse.json({ success: false, message }, { status });
    }
}
