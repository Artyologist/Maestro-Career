import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getPlanById } from "@/data/plans";
import { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRazorpayClient() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Razorpay environment variables are missing.");
    }

    return {
        keyId,
        client: new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        }),
    };
}

export async function POST(req: NextRequest) {
    try {
        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const planId = String(body?.planId ?? "");

        const plan = getPlanById(planId);
        if (!plan) {
            return NextResponse.json({ success: false, message: "Invalid plan selected." }, { status: 400 });
        }

        const { keyId, client } = getRazorpayClient();
        const amountPaise = plan.priceInr * 100;

        const order = await client.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}_${plan.id}`.slice(0, 40),
            notes: {
                planId: plan.id,
                planName: plan.name,
            },
        });

        return applyToResponse(NextResponse.json({
            success: true,
            keyId,
            order,
            plan: {
                id: plan.id,
                name: plan.name,
                amountPaise,
            },
        }));
    } catch (error) {
        console.error("[Razorpay Order Create Error]:", error);
        const message = error instanceof Error ? error.message : "Unable to create payment order.";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}
