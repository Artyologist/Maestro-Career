import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        if (!isAdminAuthenticatedRequest(req)) {
            return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
        }

        const { psychometricTestLink } = await req.json();
        if (!psychometricTestLink) {
            return NextResponse.json({ success: false, message: "Link is required." }, { status: 400 });
        }

        const admin = createAdminClient();
        const { data: profile, error: profileError } = await admin
            .from("profiles")
            .select("payment_status")
            .eq("id", params.userId)
            .maybeSingle<{ payment_status: "paid" | "unpaid" | null }>();

        if (profileError) {
            throw profileError;
        }
        if (!profile || profile.payment_status !== "paid") {
            return NextResponse.json(
                { success: false, message: "Psychometric link can be sent only after payment is marked paid." },
                { status: 400 }
            );
        }

        const { error } = await admin
            .from("profiles")
            .update({ psychometric_test_link: psychometricTestLink })
            .eq("id", params.userId);

        if (error) throw error;

        return NextResponse.json({ success: true, message: "Link updated successfully." });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to send link.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
