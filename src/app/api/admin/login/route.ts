import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials, withAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const userId = String(body?.userId ?? "").trim();
        const password = String(body?.password ?? "").trim();

        if (!validateAdminCredentials(userId, password)) {
            return NextResponse.json(
                { success: false, message: "Invalid admin credentials." },
                { status: 401 }
            );
        }

        return withAdminSession(NextResponse.json({ success: true }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to process admin login.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
