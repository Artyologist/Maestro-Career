import { NextResponse } from "next/server";
import {
    AUTH_COOKIE_NAME,
    getCookieMaxAgeSeconds,
    verifyRegistrationOtp,
} from "@/lib/auth";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req.headers);
        const ipRate = consumeRateLimit({
            key: `auth:register:verify:ip:${ip}`,
            limit: 30,
            windowMs: 10 * 60 * 1000,
        });
        if (!ipRate.ok) {
            return NextResponse.json(
                { success: false, message: "Too many attempts. Try again later." },
                { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSeconds) } }
            );
        }

        const body = await req.json();
        const identifier = String(body?.identifier ?? "").trim().toLowerCase();
        if (identifier) {
            const identifierRate = consumeRateLimit({
                key: `auth:register:verify:identifier:${identifier}`,
                limit: 8,
                windowMs: 10 * 60 * 1000,
            });
            if (!identifierRate.ok) {
                return NextResponse.json(
                    { success: false, message: "Too many invalid attempts. Please request a new OTP." },
                    { status: 429, headers: { "Retry-After": String(identifierRate.retryAfterSeconds) } }
                );
            }
        }

        const result = await verifyRegistrationOtp({
            identifier: body?.identifier ?? "",
            otp: body?.otp ?? "",
        });

        const response = NextResponse.json({
            success: true,
            message: "Registration completed successfully.",
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
        const message = error instanceof Error ? error.message : "Unable to verify OTP.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
