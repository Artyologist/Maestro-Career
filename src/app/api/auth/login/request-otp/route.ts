import { NextResponse } from "next/server";
import { requestLoginOtp } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await requestLoginOtp({
            identifier: body?.identifier ?? "",
        });

        return NextResponse.json({
            success: true,
            message: `OTP sent to your ${result.channel}.`,
            target: result.target,
            channel: result.channel,
            expiresInSeconds: result.expiresInSeconds,
            ...(process.env.NODE_ENV !== "production" ? { debugOtp: result.debugOtp } : {}),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to request OTP.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
