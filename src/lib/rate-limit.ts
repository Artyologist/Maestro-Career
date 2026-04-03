type RateLimitResult = {
    ok: boolean;
    retryAfterSeconds: number;
    remaining: number;
    limit: number;
};

type RateLimitBucket = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export function consumeRateLimit(input: {
    key: string;
    limit: number;
    windowMs: number;
}): RateLimitResult {
    const now = Date.now();
    const current = buckets.get(input.key);

    if (!current || current.resetAt <= now) {
        const resetAt = now + input.windowMs;
        buckets.set(input.key, { count: 1, resetAt });
        return {
            ok: true,
            retryAfterSeconds: Math.ceil(input.windowMs / 1000),
            remaining: Math.max(input.limit - 1, 0),
            limit: input.limit,
        };
    }

    current.count += 1;
    buckets.set(input.key, current);

    if (current.count > input.limit) {
        return {
            ok: false,
            retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
            remaining: 0,
            limit: input.limit,
        };
    }

    return {
        ok: true,
        retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
        remaining: Math.max(input.limit - current.count, 0),
        limit: input.limit,
    };
}

export function getClientIp(headers: Headers) {
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
        const first = forwardedFor.split(",")[0]?.trim();
        if (first) {
            return first;
        }
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) {
        return realIp;
    }

    return "unknown";
}
