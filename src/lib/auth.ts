import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export const AUTH_COOKIE_NAME = "maestro_auth_session";

const OTP_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

type LoginMethod = "otp" | "password";

type OtpPurpose = "register" | "login";

interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    lastLoginMethod?: LoginMethod;
    loginCount: number;
    inquiryCount: number;
    preferredServices: string[];
}

interface OtpChallenge {
    id: string;
    purpose: OtpPurpose;
    identifier: string;
    channel: "mobile" | "email";
    otp: string;
    expiresAt: string;
    attempts: number;
    createdAt: string;
    registerPayload?: {
        name: string;
        email: string;
        mobile: string;
        passwordHash: string;
        passwordSalt: string;
    };
    userId?: string;
}

interface Session {
    id: string;
    userId: string;
    tokenHash: string;
    createdAt: string;
    expiresAt: string;
}

interface UserActivity {
    id: string;
    userId: string;
    type: "registration" | "login";
    message: string;
    at: string;
}

interface AuthDb {
    users: User[];
    otpChallenges: OtpChallenge[];
    sessions: Session[];
    activities: UserActivity[];
}

interface PublicUser {
    id: string;
    name: string;
    email: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    lastLoginMethod?: LoginMethod;
    loginCount: number;
    inquiryCount: number;
    preferredServices: string[];
}

interface DashboardData {
    profile: PublicUser;
    metrics: {
        accountAgeDays: number;
        totalLogins: number;
        inquiryCount: number;
    };
    recentActivity: UserActivity[];
    websiteModules: Array<{ title: string; route: string; description: string }>;
}

const DB_PATH = path.join(process.cwd(), "data", "auth-prototype.json");

const DEFAULT_DB: AuthDb = {
    users: [],
    otpChallenges: [],
    sessions: [],
    activities: [],
};

function nowIso() {
    return new Date().toISOString();
}

function sha256(value: string) {
    return createHash("sha256").update(value).digest("hex");
}

function normalizeMobile(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits;
}

function normalizeEmail(value: string) {
    return value.trim().toLowerCase();
}

function normalizeIdentifier(identifier: string) {
    const trimmed = identifier.trim();
    if (trimmed.includes("@")) {
        return { channel: "email" as const, value: normalizeEmail(trimmed) };
    }
    return { channel: "mobile" as const, value: normalizeMobile(trimmed) };
}

function maskValue(channel: "mobile" | "email", value: string) {
    if (channel === "mobile") {
        if (value.length <= 4) {
            return value;
        }
        return `${"*".repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}`;
    }
    const [name, domain] = value.split("@");
    if (!name || !domain) {
        return value;
    }
    if (name.length <= 2) {
        return `${name[0] ?? ""}*@${domain}`;
    }
    return `${name[0]}${"*".repeat(Math.max(name.length - 2, 1))}${name[name.length - 1]}@${domain}`;
}

function hashPassword(password: string, salt: string) {
    return scryptSync(password, salt, 64).toString("hex");
}

function generateOtp() {
    const num = Math.floor(100000 + Math.random() * 900000);
    return String(num);
}

function cleanupDb(db: AuthDb) {
    const now = Date.now();
    db.otpChallenges = db.otpChallenges.filter((item) => new Date(item.expiresAt).getTime() > now);
    db.sessions = db.sessions.filter((item) => new Date(item.expiresAt).getTime() > now);
}

async function ensureDbFile() {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf8");
    }
}

async function readDb(): Promise<AuthDb> {
    await ensureDbFile();
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as AuthDb;
    const db = {
        users: parsed.users ?? [],
        otpChallenges: parsed.otpChallenges ?? [],
        sessions: parsed.sessions ?? [],
        activities: parsed.activities ?? [],
    };
    cleanupDb(db);
    return db;
}

async function writeDb(db: AuthDb) {
    cleanupDb(db);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        lastLoginMethod: user.lastLoginMethod,
        loginCount: user.loginCount,
        inquiryCount: user.inquiryCount,
        preferredServices: user.preferredServices,
    };
}

function findUserByIdentifier(db: AuthDb, identifier: string) {
    const normalized = normalizeIdentifier(identifier);
    if (normalized.channel === "email") {
        return db.users.find((user) => user.email === normalized.value);
    }
    return db.users.find((user) => user.mobile === normalized.value);
}

function addActivity(db: AuthDb, userId: string, type: UserActivity["type"], message: string) {
    db.activities.unshift({
        id: randomUUID(),
        userId,
        type,
        message,
        at: nowIso(),
    });
    db.activities = db.activities.slice(0, 200);
}

function applySuccessfulLogin(user: User, method: LoginMethod) {
    user.lastLoginAt = nowIso();
    user.lastLoginMethod = method;
    user.loginCount += 1;
    user.updatedAt = nowIso();
}

export async function requestRegistrationOtp(input: {
    name: string;
    email: string;
    mobile: string;
    password: string;
}) {
    const name = input.name.trim();
    const email = normalizeEmail(input.email);
    const mobile = normalizeMobile(input.mobile);
    const password = input.password;

    if (name.length < 2) {
        throw new Error("Name must be at least 2 characters.");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error("Enter a valid email address.");
    }
    if (mobile.length < 10) {
        throw new Error("Enter a valid mobile number.");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
    }

    const db = await readDb();
    const duplicate = db.users.find((user) => user.email === email || user.mobile === mobile);
    if (duplicate) {
        throw new Error("An account with this email or mobile already exists.");
    }

    db.otpChallenges = db.otpChallenges.filter(
        (challenge) =>
            !(challenge.purpose === "register" && challenge.identifier === mobile)
    );

    const otp = generateOtp();
    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);

    db.otpChallenges.push({
        id: randomUUID(),
        purpose: "register",
        identifier: mobile,
        channel: "mobile",
        otp,
        expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
        attempts: 0,
        createdAt: nowIso(),
        registerPayload: {
            name,
            email,
            mobile,
            passwordHash,
            passwordSalt: salt,
        },
    });

    await writeDb(db);

    return {
        target: maskValue("mobile", mobile),
        debugOtp: otp,
        expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    };
}

export async function verifyRegistrationOtp(input: { mobile: string; otp: string }) {
    const mobile = normalizeMobile(input.mobile);
    const otp = input.otp.trim();
    const db = await readDb();

    const challenge = db.otpChallenges.find(
        (item) => item.purpose === "register" && item.identifier === mobile
    );

    if (!challenge || !challenge.registerPayload) {
        throw new Error("No active registration OTP found. Please request a new OTP.");
    }

    if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error("Too many invalid attempts. Please request a new OTP.");
    }

    if (challenge.otp !== otp) {
        challenge.attempts += 1;
        await writeDb(db);
        throw new Error("Invalid OTP.");
    }

    const duplicate = db.users.find(
        (user) =>
            user.email === challenge.registerPayload?.email ||
            user.mobile === challenge.registerPayload?.mobile
    );
    if (duplicate) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error("An account with this email or mobile already exists.");
    }

    const user: User = {
        id: randomUUID(),
        name: challenge.registerPayload.name,
        email: challenge.registerPayload.email,
        mobile: challenge.registerPayload.mobile,
        passwordHash: challenge.registerPayload.passwordHash,
        passwordSalt: challenge.registerPayload.passwordSalt,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        loginCount: 0,
        inquiryCount: 0,
        preferredServices: ["Career Coaching", "Psychometric Assessment", "Interview Prep"],
    };

    applySuccessfulLogin(user, "otp");

    db.users.push(user);
    db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
    addActivity(db, user.id, "registration", "Completed registration via mobile OTP.");

    const sessionToken = randomBytes(32).toString("hex");
    db.sessions.push({
        id: randomUUID(),
        userId: user.id,
        tokenHash: sha256(sessionToken),
        createdAt: nowIso(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });

    await writeDb(db);

    return {
        user: toPublicUser(user),
        sessionToken,
    };
}

export async function requestLoginOtp(input: { identifier: string }) {
    const normalized = normalizeIdentifier(input.identifier);
    if (normalized.channel === "mobile" && normalized.value.length < 10) {
        throw new Error("Enter a valid mobile number.");
    }
    if (normalized.channel === "email" && !/^\S+@\S+\.\S+$/.test(normalized.value)) {
        throw new Error("Enter a valid email address.");
    }

    const db = await readDb();
    const user = findUserByIdentifier(db, normalized.value);
    if (!user) {
        throw new Error("No account found for the provided identifier.");
    }

    db.otpChallenges = db.otpChallenges.filter(
        (challenge) =>
            !(challenge.purpose === "login" && challenge.identifier === normalized.value)
    );

    const otp = generateOtp();

    db.otpChallenges.push({
        id: randomUUID(),
        purpose: "login",
        identifier: normalized.value,
        channel: normalized.channel,
        otp,
        expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
        attempts: 0,
        createdAt: nowIso(),
        userId: user.id,
    });

    await writeDb(db);

    return {
        target: maskValue(normalized.channel, normalized.value),
        channel: normalized.channel,
        debugOtp: otp,
        expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    };
}

export async function verifyLoginOtp(input: { identifier: string; otp: string }) {
    const normalized = normalizeIdentifier(input.identifier);
    const otp = input.otp.trim();
    const db = await readDb();

    const challenge = db.otpChallenges.find(
        (item) => item.purpose === "login" && item.identifier === normalized.value
    );

    if (!challenge || !challenge.userId) {
        throw new Error("No active login OTP found. Please request a new OTP.");
    }

    if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error("Too many invalid attempts. Please request a new OTP.");
    }

    if (challenge.otp !== otp) {
        challenge.attempts += 1;
        await writeDb(db);
        throw new Error("Invalid OTP.");
    }

    const user = db.users.find((item) => item.id === challenge.userId);
    if (!user) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error("User account no longer exists.");
    }

    applySuccessfulLogin(user, "otp");
    db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
    addActivity(db, user.id, "login", `Logged in via ${challenge.channel.toUpperCase()} OTP.`);

    const sessionToken = randomBytes(32).toString("hex");
    db.sessions.push({
        id: randomUUID(),
        userId: user.id,
        tokenHash: sha256(sessionToken),
        createdAt: nowIso(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });

    await writeDb(db);

    return {
        user: toPublicUser(user),
        sessionToken,
    };
}

export async function loginWithPassword(input: { identifier: string; password: string }) {
    const normalized = normalizeIdentifier(input.identifier);
    const password = input.password;

    if (!password) {
        throw new Error("Password is required.");
    }

    const db = await readDb();
    const user = findUserByIdentifier(db, normalized.value);
    if (!user) {
        throw new Error("Invalid credentials.");
    }

    const computedHash = hashPassword(password, user.passwordSalt);
    const storedBuf = Buffer.from(user.passwordHash, "hex");
    const computedBuf = Buffer.from(computedHash, "hex");

    if (storedBuf.length !== computedBuf.length || !timingSafeEqual(storedBuf, computedBuf)) {
        throw new Error("Invalid credentials.");
    }

    applySuccessfulLogin(user, "password");
    addActivity(db, user.id, "login", "Logged in via password.");

    const sessionToken = randomBytes(32).toString("hex");
    db.sessions.push({
        id: randomUUID(),
        userId: user.id,
        tokenHash: sha256(sessionToken),
        createdAt: nowIso(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });

    await writeDb(db);

    return {
        user: toPublicUser(user),
        sessionToken,
    };
}

export async function getUserFromSessionToken(token?: string) {
    if (!token) {
        return null;
    }

    const db = await readDb();
    const tokenHash = sha256(token);
    const session = db.sessions.find((item) => item.tokenHash === tokenHash);
    if (!session) {
        return null;
    }

    const user = db.users.find((item) => item.id === session.userId);
    if (!user) {
        return null;
    }

    return toPublicUser(user);
}

export async function logoutFromSessionToken(token?: string) {
    if (!token) {
        return;
    }

    const db = await readDb();
    const tokenHash = sha256(token);
    db.sessions = db.sessions.filter((item) => item.tokenHash !== tokenHash);
    await writeDb(db);
}

export async function getDashboardData(token?: string): Promise<DashboardData | null> {
    const publicUser = await getUserFromSessionToken(token);
    if (!publicUser) {
        return null;
    }

    const db = await readDb();
    const recentActivity = db.activities
        .filter((item) => item.userId === publicUser.id)
        .slice(0, 8);

    const accountAgeDays = Math.max(
        1,
        Math.floor((Date.now() - new Date(publicUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    );

    return {
        profile: publicUser,
        metrics: {
            accountAgeDays,
            totalLogins: publicUser.loginCount,
            inquiryCount: publicUser.inquiryCount,
        },
        recentActivity,
        websiteModules: [
            {
                title: "Career Assessment",
                route: "/demo-test",
                description: "Take the aptitude + psychometric prototype test.",
            },
            {
                title: "Career Services",
                route: "/#services",
                description: "Review available programs and offerings.",
            },
            {
                title: "Support Contact",
                route: "/#contact",
                description: "Submit your inquiry for guidance.",
            },
        ],
    };
}

export function getCookieMaxAgeSeconds() {
    return Math.floor(SESSION_TTL_MS / 1000);
}
