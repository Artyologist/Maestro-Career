"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginAuthView } from "@/components/auth/LoginAuthView";
import { RegisterAuthView } from "@/components/auth/RegisterAuthView";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "register";
type LoginMode = "password" | "otp";
type RegisterStep = 1 | 2 | 3;
type UserType = "student" | "working_professional";

type MeResponse = {
    success?: boolean;
    data?: {
        profile?: {
            onboardingCompleted?: boolean;
            name?: string;
            email?: string;
        };
    };
};

const COUNTRY_CODES = [
    { code: "+1", label: "US/CA (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+61", label: "Australia (+61)" },
    { code: "+65", label: "Singapore (+65)" },
    { code: "+91", label: "India (+91)" },
    { code: "+971", label: "UAE (+971)" },
];

const CITY_SUGGESTIONS = [
    "Bengaluru",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Dubai",
    "London",
    "New York",
    "Singapore",
];

function isValidEmail(value: string) {
    return /^\S+@\S+\.\S+$/.test(value.trim());
}

function isValidName(value: string) {
    return /^[A-Za-z][A-Za-z .'-]{1,99}$/.test(value.trim());
}

function normalizeMobile(countryCode: string, mobile: string) {
    const c = countryCode.replace(/\D/g, "");
    const m = mobile.replace(/\D/g, "");
    return `+${c}${m}`;
}

function passwordRuleFlags(password: string) {
    return {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
}

function isStrongPassword(password: string) {
    const rules = passwordRuleFlags(password);
    return rules.length && rules.upper && rules.lower && rules.number && rules.special;
}

function maskOtpInput(value: string) {
    return value.replace(/\D/g, "").slice(0, 6);
}

async function parseResponse(response: Response) {
    try {
        return await response.json();
    } catch {
        return {} as Record<string, unknown>;
    }
}

type AuthPageClientProps = {
    defaultMode: AuthMode;
};

export default function AuthPageClient({ defaultMode }: AuthPageClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const recoveryMode = searchParams.get("recovery") === "1";
    const recoveryError = searchParams.get("error");
    const resetSuccess = searchParams.get("reset") === "success";
    const setupMode = searchParams.get("setup") === "1";

    const [loginMode, setLoginMode] = useState<LoginMode>("password");
    const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotRequestSent, setForgotRequestSent] = useState(false);

    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        countryCode: "+91",
        mobile: "",
        password: "",
        dateOfBirth: "",
        acceptedTerms: false,
        otp: "",
        userType: "student" as UserType,
        studyField: "",
        domain: "",
        companyRole: "",
        city: "",
    });

    const [loginPasswordData, setLoginPasswordData] = useState({
        email: "",
        password: "",
    });

    const [loginOtpData, setLoginOtpData] = useState({
        email: "",
        otp: "",
        otpRequested: false,
    });

    const [forgotEmail, setForgotEmail] = useState("");
    const [recoveryData, setRecoveryData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
    const [showRecoveryConfirmPassword, setShowRecoveryConfirmPassword] = useState(false);

    useEffect(() => {
        if (defaultMode === "login" && setupMode) {
            const query = searchParams.toString();
            router.replace(`/register${query ? `?${query}` : ""}`);
        }

        if (defaultMode === "register" && (recoveryMode || resetSuccess || recoveryError)) {
            const query = searchParams.toString();
            router.replace(`/login${query ? `?${query}` : ""}`);
        }
    }, [defaultMode, recoveryError, recoveryMode, resetSuccess, router, searchParams, setupMode]);

    useEffect(() => {
        if (otpCooldown <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [otpCooldown]);

    const pushToDashboard = useCallback(() => {
        router.push("/dashboard");
        router.refresh();
    }, [router]);

    useEffect(() => {
        const supabase = createBrowserSupabaseClient();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            if (event === "SIGNED_IN" && !recoveryMode && !setupMode && !resetSuccess && session) {
                pushToDashboard();
            }
        });

        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            if (session && !recoveryMode && !setupMode && !resetSuccess) {
                pushToDashboard();
            }
        });

        return () => subscription.unsubscribe();
    }, [pushToDashboard, recoveryMode, resetSuccess, setupMode]);

    useEffect(() => {
        if (recoveryMode && !resetSuccess && !recoveryError) {
            setError("");
            setMessage("Checking your recovery link...");
        }
    }, [recoveryError, recoveryMode, resetSuccess]);

    useEffect(() => {
        if (!recoveryMode || resetSuccess || recoveryError) {
            return;
        }

        let active = true;
        let retryCount = 0;
        const maxRetries = 10;
        const supabase = createBrowserSupabaseClient();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            if (active && (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") && session) {
                setMessage("Link verified. You can now set your new password.");
                setError("");
            }
        });

        const syncRecoverySession = async () => {
            try {
                const {
                    data: { session: existingSession },
                } = await supabase.auth.getSession();

                if (!existingSession && typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
                    const hash = window.location.hash.substring(1);
                    const params = new URLSearchParams(hash);
                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");

                    if (accessToken && refreshToken) {
                        const {
                            data: { session: newSession },
                        } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (newSession && active) {
                            setError("");
                            setMessage("Link verified. You can now set your new password.");
                            return;
                        }
                    }
                }

                if (!existingSession && active) {
                    const hasAccess =
                        typeof window !== "undefined" &&
                        (window.location.hash.includes("access_token=") || window.location.hash.includes("type=recovery"));
                    const hasCode = searchParams.get("code");

                    if (retryCount < maxRetries) {
                        retryCount += 1;
                        const delay = hasAccess || hasCode ? 1500 : 800;
                        window.setTimeout(syncRecoverySession, delay);
                        return;
                    }

                    if (!hasAccess && !hasCode) {
                        setError("Auth session missing. Please ensure you use the latest link from your email.");
                    }
                } else if (existingSession && active) {
                    setError("");
                    setMessage("Link verified. You can now set your new password.");
                }
            } catch (sessionError) {
                if (!active) {
                    return;
                }

                setError(
                    sessionError instanceof Error
                        ? sessionError.message
                        : "Unable to prepare password recovery.",
                );
            }
        };

        void syncRecoverySession();

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [recoveryError, recoveryMode, resetSuccess, searchParams]);

    useEffect(() => {
        if (recoveryError === "otp_only") {
            setError("Email sign-in links are disabled. Please use the 6-digit OTP from your email to continue.");
            setMessage("");
            return;
        }

        if (recoveryError === "invalid_or_expired_link") {
            const details = searchParams.get("details");
            const detailMessage = details ? ` (${details})` : "";
            setError(`This recovery link is invalid or expired. Request a new password reset email.${detailMessage}`);
            setMessage("");
            return;
        }

        if (resetSuccess) {
            setMessage("Password reset successful. You can now log in.");
            setError("");
        }
    }, [recoveryError, resetSuccess, searchParams]);

    useEffect(() => {
        if (!setupMode || defaultMode !== "register") {
            return;
        }

        let active = true;

        const checkSetup = async () => {
            setLoading(true);

            try {
                const response = await fetch("/api/auth/me");
                const result = (await parseResponse(response)) as MeResponse;
                const profile = result.data?.profile;

                if (!active) {
                    return;
                }

                if (result.success && profile) {
                    if (!profile.onboardingCompleted) {
                        setRegisterStep(3);
                        setRegisterData((prev) => ({
                            ...prev,
                            fullName: profile.name && profile.name !== "Learner" ? profile.name : "",
                            email: profile.email || "",
                        }));
                    } else {
                        pushToDashboard();
                    }
                } else {
                    setError("Failed to fetch session. Please log in again.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void checkSetup();

        return () => {
            active = false;
        };
    }, [defaultMode, pushToDashboard, setupMode]);

    const clearFeedback = () => {
        setError("");
        setMessage("");
    };

    const handleRegisterChange = (
        field:
            | "fullName"
            | "email"
            | "countryCode"
            | "mobile"
            | "password"
            | "dateOfBirth"
            | "otp"
            | "studyField"
            | "domain"
            | "companyRole"
            | "city",
        value: string,
    ) => {
        setRegisterData((prev) => ({
            ...prev,
            [field]: field === "otp" ? maskOtpInput(value) : value,
        }));
    };

    const handleLoginOtpChange = (field: "email" | "otp", value: string) => {
        setLoginOtpData((prev) => {
            if (field === "email") {
                return {
                    ...prev,
                    email: value,
                    otpRequested: prev.email === value ? prev.otpRequested : false,
                    otp: prev.email === value ? prev.otp : "",
                };
            }

            return { ...prev, otp: maskOtpInput(value) };
        });
    };

    const handleUserTypeChange = (value: UserType) => {
        setRegisterData((prev) => ({
            ...prev,
            userType: value,
            studyField: value === "student" ? prev.studyField : "",
            domain: value === "working_professional" ? prev.domain : "",
            companyRole: value === "working_professional" ? prev.companyRole : "",
        }));
    };

    const handleRegisterStepBack = (step: RegisterStep) => {
        clearFeedback();
        setRegisterStep(step);
    };

    const handleRegisterRequestOtp = async (event?: FormEvent) => {
        event?.preventDefault();

        if (!isRegisterStepOneValid) {
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: registerData.fullName,
                    email: registerData.email,
                    countryCode: registerData.countryCode,
                    mobile: registerData.mobile,
                    password: registerData.password,
                    dateOfBirth: registerData.dateOfBirth,
                    acceptedTerms: registerData.acceptedTerms,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to send the verification OTP.");
            }

            setRegisterData((prev) => ({ ...prev, otp: "" }));
            setRegisterStep(2);
            setOtpCooldown(30);
            setMessage(`Email OTP sent to ${(data.target as string) || registerData.email}.`);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Failed to send the verification OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterVerifyOtp = async (event: FormEvent) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: registerData.email,
                    otp: registerData.otp,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to verify the OTP.");
            }

            setRegisterStep(3);
            setMessage("Email verified. Complete your profile to finish registration.");
        } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Failed to verify the OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (event: FormEvent) => {
        event.preventDefault();

        if (!isRegisterStepThreeValid) {
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/profile/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: registerData.fullName,
                    preferredServices: [],
                    userType: registerData.userType,
                    studyField: registerData.userType === "student" ? registerData.studyField : "",
                    domain: registerData.userType === "working_professional" ? registerData.domain : "",
                    companyRole: registerData.userType === "working_professional" ? registerData.companyRole : "",
                    city: registerData.city,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to save your profile.");
            }

            setMessage("Registration complete. Redirecting to your dashboard...");
            pushToDashboard();
        } catch (profileError) {
            setError(profileError instanceof Error ? profileError.message : "Failed to save your profile.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (event: FormEvent) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginPasswordData),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to log in with password.");
            }

            setMessage("Login successful. Redirecting to your dashboard...");
            pushToDashboard();
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Failed to log in with password.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRequestOtp = async (event?: FormEvent) => {
        event?.preventDefault();

        if (!isValidEmail(loginOtpData.email)) {
            setError("Enter a valid email address.");
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginOtpData.email }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to send the login OTP.");
            }

            setLoginOtpData((prev) => ({ ...prev, otpRequested: true, otp: "" }));
            setOtpCooldown(30);
            setMessage(`Login OTP sent to ${(data.target as string) || loginOtpData.email}.`);
        } catch (otpError) {
            setError(otpError instanceof Error ? otpError.message : "Failed to send the login OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoginVerifyOtp = async (event: FormEvent) => {
        event.preventDefault();
        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: loginOtpData.email,
                    otp: loginOtpData.otp,
                }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to verify the login OTP.");
            }

            setMessage("Login successful. Redirecting to your dashboard...");
            pushToDashboard();
        } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Failed to verify the login OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordRequest = async (event: FormEvent) => {
        event.preventDefault();

        if (!isValidEmail(forgotEmail)) {
            setError("Enter a valid email address.");
            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await parseResponse(response);

            if (!response.ok || !data.success) {
                throw new Error((data.message as string) || "Failed to send the reset email.");
            }

            setForgotRequestSent(true);
            setMessage(`Password reset link sent to ${(data.target as string) || forgotEmail}.`);
        } catch (forgotError) {
            setError(forgotError instanceof Error ? forgotError.message : "Failed to send the reset email.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        clearFeedback();
        setLoading(true);

        try {
            const supabase = createBrowserSupabaseClient();
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/confirm?next=/register?setup=1`,
                },
            });

            if (googleError) {
                throw googleError;
            }
        } catch (googleError) {
            setError(
                googleError instanceof Error ? googleError.message : "Failed to initialize Google Login.",
            );
            setLoading(false);
        }
    };

    const handleRecoveryReset = async (event: FormEvent) => {
        event.preventDefault();

        if (!isRecoveryValid) {
            if (recoveryData.password !== recoveryData.confirmPassword) {
                setError("Passwords do not match.");
            } else {
                setError("Use a strong password that meets all the rules.");
            }

            return;
        }

        clearFeedback();
        setLoading(true);

        try {
            const supabase = createBrowserSupabaseClient();
            const { error: resetError } = await supabase.auth.updateUser({
                password: recoveryData.password,
            });

            if (resetError) {
                throw new Error(resetError.message || "Failed to reset your password.");
            }

            try {
                await supabase.auth.signOut();
            } catch {
                // Ignore cleanup errors after a successful password reset.
            }

            router.replace("/login?reset=success");
            router.refresh();
        } catch (resetError) {
            setError(resetError instanceof Error ? resetError.message : "Failed to reset your password.");
        } finally {
            setLoading(false);
        }
    };

    const registerPasswordRules = passwordRuleFlags(registerData.password);
    const recoveryPasswordRules = passwordRuleFlags(recoveryData.password);
    const normalizedRegisterMobile = normalizeMobile(registerData.countryCode, registerData.mobile);
    const isRegisterStepOneValid =
        isValidName(registerData.fullName) &&
        isValidEmail(registerData.email) &&
        /^\+\d{8,15}$/.test(normalizedRegisterMobile) &&
        isStrongPassword(registerData.password) &&
        Boolean(registerData.dateOfBirth) &&
        registerData.acceptedTerms;

    const isRegisterStepThreeValid =
        isValidName(registerData.fullName) &&
        registerData.city.trim().length > 0 &&
        ((registerData.userType === "student" && registerData.studyField.trim().length >= 2) ||
            (registerData.userType === "working_professional" &&
                registerData.domain.trim().length >= 2 &&
                registerData.companyRole.trim().length >= 2));

    const isRecoveryValid =
        isStrongPassword(recoveryData.password) &&
        recoveryData.password === recoveryData.confirmPassword;

    const registerValidation = {
        stepOneValid: isRegisterStepOneValid,
        stepThreeValid: isRegisterStepThreeValid,
        otpValid: registerData.otp.length === 6,
        fullNameValid: isValidName(registerData.fullName),
        emailValid: isValidEmail(registerData.email),
        mobileValid: /^\+\d{8,15}$/.test(normalizedRegisterMobile),
        cityValid: registerData.city.trim().length > 0,
        studyFieldValid: registerData.studyField.trim().length >= 2,
        domainValid: registerData.domain.trim().length >= 2,
        companyRoleValid: registerData.companyRole.trim().length >= 2,
        passwordRules: registerPasswordRules,
    };

    const cardTitle =
        defaultMode === "login"
            ? recoveryMode
                ? "Reset your password"
                : "Login to your account"
            : registerStep === 2
                ? "Verify your email"
                : registerStep === 3
                    ? "Complete your profile"
                    : "Create your account";

    const cardDescription =
        defaultMode === "login"
            ? recoveryMode
                ? "Set a new password and return to your dashboard without touching the underlying recovery flow."
                : "Choose the sign-in method that works best for you. Authentication, OTP delivery, and redirects remain unchanged."
            : registerStep === 2
                ? "We sent a one-time code to your email. Enter it below to continue."
                : registerStep === 3
                    ? "Finish the final onboarding details used by the existing profile setup flow."
                    : "Use your email or Google account to start the existing registration and onboarding flow.";

    return (
        <AuthShell mode={defaultMode} cardTitle={cardTitle} cardDescription={cardDescription}>
            {defaultMode === "login" ? (
                <LoginAuthView
                    loading={loading}
                    message={message}
                    error={error}
                    recoveryMode={recoveryMode}
                    loginMode={loginMode}
                    otpCooldown={otpCooldown}
                    forgotOpen={forgotOpen}
                    forgotRequestSent={forgotRequestSent}
                    loginPasswordData={loginPasswordData}
                    loginOtpData={loginOtpData}
                    forgotEmail={forgotEmail}
                    recoveryData={recoveryData}
                    recoveryPasswordRules={recoveryPasswordRules}
                    showLoginPassword={showLoginPassword}
                    showRecoveryPassword={showRecoveryPassword}
                    showRecoveryConfirmPassword={showRecoveryConfirmPassword}
                    onLoginModeChange={(mode) => {
                        clearFeedback();
                        setForgotOpen(false);
                        setLoginMode(mode);
                    }}
                    onToggleForgot={() => {
                        clearFeedback();
                        setForgotRequestSent(false);
                        setForgotEmail(loginPasswordData.email);
                        setForgotOpen((prev) => !prev);
                    }}
                    onForgotClose={() => {
                        clearFeedback();
                        setForgotRequestSent(false);
                        setForgotOpen(false);
                    }}
                    onLoginPasswordChange={(field, value) =>
                        setLoginPasswordData((prev) => ({ ...prev, [field]: value }))
                    }
                    onLoginOtpChange={handleLoginOtpChange}
                    onForgotEmailChange={setForgotEmail}
                    onRecoveryChange={(field, value) =>
                        setRecoveryData((prev) => ({ ...prev, [field]: value }))
                    }
                    onPasswordToggle={() => setShowLoginPassword((prev) => !prev)}
                    onRecoveryPasswordToggle={() => setShowRecoveryPassword((prev) => !prev)}
                    onRecoveryConfirmPasswordToggle={() => setShowRecoveryConfirmPassword((prev) => !prev)}
                    onPasswordLogin={handlePasswordLogin}
                    onLoginRequestOtp={handleLoginRequestOtp}
                    onLoginVerifyOtp={handleLoginVerifyOtp}
                    onForgotPasswordRequest={handleForgotPasswordRequest}
                    onGoogleSignIn={handleGoogleSignIn}
                    onRecoveryReset={handleRecoveryReset}
                />
            ) : (
                <RegisterAuthView
                    loading={loading}
                    message={message}
                    error={error}
                    setupMode={setupMode}
                    registerStep={registerStep}
                    otpCooldown={otpCooldown}
                    registerData={registerData}
                    countryCodes={COUNTRY_CODES}
                    citySuggestions={CITY_SUGGESTIONS}
                    validation={registerValidation}
                    showRegisterPassword={showRegisterPassword}
                    onRegisterChange={handleRegisterChange}
                    onAcceptedTermsChange={(value) =>
                        setRegisterData((prev) => ({ ...prev, acceptedTerms: value }))
                    }
                    onUserTypeChange={handleUserTypeChange}
                    onRegisterPasswordToggle={() => setShowRegisterPassword((prev) => !prev)}
                    onGoogleSignIn={handleGoogleSignIn}
                    onStepBack={handleRegisterStepBack}
                    onRegisterRequestOtp={handleRegisterRequestOtp}
                    onRegisterVerifyOtp={handleRegisterVerifyOtp}
                    onCompleteProfile={handleCompleteProfile}
                />
            )}
        </AuthShell>
    );
}
