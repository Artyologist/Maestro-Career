import { NextRequest, NextResponse } from "next/server";
import { resetPasswordWithSession } from "@/lib/auth-supabase";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIp(req.headers);
        const ipRate = consumeRateLimit({
            key: `auth:forgot:reset:ip:${ip}`,
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
        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        await resetPasswordWithSession(supabase, {
            password: body?.password ?? "",
        });

        return applyToResponse(NextResponse.json({
            success: true,
            message: "Password reset successful. You can now log in with your new password.",
        }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to reset password.";
        const status =
            message === "Unauthorized"
                ? 401
                : message.includes("Supabase auth is not configured")
                    ? 503
                    : 400;
        return NextResponse.json({ success: false, message }, { status });
    }
}
