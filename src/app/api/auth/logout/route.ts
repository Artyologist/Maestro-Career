import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, logoutFromSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    await logoutFromSessionToken(token);

    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: "",
        path: "/",
        maxAge: 0,
    });

    return response;
}
