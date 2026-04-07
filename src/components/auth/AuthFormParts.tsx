import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, LucideIcon, XCircle } from "lucide-react";

const fieldBaseClassName =
    "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#01015B] focus:ring-4 focus:ring-[#1DC5FE]/20 disabled:cursor-not-allowed disabled:bg-slate-100";

type FieldWrapperProps = {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
};

export function FieldWrapper({ id, label, hint, error, children }: FieldWrapperProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-slate-800">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-sm text-rose-600">{error}</p>
            ) : hint ? (
                <p className="text-sm text-slate-500">{hint}</p>
            ) : null}
        </div>
    );
}

type TextFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: InputHTMLAttributes<HTMLInputElement>["type"];
    placeholder?: string;
    icon?: LucideIcon;
    hint?: string;
    error?: string;
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
    list?: string;
    className?: string;
};

export function TextField({
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon: Icon,
    hint,
    error,
    inputMode,
    autoComplete,
    required,
    disabled,
    maxLength,
    list,
    className = "",
}: TextFieldProps) {
    return (
        <FieldWrapper id={id} label={label} hint={hint} error={error}>
            <div className="relative">
                {Icon ? (
                    <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                ) : null}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    list={list}
                    className={`${fieldBaseClassName} ${Icon ? "pl-11" : ""} ${className}`.trim()}
                />
            </div>
        </FieldWrapper>
    );
}

type SelectFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
    hint?: string;
    error?: string;
};

export function SelectField({ id, label, value, onChange, children, hint, error }: SelectFieldProps) {
    return (
        <FieldWrapper id={id} label={label} hint={hint} error={error}>
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={fieldBaseClassName}
            >
                {children}
            </select>
        </FieldWrapper>
    );
}

type PasswordFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    visible: boolean;
    onToggle: () => void;
    placeholder?: string;
    hint?: string;
    error?: string;
    autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
};

export function PasswordField({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle,
    placeholder,
    hint,
    error,
    autoComplete,
}: PasswordFieldProps) {
    return (
        <FieldWrapper id={id} label={label} hint={hint} error={error}>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`${fieldBaseClassName} pr-12`}
                    required
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 transition hover:text-[#01015B]"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </FieldWrapper>
    );
}

type FeedbackBannerProps = {
    tone: "success" | "error";
    message: string;
};

export function FeedbackBanner({ tone, message }: FeedbackBannerProps) {
    const isSuccess = tone === "success";

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border px-4 py-3 text-sm ${
                isSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
        >
            <div className="flex items-start gap-3">
                {isSuccess ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
                ) : (
                    <XCircle className="mt-0.5 h-4 w-4 flex-none" />
                )}
                <span>{message}</span>
            </div>
        </motion.div>
    );
}

export function Divider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                {label}
            </span>
            <div className="h-px flex-1 bg-slate-200" />
        </div>
    );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export function PrimaryButton({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#01015B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17177a] focus:outline-none focus:ring-4 focus:ring-[#1DC5FE]/25 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`.trim()}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#01015B]/20 hover:text-[#01015B] focus:outline-none focus:ring-4 focus:ring-[#1DC5FE]/20 disabled:cursor-not-allowed disabled:text-slate-400 ${className}`.trim()}
        >
            {children}
        </button>
    );
}

export function PasswordChecklist({
    items,
}: {
    items: Array<{ label: string; met: boolean }>;
}) {
    return (
        <div className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                    {item.met ? (
                        <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
                    ) : (
                        <div className="h-4 w-4 flex-none rounded-full border border-slate-300" />
                    )}
                    <span className={item.met ? "text-emerald-700" : "text-slate-500"}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export function OtpField({
    id,
    label,
    value,
    onChange,
    hint,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    hint?: string;
}) {
    return (
        <FieldWrapper id={id} label={label} hint={hint}>
            <input
                id={id}
                type="text"
                inputMode="numeric"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                maxLength={6}
                className={`${fieldBaseClassName} px-5 text-center text-2xl font-semibold tracking-[0.45em] sm:text-3xl`}
                placeholder="000000"
                required
            />
        </FieldWrapper>
    );
}

export function StepProgress({
    steps,
    currentStep,
}: {
    steps: string[];
    currentStep: number;
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const active = stepNumber === currentStep;
                const complete = stepNumber < currentStep;

                return (
                    <div key={step} className="space-y-2">
                        <div
                            className={`h-2 rounded-full transition ${
                                complete || active ? "bg-[#01015B]" : "bg-slate-200"
                            }`}
                        />
                        <p className={`text-xs font-medium ${active ? "text-[#01015B]" : "text-slate-500"}`}>
                            Step {stepNumber}: {step}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export function GoogleAuthButton({
    onClick,
    disabled,
    label,
}: {
    onClick: () => void;
    disabled?: boolean;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#01015B]/15 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#1DC5FE]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                />
            </svg>
            {label}
        </button>
    );
}
