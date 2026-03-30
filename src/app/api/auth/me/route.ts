import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getDashboardData } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const dashboard = await getDashboardData(token);

    if (!dashboard) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    return NextResponse.json({ success: true, data: dashboard });
}
