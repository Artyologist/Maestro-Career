import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { AUTH_CONFIG } from "@/lib/auth-config";
import { deliverOtp } from "@/lib/otp-delivery";

export const AUTH_COOKIE_NAME = "maestro_auth_session";

const MIN_SIGNUP_AGE = 13;

type LoginMethod = "otp" | "password";
type OtpPurpose = "register" | "login";

type OtpChannel = "mobile" | "email";

interface User {
    id: string;
    name: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    termsAcceptedAt: string;
    onboardingCompleted: boolean;
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
    channel: OtpChannel;
    otpHash?: string;
    otpSalt?: string;
    otp?: string;
    expiresAt: string;
    attempts: number;
    createdAt: string;
    registerPayload?: {
        identifier: string;
        channel: OtpChannel;
        dateOfBirth: string;
        termsAcceptedAt: string;
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
    type: "registration" | "login" | "profile";
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
    onboardingCompleted: boolean;
    hasPassword: boolean;
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
    return value.replace(/\D/g, "");
}

function normalizeEmail(value: string) {
    return value.trim().toLowerCase();
}

function normalizeIdentifier(identifier: string) {
    const trimmed = String(identifier ?? "").trim();
    if (trimmed.includes("@")) {
        return { channel: "email" as const, value: normalizeEmail(trimmed) };
    }
    return { channel: "mobile" as const, value: normalizeMobile(trimmed) };
}

function maskValue(channel: OtpChannel, value: string) {
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

function hashOtp(otp: string, salt: string) {
    return scryptSync(otp, salt, 32).toString("hex");
}

function generateOtp() {
    const num = Math.floor(100000 + Math.random() * 900000);
    return String(num);
}

function compareHashedOtp(challenge: OtpChallenge, otp: string) {
    if (challenge.otpHash && challenge.otpSalt) {
        const expected = Buffer.from(challenge.otpHash, "hex");
        const actual = Buffer.from(hashOtp(otp, challenge.otpSalt), "hex");
        return expected.length === actual.length && timingSafeEqual(expected, actual);
    }

    if (!challenge.otp) {
        return false;
    }

    return challenge.otp === otp;
}

function calculateAgeYears(dateOfBirthIso: string) {
    const dob = new Date(dateOfBirthIso);
    if (Number.isNaN(dob.getTime())) {
        return -1;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDelta = today.getMonth() - dob.getMonth();

    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
    }

    return age;
}

function normalizeExistingUser(raw: Partial<User>): User {
    return {
        id: String(raw.id ?? randomUUID()),
        name: String(raw.name ?? "Learner"),
        email: normalizeEmail(String(raw.email ?? "")),
        mobile: normalizeMobile(String(raw.mobile ?? "")),
        dateOfBirth: String(raw.dateOfBirth ?? ""),
        termsAcceptedAt: String(raw.termsAcceptedAt ?? raw.createdAt ?? nowIso()),
        onboardingCompleted: Boolean(raw.onboardingCompleted ?? false),
        passwordHash: String(raw.passwordHash ?? ""),
        passwordSalt: String(raw.passwordSalt ?? ""),
        createdAt: String(raw.createdAt ?? nowIso()),
        updatedAt: String(raw.updatedAt ?? raw.createdAt ?? nowIso()),
        lastLoginAt: raw.lastLoginAt,
        lastLoginMethod: raw.lastLoginMethod,
        loginCount: Number(raw.loginCount ?? 0),
        inquiryCount: Number(raw.inquiryCount ?? 0),
        preferredServices: Array.isArray(raw.preferredServices) ? raw.preferredServices : [],
    };
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
    const parsed = JSON.parse(raw) as Partial<AuthDb>;

    const db: AuthDb = {
        users: (parsed.users ?? []).map((user) => normalizeExistingUser(user)),
        otpChallenges: (parsed.otpChallenges ?? []) as OtpChallenge[],
        sessions: (parsed.sessions ?? []) as Session[],
        activities: (parsed.activities ?? []) as UserActivity[],
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
        onboardingCompleted: user.onboardingCompleted,
        hasPassword: Boolean(user.passwordHash && user.passwordSalt),
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
    db.activities = db.activities.slice(0, 300);
}

function applySuccessfulLogin(user: User, method: LoginMethod) {
    user.lastLoginAt = nowIso();
    user.lastLoginMethod = method;
    user.loginCount += 1;
    user.updatedAt = nowIso();
}

export async function requestRegistrationOtp(input: {
    identifier: string;
    dateOfBirth: string;
    acceptedTerms: boolean;
}) {
    const normalized = normalizeIdentifier(input.identifier);

    if (normalized.channel === "mobile" && normalized.value.length < 10) {
        throw new Error("Enter a valid mobile number.");
    }
    if (normalized.channel === "email" && !/^\S+@\S+\.\S+$/.test(normalized.value)) {
        throw new Error("Enter a valid email address.");
    }
    if (!input.acceptedTerms) {
        throw new Error("You must accept terms and privacy policy to continue.");
    }

    const age = calculateAgeYears(input.dateOfBirth);
    if (age < MIN_SIGNUP_AGE) {
        throw new Error(`You must be at least ${MIN_SIGNUP_AGE} years old to register.`);
    }
    if (age > 100) {
        throw new Error("Enter a valid date of birth.");
    }

    const db = await readDb();
    const duplicate = findUserByIdentifier(db, normalized.value);
    if (duplicate) {
        throw new Error("An account already exists for this mobile/email.");
    }

    db.otpChallenges = db.otpChallenges.filter(
        (challenge) => !(challenge.purpose === "register" && challenge.identifier === normalized.value)
    );

    const otp = generateOtp();
    const otpSalt = randomBytes(16).toString("hex");

    const challenge: OtpChallenge = {
        id: randomUUID(),
        purpose: "register",
        identifier: normalized.value,
        channel: normalized.channel,
        otpHash: hashOtp(otp, otpSalt),
        otpSalt,
        expiresAt: new Date(Date.now() + AUTH_CONFIG.otpTtlMs).toISOString(),
        attempts: 0,
        createdAt: nowIso(),
        registerPayload: {
            identifier: normalized.value,
            channel: normalized.channel,
            dateOfBirth: new Date(input.dateOfBirth).toISOString(),
            termsAcceptedAt: nowIso(),
        },
    };

    await deliverOtp({
        channel: normalized.channel,
        target: normalized.value,
        otp,
        purpose: "register",
    });

    db.otpChallenges.push(challenge);
    await writeDb(db);

    return {
        target: maskValue(normalized.channel, normalized.value),
        channel: normalized.channel,
        ...(AUTH_CONFIG.debugOtpEnabled ? { debugOtp: otp } : {}),
        expiresInSeconds: Math.floor(AUTH_CONFIG.otpTtlMs / 1000),
    };
}

export async function verifyRegistrationOtp(input: { identifier: string; otp: string }) {
    const normalized = normalizeIdentifier(input.identifier);
    const otp = input.otp.trim();
    const db = await readDb();

    const challenge = db.otpChallenges.find(
        (item) => item.purpose === "register" && item.identifier === normalized.value
    );

    if (!challenge || !challenge.registerPayload) {
        throw new Error(
            AUTH_CONFIG.strictAuthErrors
                ? "Invalid or expired OTP. Please request a new OTP."
                : "No active registration OTP found. Please request a new OTP."
        );
    }

    if (challenge.attempts >= AUTH_CONFIG.otpMaxAttempts) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error(
            AUTH_CONFIG.strictAuthErrors
                ? "Invalid or expired OTP. Please request a new OTP."
                : "Too many invalid attempts. Please request a new OTP."
        );
    }

    if (!compareHashedOtp(challenge, otp)) {
        challenge.attempts += 1;
        await writeDb(db);
        throw new Error(
            AUTH_CONFIG.strictAuthErrors
                ? "Invalid or expired OTP. Please request a new OTP."
                : "Invalid OTP."
        );
    }

    const duplicate = findUserByIdentifier(db, challenge.registerPayload.identifier);
    if (duplicate) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error("An account already exists for this mobile/email.");
    }

    const isEmail = challenge.registerPayload.channel === "email";

    const user: User = {
        id: randomUUID(),
        name: "Learner",
        email: isEmail ? challenge.registerPayload.identifier : "",
        mobile: isEmail ? "" : challenge.registerPayload.identifier,
        dateOfBirth: challenge.registerPayload.dateOfBirth,
        termsAcceptedAt: challenge.registerPayload.termsAcceptedAt,
        onboardingCompleted: false,
        passwordHash: "",
        passwordSalt: "",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        loginCount: 0,
        inquiryCount: 0,
        preferredServices: [],
    };

    applySuccessfulLogin(user, "otp");

    db.users.push(user);
    db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
    addActivity(db, user.id, "registration", `Completed registration via ${challenge.channel.toUpperCase()} OTP.`);

    const sessionToken = randomBytes(32).toString("hex");
    db.sessions.push({
        id: randomUUID(),
        userId: user.id,
        tokenHash: sha256(sessionToken),
        createdAt: nowIso(),
        expiresAt: new Date(Date.now() + AUTH_CONFIG.sessionTtlMs).toISOString(),
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
    if (!user && !AUTH_CONFIG.strictAuthErrors) {
        throw new Error("No account found for the provided identifier.");
    }

    db.otpChallenges = db.otpChallenges.filter(
        (challenge) => !(challenge.purpose === "login" && challenge.identifier === normalized.value)
    );

    const otp = generateOtp();
    const otpSalt = randomBytes(16).toString("hex");

    if (user) {
        const challenge: OtpChallenge = {
            id: randomUUID(),
            purpose: "login",
            identifier: normalized.value,
            channel: normalized.channel,
            otpHash: hashOtp(otp, otpSalt),
            otpSalt,
            expiresAt: new Date(Date.now() + AUTH_CONFIG.otpTtlMs).toISOString(),
            attempts: 0,
            createdAt: nowIso(),
            userId: user.id,
        };

        await deliverOtp({
            channel: normalized.channel,
            target: normalized.value,
            otp,
            purpose: "login",
        });

        db.otpChallenges.push(challenge);
        await writeDb(db);
    }

    return {
        target: maskValue(normalized.channel, normalized.value),
        channel: normalized.channel,
        ...(AUTH_CONFIG.debugOtpEnabled && user ? { debugOtp: otp } : {}),
        expiresInSeconds: Math.floor(AUTH_CONFIG.otpTtlMs / 1000),
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
        throw new Error(
            AUTH_CONFIG.strictAuthErrors
                ? "Invalid or expired OTP. Please request a new OTP."
                : "No active login OTP found. Please request a new OTP."
        );
    }

    if (challenge.attempts >= AUTH_CONFIG.otpMaxAttempts) {
        db.otpChallenges = db.otpChallenges.filter((item) => item.id !== challenge.id);
        await writeDb(db);
        throw new Error(
            AUTH_CONFIG.strictAuthErrors
                ? "Invalid or expired OTP. Please request a new OTP."
                : "Too many invalid attempts. Please request a new OTP."
        );
    }

    if (!compareHashedOtp(challenge, otp)) {
        challenge.attempts += 1;
        await writeDb(db);
        throw new Error(
            AUTH_CONFIG.strictAuthErrors
                ? "Invalid or expired OTP. Please request a new OTP."
                : "Invalid OTP."
        );
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
        expiresAt: new Date(Date.now() + AUTH_CONFIG.sessionTtlMs).toISOString(),
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
    if (!user || !user.passwordHash || !user.passwordSalt) {
        throw new Error("This account does not have password login enabled.");
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
        expiresAt: new Date(Date.now() + AUTH_CONFIG.sessionTtlMs).toISOString(),
    });

    await writeDb(db);

    return {
        user: toPublicUser(user),
        sessionToken,
    };
}

export async function completeProfileFromSessionToken(
    token: string | undefined,
    input: { name: string; preferredServices: string[]; password?: string }
) {
    if (!token) {
        throw new Error("Unauthorized");
    }

    const db = await readDb();
    const tokenHash = sha256(token);
    const session = db.sessions.find((item) => item.tokenHash === tokenHash);
    if (!session) {
        throw new Error("Unauthorized");
    }

    const user = db.users.find((item) => item.id === session.userId);
    if (!user) {
        throw new Error("Unauthorized");
    }

    const name = input.name.trim();
    if (name.length < 2) {
        throw new Error("Name must be at least 2 characters.");
    }

    const preferredServices = input.preferredServices
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5);

    user.name = name;
    user.preferredServices = preferredServices;
    user.onboardingCompleted = true;

    const password = input.password?.trim() ?? "";
    if (password) {
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters.");
        }
        const salt = randomBytes(16).toString("hex");
        user.passwordSalt = salt;
        user.passwordHash = hashPassword(password, salt);
    }

    user.updatedAt = nowIso();
    addActivity(db, user.id, "profile", "Completed profile setup.");
    await writeDb(db);

    return toPublicUser(user);
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
    return Math.floor(AUTH_CONFIG.sessionTtlMs / 1000);
}
