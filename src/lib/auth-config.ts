const DEFAULT_OTP_TTL_SECONDS = 5 * 60;
const DEFAULT_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const DEFAULT_OTP_MAX_ATTEMPTS = 5;

function parseNumberEnv(name: string, defaultValue: number) {
    const raw = process.env[name];
    if (!raw) {
        return defaultValue;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return defaultValue;
    }

    return Math.floor(parsed);
}

function parseBooleanEnv(name: string, defaultValue: boolean) {
    const raw = process.env[name];
    if (!raw) {
        return defaultValue;
    }

    const normalized = raw.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
}

export const AUTH_CONFIG = {
    otpTtlMs: parseNumberEnv("AUTH_OTP_TTL_SECONDS", DEFAULT_OTP_TTL_SECONDS) * 1000,
    sessionTtlMs: parseNumberEnv("AUTH_SESSION_TTL_SECONDS", DEFAULT_SESSION_TTL_SECONDS) * 1000,
    otpMaxAttempts: parseNumberEnv("AUTH_OTP_MAX_ATTEMPTS", DEFAULT_OTP_MAX_ATTEMPTS),
    debugOtpEnabled: parseBooleanEnv("AUTH_DEBUG_OTP", false) && process.env.NODE_ENV !== "production",
    strictAuthErrors: parseBooleanEnv("AUTH_STRICT_ERRORS", true),
};
