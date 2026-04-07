import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationOtp } from "@/lib/auth-supabase";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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
        const email = String(body?.email ?? "").trim().toLowerCase();
        if (email) {
            const identifierRate = consumeRateLimit({
                key: `auth:register:verify:email:${email}`,
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

        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        const result = await verifyRegistrationOtp(supabase, {
            email: body?.email ?? body?.identifier ?? "",
            otp: body?.otp ?? "",
        });

        return applyToResponse(NextResponse.json({
            success: true,
            message: "Registration completed successfully.",
            user: result.user,
        }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to verify OTP.";
        const status = message.includes("Supabase auth is not configured") ? 503 : 400;
        return NextResponse.json({ success: false, message }, { status });
    }
}
