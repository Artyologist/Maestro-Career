import { Suspense } from "react";
import AuthPageClient from "@/app/auth/AuthPageClient";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <AuthPageClient defaultMode="login" />
        </Suspense>
    );
}
