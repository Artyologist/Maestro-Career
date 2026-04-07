import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { markPaymentSuccessfulFromSession } from "@/lib/auth-supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const orderId = String(body?.razorpay_order_id ?? "");
        const paymentId = String(body?.razorpay_payment_id ?? "");
        const signature = String(body?.razorpay_signature ?? "");

        if (!orderId || !paymentId || !signature) {
            return NextResponse.json(
                { success: false, message: "Missing payment verification fields." },
                { status: 400 }
            );
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json(
                { success: false, message: "Payment verification is not configured." },
                { status: 500 }
            );
        }

        const expectedSignature = createHmac("sha256", secret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json({ success: false, message: "Invalid payment signature." }, { status: 400 });
        }

        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        await markPaymentSuccessfulFromSession(supabase, {
            paymentId,
            orderId,
            signature,
        });

        return applyToResponse(NextResponse.json({ success: true, message: "Payment verified successfully." }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to verify payment.";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
