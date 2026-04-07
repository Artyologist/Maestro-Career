import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "maestro_admin_session";

const ADMIN_SESSION_VALUE = "authorized";
const ADMIN_USER_ID = "maestrocareer";
const ADMIN_PASSWORD = "maestrocareer2026";

export function validateAdminCredentials(userId: string, password: string) {
    return userId === ADMIN_USER_ID && password === ADMIN_PASSWORD;
}

export function isAdminAuthenticatedRequest(req: NextRequest) {
    return req.cookies.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_VALUE;
}

export function withAdminSession(response: NextResponse) {
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
    });
    return response;
}

export function clearAdminSession(response: NextResponse) {
    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    return response;
}
