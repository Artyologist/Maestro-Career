import { NextResponse } from "next/server";
import {
    AUTH_COOKIE_NAME,
    getCookieMaxAgeSeconds,
    loginWithPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await loginWithPassword({
            identifier: body?.identifier ?? "",
            password: body?.password ?? "",
        });

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
            user: result.user,
        });

        response.cookies.set({
            name: AUTH_COOKIE_NAME,
            value: result.sessionToken,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: getCookieMaxAgeSeconds(),
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to login with password.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
