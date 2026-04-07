import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try {
        if (!isAdminAuthenticatedRequest(req)) {
            return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
        }

        const admin = createAdminClient();
        const { data: users, error } = await admin
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load users.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
