import { NextResponse } from "next/server";
import {
    AUTH_COOKIE_NAME,
    getCookieMaxAgeSeconds,
    verifyRegistrationOtp,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await verifyRegistrationOtp({
            mobile: body?.mobile ?? "",
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
