"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import {
  LetterLinear,
  LockPasswordLinear,
  EyeLinear,
  EyeClosedLinear,
  AltArrowRightLinear,
  RefreshLinear,
  SunLinear,
  MoonLinear,
} from "solar-icon-set";
import { UserLoginSchema, UserLoginInput } from "@/lib/validations/user.schema";
import { siteConfig } from "@/config/site";

const INPUT_BASE =
  "w-full h-11 rounded-[10px] pl-10 pr-4 text-sm text-[#121212] dark:text-white " +
  "bg-[#FAF9F6] dark:bg-zinc-900 outline-none transition-all border";

const INPUT_VALID =
  "border-[#E8E8EA] dark:border-zinc-800 focus:border-[#D4AF37]/55 focus:ring-[3px] focus:ring-[#D4AF37]/15";

const INPUT_ERROR =
  "border-red-400 focus:border-red-400 focus:ring-[3px] focus:ring-red-400/20";

const LABEL_CLASS =
  "text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B] dark:text-zinc-400 block";

function inputClass(hasError?: boolean, extra = "") {
  return `${INPUT_BASE} ${extra} ${hasError ? INPUT_ERROR : INPUT_VALID}`;
}

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginInput>({
    resolver: zodResolver(UserLoginSchema),
  });

  const onSubmit = async (data: UserLoginInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid credentials. Please verify your email and password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row select-none overflow-hidden bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center relative px-5 py-12 bg-[#F4F1EB] dark:bg-black">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#6B6B6B] dark:text-gray-400 hover:text-[#121212] dark:hover:text-white transition-all cursor-pointer bg-white dark:bg-zinc-900 border border-[#E0DAD0] dark:border-zinc-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-none"
        >
          {theme === "dark" ? (
            <SunLinear className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <MoonLinear className="w-4 h-4" />
          )}
        </button>

        {/* Floating card */}
        <div className="w-full max-w-[420px] rounded-3xl p-8 sm:p-9 bg-white dark:bg-zinc-950 border border-[#E8E8EA] dark:border-zinc-800 shadow-[0_24px_80px_rgba(0,0,0,0.08),_0_2px_0_rgba(212,175,55,0.06)_inset] dark:shadow-[0_24px_80px_rgba(0,0,0,0.4),_0_2px_0_rgba(212,175,55,0.06)_inset]">
          {/* Heading */}
          <div className="mb-6">
            <h1
              className="font-serif font-black text-[#121212] dark:text-white leading-tight mb-1"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
            >
              Welcome Back
            </h1>
            <p className="text-sm text-[#6B6B6B] dark:text-zinc-400 font-medium">
              Sign in to {siteConfig.name} admin
            </p>
            <p className="text-xs text-[#8A8A8A] dark:text-zinc-500 mt-0.5">
              Secure admin access only
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className={LABEL_CLASS}>
                Email Address
              </label>
              <div className="relative">
                <LetterLinear className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#B9975B] pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@legacysports.lk"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  className={inputClass(!!errors.email)}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 dark:text-red-400 font-medium pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className={LABEL_CLASS}>
                Password
              </label>
              <div className="relative">
                <LockPasswordLinear className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#B9975B] pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className={inputClass(!!errors.password, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A] dark:text-zinc-500 hover:text-[#121212] dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeClosedLinear className="w-[18px] h-[18px]" />
                  ) : (
                    <EyeLinear className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 dark:text-red-400 font-medium pl-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Sign in button */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="group w-full h-11 rounded-[10px] font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer mt-1 shadow-[0_4px_18px_rgba(212,175,55,0.32)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.48)]"
              style={{
                background: loading
                  ? "#C5A880"
                  : "linear-gradient(90deg, #C5A880 0%, #D4AF37 50%, #B9975B 100%)",
              }}
            >
              {loading ? (
                <>
                  <RefreshLinear className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Admin</span>
                  <AltArrowRightLinear className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
