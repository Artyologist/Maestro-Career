import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    return NextResponse.json({
        success: true,
        authenticated: isAdminAuthenticatedRequest(req),
    });
}
