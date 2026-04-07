import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import {
    Divider,
    FeedbackBanner,
    GoogleAuthButton,
    OtpField,
    PasswordChecklist,
    PasswordField,
    PrimaryButton,
    SecondaryButton,
    TextField,
} from "@/components/auth/AuthFormParts";

type LoginMode = "password" | "otp";

type LoginAuthViewProps = {
    loading: boolean;
    message: string;
    error: string;
    recoveryMode: boolean;
    loginMode: LoginMode;
    otpCooldown: number;
    forgotOpen: boolean;
    forgotRequestSent: boolean;
    loginPasswordData: {
        email: string;
        password: string;
    };
    loginOtpData: {
        email: string;
        otp: string;
        otpRequested: boolean;
    };
    forgotEmail: string;
    recoveryData: {
        password: string;
        confirmPassword: string;
    };
    recoveryPasswordRules: {
        length: boolean;
        upper: boolean;
        lower: boolean;
        number: boolean;
        special: boolean;
    };
    showLoginPassword: boolean;
    showRecoveryPassword: boolean;
    showRecoveryConfirmPassword: boolean;
    onLoginModeChange: (mode: LoginMode) => void;
    onToggleForgot: () => void;
    onForgotClose: () => void;
    onLoginPasswordChange: (field: "email" | "password", value: string) => void;
    onLoginOtpChange: (field: "email" | "otp", value: string) => void;
    onForgotEmailChange: (value: string) => void;
    onRecoveryChange: (field: "password" | "confirmPassword", value: string) => void;
    onPasswordToggle: () => void;
    onRecoveryPasswordToggle: () => void;
    onRecoveryConfirmPasswordToggle: () => void;
    onPasswordLogin: (event: React.FormEvent) => void;
    onLoginRequestOtp: (event?: React.FormEvent) => void;
    onLoginVerifyOtp: (event: React.FormEvent) => void;
    onForgotPasswordRequest: (event: React.FormEvent) => void;
    onGoogleSignIn: () => void;
    onRecoveryReset: (event: React.FormEvent) => void;
};

export function LoginAuthView({
    loading,
    message,
    error,
    recoveryMode,
    loginMode,
    otpCooldown,
    forgotOpen,
    forgotRequestSent,
    loginPasswordData,
    loginOtpData,
    forgotEmail,
    recoveryData,
    recoveryPasswordRules,
    showLoginPassword,
    showRecoveryPassword,
    showRecoveryConfirmPassword,
    onLoginModeChange,
    onToggleForgot,
    onForgotClose,
    onLoginPasswordChange,
    onLoginOtpChange,
    onForgotEmailChange,
    onRecoveryChange,
    onPasswordToggle,
    onRecoveryPasswordToggle,
    onRecoveryConfirmPasswordToggle,
    onPasswordLogin,
    onLoginRequestOtp,
    onLoginVerifyOtp,
    onForgotPasswordRequest,
    onGoogleSignIn,
    onRecoveryReset,
}: LoginAuthViewProps) {
    const passwordsMatch =
        recoveryData.password.length > 0 &&
        recoveryData.confirmPassword.length > 0 &&
        recoveryData.password === recoveryData.confirmPassword;

    return (
        <div className="space-y-6">
            {message ? <FeedbackBanner tone="success" message={message} /> : null}
            {error ? <FeedbackBanner tone="error" message={error} /> : null}

            {recoveryMode ? (
                <form onSubmit={onRecoveryReset} className="space-y-5">
                    <PasswordField
                        id="recovery-password"
                        label="New password"
                        value={recoveryData.password}
                        onChange={(value) => onRecoveryChange("password", value)}
                        visible={showRecoveryPassword}
                        onToggle={onRecoveryPasswordToggle}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                    />
                    <PasswordField
                        id="recovery-confirm-password"
                        label="Confirm password"
                        value={recoveryData.confirmPassword}
                        onChange={(value) => onRecoveryChange("confirmPassword", value)}
                        visible={showRecoveryConfirmPassword}
                        onToggle={onRecoveryConfirmPasswordToggle}
                        placeholder="Repeat your new password"
                        autoComplete="new-password"
                    />

                    <PasswordChecklist
                        items={[
                            { label: "At least 8 characters", met: recoveryPasswordRules.length },
                            { label: "One uppercase letter", met: recoveryPasswordRules.upper },
                            { label: "One lowercase letter", met: recoveryPasswordRules.lower },
                            { label: "One number", met: recoveryPasswordRules.number },
                            { label: "One special character", met: recoveryPasswordRules.special },
                            { label: "Passwords match", met: passwordsMatch },
                        ]}
                    />

                    <PrimaryButton
                        type="submit"
                        disabled={
                            loading ||
                            !recoveryPasswordRules.length ||
                            !recoveryPasswordRules.upper ||
                            !recoveryPasswordRules.lower ||
                            !recoveryPasswordRules.number ||
                            !recoveryPasswordRules.special ||
                            !passwordsMatch
                        }
                        className="w-full"
                    >
                        {loading ? "Updating password..." : "Reset password"}
                    </PrimaryButton>

                    <p className="text-sm text-slate-500">
                        Return to{" "}
                        <Link href="/login" className="font-medium text-[#01015B] hover:text-[#1DC5FE]">
                            login
                        </Link>
                        .
                    </p>
                </form>
            ) : (
                <>
                    <GoogleAuthButton
                        onClick={onGoogleSignIn}
                        disabled={loading}
                        label={loading ? "Starting Google sign-in..." : "Continue with Google"}
                    />

                    <Divider label="Or continue with email" />

                    <div className="inline-flex rounded-full bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={() => onLoginModeChange("password")}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                loginMode === "password"
                                    ? "bg-white text-[#01015B] shadow-sm"
                                    : "text-slate-500 hover:text-[#01015B]"
                            }`}
                        >
                            Password
                        </button>
                        <button
                            type="button"
                            onClick={() => onLoginModeChange("otp")}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                loginMode === "otp"
                                    ? "bg-white text-[#01015B] shadow-sm"
                                    : "text-slate-500 hover:text-[#01015B]"
                            }`}
                        >
                            Email OTP
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {loginMode === "password" ? (
                            <motion.form
                                key="password-login"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                onSubmit={onPasswordLogin}
                                className="space-y-5"
                            >
                                <TextField
                                    id="login-email"
                                    label="Email address"
                                    type="email"
                                    value={loginPasswordData.email}
                                    onChange={(value) => onLoginPasswordChange("email", value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    icon={Mail}
                                    required
                                />
                                <PasswordField
                                    id="login-password"
                                    label="Password"
                                    value={loginPasswordData.password}
                                    onChange={(value) => onLoginPasswordChange("password", value)}
                                    visible={showLoginPassword}
                                    onToggle={onPasswordToggle}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />

                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={onToggleForgot}
                                        className="text-sm font-medium text-[#01015B] hover:text-[#1DC5FE]"
                                    >
                                        Forgot your password?
                                    </button>
                                    <PrimaryButton type="submit" disabled={loading}>
                                        {loading ? "Signing in..." : "Login"}
                                    </PrimaryButton>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp-login"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                onSubmit={loginOtpData.otpRequested ? onLoginVerifyOtp : onLoginRequestOtp}
                                className="space-y-5"
                            >
                                <TextField
                                    id="login-otp-email"
                                    label="Email address"
                                    type="email"
                                    value={loginOtpData.email}
                                    onChange={(value) => onLoginOtpChange("email", value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    icon={Mail}
                                    required
                                />

                                {loginOtpData.otpRequested ? (
                                    <OtpField
                                        id="login-otp-code"
                                        label="6-digit OTP"
                                        value={loginOtpData.otp}
                                        onChange={(value) => onLoginOtpChange("otp", value)}
                                        hint="Enter the code sent to your email inbox."
                                    />
                                ) : null}

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={() => void onLoginRequestOtp()}
                                        disabled={loading || otpCooldown > 0}
                                        className="text-left text-sm font-medium text-slate-500 transition hover:text-[#01015B] disabled:text-slate-400"
                                    >
                                        {otpCooldown > 0 ? `Resend available in ${otpCooldown}s` : "Resend OTP"}
                                    </button>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={loading || (loginOtpData.otpRequested && loginOtpData.otp.length !== 6)}
                                    >
                                        {loading
                                            ? loginOtpData.otpRequested
                                                ? "Verifying..."
                                                : "Sending..."
                                            : loginOtpData.otpRequested
                                                ? "Verify OTP"
                                                : "Send OTP"}
                                    </PrimaryButton>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {forgotOpen ? (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={onForgotPasswordRequest}
                                className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-base font-semibold text-slate-900">Reset password</h3>
                                        <p className="text-sm leading-6 text-slate-600">
                                            We&apos;ll email a secure recovery link to this address.
                                        </p>
                                    </div>

                                    <TextField
                                        id="forgot-email"
                                        label="Email address"
                                        type="email"
                                        value={forgotEmail}
                                        onChange={onForgotEmailChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        icon={Mail}
                                        required
                                    />

                                    {forgotRequestSent ? (
                                        <p className="text-sm text-emerald-700">
                                            Reset link sent. Please check your inbox.
                                        </p>
                                    ) : null}

                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        <SecondaryButton type="button" onClick={onForgotClose}>
                                            Cancel
                                        </SecondaryButton>
                                        <PrimaryButton type="submit" disabled={loading}>
                                            {loading ? "Sending..." : "Send reset link"}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </motion.form>
                        ) : null}
                    </AnimatePresence>

                    <p className="text-sm text-slate-500">
                        New here?{" "}
                        <Link href="/register" className="font-medium text-[#01015B] hover:text-[#1DC5FE]">
                            Create an account
                        </Link>
                        .
                    </p>
                </>
            )}
        </div>
    );
}
