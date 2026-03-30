import { NextResponse } from "next/server";
import { requestRegistrationOtp } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await requestRegistrationOtp({
            name: body?.name ?? "",
            email: body?.email ?? "",
            mobile: body?.mobile ?? "",
            password: body?.password ?? "",
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent to your mobile number.",
            target: result.target,
            expiresInSeconds: result.expiresInSeconds,
            ...(process.env.NODE_ENV !== "production" ? { debugOtp: result.debugOtp } : {}),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to request OTP.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
