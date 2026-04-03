import { NextResponse } from "next/server";
import { requestRegistrationOtp } from "@/lib/auth";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req.headers);
        const ipRate = consumeRateLimit({
            key: `auth:register:request:ip:${ip}`,
            limit: 20,
            windowMs: 10 * 60 * 1000,
        });
        if (!ipRate.ok) {
            return NextResponse.json(
                { success: false, message: "Too many requests. Try again later." },
                { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSeconds) } }
            );
        }

        const body = await req.json();
        const email = String(body?.email ?? "").trim().toLowerCase();
        if (email) {
            const identifierRate = consumeRateLimit({
                key: `auth:register:request:email:${email}`,
                limit: 5,
                windowMs: 10 * 60 * 1000,
            });
            if (!identifierRate.ok) {
                return NextResponse.json(
                    { success: false, message: "Too many OTP requests. Please wait and retry." },
                    { status: 429, headers: { "Retry-After": String(identifierRate.retryAfterSeconds) } }
                );
            }
        }

        const result = await requestRegistrationOtp({
            fullName: body?.fullName ?? "",
            email: body?.email ?? "",
            mobile: body?.mobile ?? "",
            countryCode: body?.countryCode ?? "+1",
            password: body?.password ?? "",
            dateOfBirth: body?.dateOfBirth ?? "",
            acceptedTerms: Boolean(body?.acceptedTerms),
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent to your email and mobile number.",
            targets: {
                email: result.emailTarget,
                mobile: result.mobileTarget,
            },
            expiresInSeconds: result.expiresInSeconds,
            ...(result.debugOtp ? { debugOtp: result.debugOtp } : {}),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to request OTP.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
