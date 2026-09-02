"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserLoginSchema, UserLoginInput } from "@/lib/validations/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
  LetterLinear,
  LockPasswordLinear,
  EyeLinear,
  EyeClosedLinear,
  ShieldCheckLinear,
  AltArrowRightLinear,
  RefreshLinear,
  SunLinear,
  MoonLinear,
  StarShineLinear,
} from "solar-icon-set";
import { siteConfig } from "@/config/site";

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
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hi! I need help with the admin portal.",
  )}`;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row select-none overflow-hidden bg-background text-foreground">
      {/* ─── LEFT PANEL — Cream product showcase ─── */}
      <div
        className="relative w-full lg:w-[54%] min-h-[420px] lg:min-h-screen flex flex-col justify-between overflow-hidden dark:hidden"
        style={{
          background:
            "linear-gradient(135deg, #F8F6F0 0%, #F0EDE4 60%, #EAE5D8 100%)",
        }}
      >
        {/* Subtle diagonal texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #B9975B 0px, #B9975B 1px, transparent 1px, transparent 10px)",
          }}
        />

        {/* Top Nav */}
        <div className="relative z-10 flex items-center justify-between px-8 pt-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-serif font-black text-xl tracking-widest text-[#121212] uppercase">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        {/* Centre — Tilted shoe card */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-6">
          {/* LEGACY watermark */}
          <span
            className="absolute inset-0 flex items-center justify-center font-serif font-black uppercase pointer-events-none select-none"
            style={{
              fontSize: "clamp(4rem, 11vw, 9rem)",
              letterSpacing: "0.4em",
              color: "rgba(185,151,91,0.065)",
            }}
            aria-hidden="true"
          >
            LEGACY
          </span>

          {/* Tilted card with shoe */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: "min(320px, 75vw)",
              aspectRatio: "1 / 1",
              background: "linear-gradient(145deg, #FDFCF8 0%, #F3EFE5 100%)",
              transform: "rotate(-8deg)",
              boxShadow:
                "0 40px 90px rgba(0,0,0,0.18), 0 8px 24px rgba(185,151,91,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              style={{ border: "1px solid rgba(212,175,55,0.18)" }}
            />
            <Image
              src="/sample_shoe_01.png"
              alt="Legacy Signature Shoe"
              fill
              priority
              sizes="320px"
              className="object-contain p-6 drop-shadow-[0_20px_30px_rgba(0,0,0,0.22)]"
              style={{ transform: "rotate(8deg) scale(1.05)" }}
            />
          </div>
        </div>
      </div>

      {/* Dark mode version of LEFT PANEL */}
      <div
        className="hidden relative w-full lg:w-[54%] min-h-[420px] lg:min-h-screen flex-col justify-between overflow-hidden dark:flex"
        style={{
          background:
            "linear-gradient(135deg, #121212 0%, #1a1a1a 60%, #222222 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #B9975B 0px, #B9975B 1px, transparent 1px, transparent 10px)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between px-8 pt-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-serif font-black text-xl tracking-widest text-white uppercase">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-6">
          <span
            className="absolute inset-0 flex items-center justify-center font-serif font-black uppercase pointer-events-none select-none"
            style={{
              fontSize: "clamp(4rem, 11vw, 9rem)",
              letterSpacing: "0.4em",
              color: "rgba(185,151,91,0.065)",
            }}
            aria-hidden="true"
          >
            LEGACY
          </span>

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: "min(320px, 75vw)",
              aspectRatio: "1 / 1",
              background: "linear-gradient(145deg, #1c1c1c 0%, #2a2a2a 100%)",
              transform: "rotate(-8deg)",
              boxShadow:
                "0 40px 90px rgba(0,0,0,0.3), 0 8px 24px rgba(185,151,91,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              style={{ border: "1px solid rgba(212,175,55,0.18)" }}
            />
            <Image
              src="/sample_shoe_01.png"
              alt="LS Signature Shoe"
              fill
              priority
              sizes="320px"
              className="object-contain p-6 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
              style={{ transform: "rotate(8deg) scale(1.05)" }}
            />
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Login card ─── */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-5 py-12 bg-[#F4F1EB] dark:bg-black">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#6B6B6B] dark:text-gray-400 hover:text-[#121212] dark:hover:text-white transition-all cursor-pointer bg-white dark:bg-zinc-900 border border-[#E0DAD0] dark:border-zinc-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-none"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunLinear className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <MoonLinear className="w-4 h-4" />
          )}
        </button>

        {/* Floating card */}
        <div className="w-full max-w-[420px] rounded-3xl p-8 sm:p-9 bg-white dark:bg-zinc-950 border border-[#E8E8EA] dark:border-zinc-800 shadow-[0_24px_80px_rgba(0,0,0,0.08),_0_2px_0_rgba(212,175,55,0.06)_inset] dark:shadow-[0_24px_80px_rgba(0,0,0,0.4),_0_2px_0_rgba(212,175,55,0.06)_inset]">
          {/* Badge row */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] text-[#B9975B] border border-[#D4AF37]/45">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#D4AF37]" />
              Est. 2026 • Admin
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Private
            </span>
          </div>

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
            <div className="mb-5 p-3.5 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B] dark:text-zinc-400 block">
                Email Address
              </label>
              <div className="relative">
                <LetterLinear className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#B9975B] pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@legacysports.lk"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full h-11 rounded-[10px] pl-10 pr-4 text-sm text-[#121212] dark:text-white bg-[#FAF9F6] dark:bg-zinc-900 outline-none transition-all border ${errors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-[3px] focus:ring-red-400/20"
                      : "border-[#E8E8EA] dark:border-zinc-800 focus:border-[#D4AF37]/55 focus:ring-[3px] focus:ring-[#D4AF37]/15"
                    }`}
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
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B] dark:text-zinc-400 block">
                  Password
                </label>
              </div>
              <div className="relative">
                <LockPasswordLinear className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#B9975B] pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full h-11 rounded-[10px] pl-10 pr-11 text-sm text-[#121212] dark:text-white bg-[#FAF9F6] dark:bg-zinc-900 outline-none transition-all border ${errors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-[3px] focus:ring-red-400/20"
                      : "border-[#E8E8EA] dark:border-zinc-800 focus:border-[#D4AF37]/55 focus:ring-[3px] focus:ring-[#D4AF37]/15"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A] dark:text-zinc-500 hover:text-[#121212] dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="w-full h-11 rounded-[10px] font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer mt-1"
              style={{
                background: loading
                  ? "#C5A880"
                  : "linear-gradient(90deg, #C5A880 0%, #D4AF37 50%, #B9975B 100%)",
                boxShadow: "0 4px 18px rgba(212,175,55,0.32)",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 28px rgba(212,175,55,0.48)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 18px rgba(212,175,55,0.32)";
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

