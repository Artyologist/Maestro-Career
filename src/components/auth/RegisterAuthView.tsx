import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import {
    Divider,
    FeedbackBanner,
    GoogleAuthButton,
    OtpField,
    PasswordChecklist,
    PasswordField,
    PrimaryButton,
    SecondaryButton,
    SelectField,
    StepProgress,
    TextField,
} from "@/components/auth/AuthFormParts";

type RegisterStep = 1 | 2 | 3;
type UserType = "student" | "working_professional";

type RegisterAuthViewProps = {
    loading: boolean;
    message: string;
    error: string;
    setupMode: boolean;
    registerStep: RegisterStep;
    otpCooldown: number;
    registerData: {
        fullName: string;
        email: string;
        countryCode: string;
        mobile: string;
        password: string;
        dateOfBirth: string;
        acceptedTerms: boolean;
        otp: string;
        userType: UserType;
        studyField: string;
        domain: string;
        companyRole: string;
        city: string;
    };
    countryCodes: Array<{ code: string; label: string }>;
    citySuggestions: string[];
    validation: {
        stepOneValid: boolean;
        stepThreeValid: boolean;
        otpValid: boolean;
        fullNameValid: boolean;
        emailValid: boolean;
        mobileValid: boolean;
        cityValid: boolean;
        studyFieldValid: boolean;
        domainValid: boolean;
        companyRoleValid: boolean;
        passwordRules: {
            length: boolean;
            upper: boolean;
            lower: boolean;
            number: boolean;
            special: boolean;
        };
    };
    showRegisterPassword: boolean;
    onRegisterChange: (
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
    ) => void;
    onAcceptedTermsChange: (value: boolean) => void;
    onUserTypeChange: (value: UserType) => void;
    onRegisterPasswordToggle: () => void;
    onGoogleSignIn: () => void;
    onStepBack: (step: RegisterStep) => void;
    onRegisterRequestOtp: (event?: React.FormEvent) => void;
    onRegisterVerifyOtp: (event: React.FormEvent) => void;
    onCompleteProfile: (event: React.FormEvent) => void;
};

export function RegisterAuthView({
    loading,
    message,
    error,
    setupMode,
    registerStep,
    otpCooldown,
    registerData,
    countryCodes,
    citySuggestions,
    validation,
    showRegisterPassword,
    onRegisterChange,
    onAcceptedTermsChange,
    onUserTypeChange,
    onRegisterPasswordToggle,
    onGoogleSignIn,
    onStepBack,
    onRegisterRequestOtp,
    onRegisterVerifyOtp,
    onCompleteProfile,
}: RegisterAuthViewProps) {
    return (
        <div className="space-y-6">
            {message ? <FeedbackBanner tone="success" message={message} /> : null}
            {error ? <FeedbackBanner tone="error" message={error} /> : null}

            {registerStep === 1 && !setupMode ? (
                <>
                    <GoogleAuthButton
                        onClick={onGoogleSignIn}
                        disabled={loading}
                        label={loading ? "Starting Google sign-up..." : "Continue with Google"}
                    />
                    <Divider label="Or register with email" />
                </>
            ) : null}

            <StepProgress
                steps={["Account details", "Verify email", "Complete profile"]}
                currentStep={registerStep}
            />

            <AnimatePresence mode="wait">
                {registerStep === 1 ? (
                    <motion.form
                        key="register-step-1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onSubmit={onRegisterRequestOtp}
                        className="space-y-5"
                    >
                        <TextField
                            id="register-full-name"
                            label="Full name"
                            value={registerData.fullName}
                            onChange={(value) => onRegisterChange("fullName", value)}
                            placeholder="Your full name"
                            autoComplete="name"
                            icon={User}
                            required
                            error={
                                registerData.fullName && !validation.fullNameValid
                                    ? "Use letters and standard punctuation only."
                                    : undefined
                            }
                        />

                        <TextField
                            id="register-email"
                            label="Email address"
                            type="email"
                            value={registerData.email}
                            onChange={(value) => onRegisterChange("email", value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            icon={Mail}
                            required
                            error={
                                registerData.email && !validation.emailValid
                                    ? "Enter a valid email address."
                                    : undefined
                            }
                        />

                        <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                            <SelectField
                                id="register-country-code"
                                label="Country code"
                                value={registerData.countryCode}
                                onChange={(value) => onRegisterChange("countryCode", value)}
                            >
                                {countryCodes.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.label}
                                    </option>
                                ))}
                            </SelectField>

                            <TextField
                                id="register-mobile"
                                label="Mobile number"
                                type="tel"
                                value={registerData.mobile}
                                onChange={(value) => onRegisterChange("mobile", value)}
                                placeholder="Enter your number"
                                autoComplete="tel"
                                inputMode="tel"
                                icon={Phone}
                                required
                                error={
                                    registerData.mobile && !validation.mobileValid
                                        ? "Use a valid number with 8 to 15 digits including country code."
                                        : undefined
                                }
                            />
                        </div>

                        <PasswordField
                            id="register-password"
                            label="Password"
                            value={registerData.password}
                            onChange={(value) => onRegisterChange("password", value)}
                            visible={showRegisterPassword}
                            onToggle={onRegisterPasswordToggle}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                        />

                        <PasswordChecklist
                            items={[
                                { label: "At least 8 characters", met: validation.passwordRules.length },
                                { label: "One uppercase letter", met: validation.passwordRules.upper },
                                { label: "One lowercase letter", met: validation.passwordRules.lower },
                                { label: "One number", met: validation.passwordRules.number },
                                { label: "One special character", met: validation.passwordRules.special },
                            ]}
                        />

                        <TextField
                            id="register-date-of-birth"
                            label="Date of birth"
                            type="date"
                            value={registerData.dateOfBirth}
                            onChange={(value) => onRegisterChange("dateOfBirth", value)}
                            icon={Calendar}
                            required
                        />

                        <label className="flex items-start gap-3 rounded-2xl border border-border/20 bg-background/50 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={registerData.acceptedTerms}
                                onChange={(event) => onAcceptedTermsChange(event.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-border/30 text-primary focus:ring-primary/20 bg-card"
                            />
                            <span className="text-sm leading-6 text-foreground/60">
                                I agree to the{" "}
                                <Link href="/terms-conditions" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                    Terms & Conditions
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy-policy" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-foreground/50">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                    Login
                                </Link>
                                .
                            </p>
                            <PrimaryButton type="submit" disabled={loading || !validation.stepOneValid}>
                                {loading ? "Sending OTP..." : "Continue"}
                            </PrimaryButton>
                        </div>
                    </motion.form>
                ) : null}

                {registerStep === 2 ? (
                    <motion.form
                        key="register-step-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onSubmit={onRegisterVerifyOtp}
                        className="space-y-5"
                    >
                        <div className="rounded-3xl border border-border/20 bg-background/50 p-5">
                            <h3 className="text-base font-semibold text-foreground">Verify your email</h3>
                            <p className="mt-2 text-sm leading-6 text-foreground/60">
                                Enter the 6-digit code we sent to{" "}
                                <span className="font-medium text-foreground">{registerData.email}</span>.
                            </p>
                        </div>

                        <OtpField
                            id="register-otp"
                            label="6-digit OTP"
                            value={registerData.otp}
                            onChange={(value) => onRegisterChange("otp", value)}
                            hint="The code expires automatically. Request a fresh code if needed."
                        />

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <SecondaryButton type="button" onClick={() => onStepBack(1)}>
                                    Back
                                </SecondaryButton>
                                <button
                                    type="button"
                                    onClick={() => void onRegisterRequestOtp()}
                                    disabled={loading || otpCooldown > 0}
                                    className="text-left text-sm font-medium text-foreground/50 transition hover:text-primary disabled:text-foreground/40"
                                >
                                    {otpCooldown > 0 ? `Resend available in ${otpCooldown}s` : "Resend OTP"}
                                </button>
                            </div>
                            <PrimaryButton type="submit" disabled={loading || !validation.otpValid}>
                                {loading ? "Verifying..." : "Verify email"}
                            </PrimaryButton>
                        </div>
                    </motion.form>
                ) : null}

                {registerStep === 3 ? (
                    <motion.form
                        key="register-step-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onSubmit={onCompleteProfile}
                        className="space-y-5"
                    >
                        {setupMode ? (
                            <div className="rounded-3xl border border-primary/30 bg-primary/10 p-5 text-sm leading-6 text-foreground/80">
                                Your Google account is ready. Complete a few profile details to finish onboarding.
                            </div>
                        ) : null}

                        <TextField
                            id="profile-full-name"
                            label="Full name"
                            value={registerData.fullName}
                            onChange={(value) => onRegisterChange("fullName", value)}
                            placeholder="Your full name"
                            autoComplete="name"
                            icon={User}
                            required
                            error={
                                registerData.fullName && !validation.fullNameValid
                                    ? "Use letters and standard punctuation only."
                                    : undefined
                            }
                        />

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-foreground/90">I am a</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => onUserTypeChange("student")}
                                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                        registerData.userType === "student"
                                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                            : "border-border/20 bg-background text-foreground/80 hover:border-border/40 hover:text-foreground"
                                    }`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onUserTypeChange("working_professional")}
                                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                        registerData.userType === "working_professional"
                                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                            : "border-border/20 bg-background text-foreground/80 hover:border-border/40 hover:text-foreground"
                                    }`}
                                >
                                    Working Professional
                                </button>
                            </div>
                        </div>

                        {registerData.userType === "student" ? (
                            <TextField
                                id="profile-study-field"
                                label="Field of study"
                                value={registerData.studyField}
                                onChange={(value) => onRegisterChange("studyField", value)}
                                placeholder="Example: Computer Science"
                                required
                                error={
                                    registerData.studyField && !validation.studyFieldValid
                                        ? "Please enter at least 2 characters."
                                        : undefined
                                }
                            />
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextField
                                    id="profile-domain"
                                    label="Industry or domain"
                                    value={registerData.domain}
                                    onChange={(value) => onRegisterChange("domain", value)}
                                    placeholder="Example: Finance"
                                    required
                                    error={
                                        registerData.domain && !validation.domainValid
                                            ? "Please enter at least 2 characters."
                                            : undefined
                                    }
                                />
                                <TextField
                                    id="profile-role"
                                    label="Job title or role"
                                    value={registerData.companyRole}
                                    onChange={(value) => onRegisterChange("companyRole", value)}
                                    placeholder="Example: Product Analyst"
                                    required
                                    error={
                                        registerData.companyRole && !validation.companyRoleValid
                                            ? "Please enter at least 2 characters."
                                            : undefined
                                    }
                                />
                            </div>
                        )}

                        <TextField
                            id="profile-city"
                            label="City"
                            value={registerData.city}
                            onChange={(value) => onRegisterChange("city", value)}
                            placeholder="Choose or type your city"
                            icon={MapPin}
                            list="auth-city-suggestions"
                            required
                            error={
                                registerData.city && !validation.cityValid
                                    ? "Enter your city to complete the profile."
                                    : undefined
                            }
                        />
                        <datalist id="auth-city-suggestions">
                            {citySuggestions.map((city) => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            {!setupMode ? (
                                <SecondaryButton type="button" onClick={() => onStepBack(2)}>
                                    Back
                                </SecondaryButton>
                            ) : (
                                <div />
                            )}
                            <PrimaryButton type="submit" disabled={loading || !validation.stepThreeValid}>
                                {loading ? "Saving profile..." : "Complete registration"}
                            </PrimaryButton>
                        </div>
                    </motion.form>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
