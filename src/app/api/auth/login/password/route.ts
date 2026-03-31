import { NextResponse } from "next/server";
import {
    AUTH_COOKIE_NAME,
    getCookieMaxAgeSeconds,
    loginWithPassword,
} from "@/lib/auth";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req.headers);
        const ipRate = consumeRateLimit({
            key: `auth:login:password:ip:${ip}`,
            limit: 40,
            windowMs: 15 * 60 * 1000,
        });
        if (!ipRate.ok) {
            return NextResponse.json(
                { success: false, message: "Too many login attempts. Try again later." },
                { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSeconds) } }
            );
        }

        const body = await req.json();
        const identifier = String(body?.identifier ?? "").trim().toLowerCase();
        if (identifier) {
            const identifierRate = consumeRateLimit({
                key: `auth:login:password:identifier:${identifier}`,
                limit: 12,
                windowMs: 15 * 60 * 1000,
            });
            if (!identifierRate.ok) {
                return NextResponse.json(
                    { success: false, message: "Too many login attempts. Try again later." },
                    { status: 429, headers: { "Retry-After": String(identifierRate.retryAfterSeconds) } }
                );
            }
        }

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
