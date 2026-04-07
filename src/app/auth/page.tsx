import { redirect } from "next/navigation";

type AuthCompatibilityPageProps = {
    searchParams?: Record<string, string | string[] | undefined>;
};

export default function AuthCompatibilityPage({ searchParams }: AuthCompatibilityPageProps) {
    const params = new URLSearchParams();

    for (const [key, rawValue] of Object.entries(searchParams || {})) {
        if (Array.isArray(rawValue)) {
            rawValue.forEach((value) => params.append(key, value));
        } else if (typeof rawValue === "string") {
            params.set(key, rawValue);
        }
    }

    const target = params.get("setup") === "1" ? "/register" : "/login";
    const query = params.toString();

    redirect(query ? `${target}?${query}` : target);
}
