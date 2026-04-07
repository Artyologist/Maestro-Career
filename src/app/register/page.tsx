import { Suspense } from "react";
import AuthPageClient from "@/app/auth/AuthPageClient";

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <AuthPageClient defaultMode="register" />
        </Suspense>
    );
}
