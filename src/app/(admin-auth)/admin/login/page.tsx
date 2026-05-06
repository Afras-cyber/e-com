'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserLoginSchema, UserLoginInput } from '@/lib/validations/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* ── Left brand panel ── */}
      <div style={styles.brandPanel}>
        {/* Animated background orbs */}
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.orb3} />

        <div style={styles.brandContent}>
          {/* Logo mark */}
          <div style={styles.logoMark}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M4 28 C8 16, 16 8, 28 10 C36 12, 38 20, 34 26 C30 32, 20 36, 10 34 C6 32, 2 30, 4 28Z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="28" cy="14" r="4" fill="white" opacity="0.5" />
            </svg>
          </div>

          <h1 style={styles.brandName}>STEPKICKS</h1>
          <p style={styles.brandTagline}>Admin Control Centre</p>

          <div style={styles.divider} />

          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>👟</span>
              <span style={styles.statText}>Premium footwear management</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>📦</span>
              <span style={styles.statText}>Real-time order tracking</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>📊</span>
              <span style={styles.statText}>Sales analytics & insights</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🛡️</span>
              <span style={styles.statText}>Secure role-based access</span>
            </div>
          </div>
        </div>

        <p style={styles.brandFooter}>© 2025 StepKicks · All rights reserved</p>
      </div>

      {/* ── Right login panel ── */}
      <div style={styles.loginPanel}>
        <div style={styles.card}>
          {/* Card header */}
          <div style={styles.cardHeader}>
            <div style={styles.cardLogoRow}>
              <div style={styles.cardLogoMark}>
                <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M4 28 C8 16, 16 8, 28 10 C36 12, 38 20, 34 26 C30 32, 20 36, 10 34 C6 32, 2 30, 4 28Z"
                    fill="white"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <span style={styles.cardBrandText}>STEPKICKS</span>
            </div>
            <h2 style={styles.cardTitle}>Welcome back</h2>
            <p style={styles.cardSubtitle}>Sign in to manage your store</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>
                Email address
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@stepkicks.lk"
                  {...register('email')}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {}),
                  }}
                />
              </div>
              {errors.email && (
                <p style={styles.fieldError}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register('password')}
                  style={{
                    ...styles.input,
                    paddingRight: '3rem',
                    ...(errors.password ? styles.inputError : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={styles.fieldError}>{errors.password.message}</p>
              )}
            </div>

            {/* Global error */}
            {error && (
              <div style={styles.errorBanner}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnLoading : {}),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p style={styles.secureNote}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Secured by NextAuth · StepKicks v2025
          </p>
        </div>
      </div>

      {/* Keyframe animations + responsive rules injected inline */}
      <style>{`
        @keyframes sk-float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(40px, -30px) scale(1.08); }
        }
        @keyframes sk-float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-30px, 40px) scale(1.12); }
        }
        @keyframes sk-float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, 25px) scale(0.95); }
        }
        @keyframes sk-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes sk-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Input focus glow ── */
        #email:focus,
        #password:focus {
          border-color: rgba(255, 255, 255, 0.35) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
        }

        /* ── Submit button hover ── */
        button[type="submit"]:not(:disabled):hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.12);
        }
        button[type="submit"]:not(:disabled):active {
          transform: translateY(0);
        }

        /* ── Eye button hover ── */
        button[aria-label]:hover {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* ── Responsive: hide brand panel on narrow screens ── */
        @media (max-width: 768px) {
          .sk-brand-panel { display: none !important; }
          .sk-login-panel { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Inline styles — no external CSS dependency
   Works regardless of which layout is active
───────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily:
      '"Momo Trust Sans", ui-sans-serif, system-ui, -apple-system, sans-serif',
    background: '#0a0a0a',
  },

  /* ── Brand panel ── */
  brandPanel: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '42%',
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #111111 0%, #1a1a1a 40%, #0d0d0d 100%)',
    overflow: 'hidden',
    padding: '48px 40px',
    // Hide on small viewports via a CSS media query workaround
    // (full responsive handling via <style> block below)
  },
  orb1: {
    position: 'absolute',
    top: '-80px',
    right: '-80px',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
    animation: 'sk-float1 9s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute',
    bottom: '60px',
    left: '-100px',
    width: '440px',
    height: '440px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
    animation: 'sk-float2 12s ease-in-out infinite',
  },
  orb3: {
    position: 'absolute',
    top: '45%',
    left: '30%',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
    animation: 'sk-float3 7s ease-in-out infinite',
  },
  brandContent: {
    position: 'relative',
    zIndex: 1,
    animation: 'sk-fadein 0.7s ease both',
  },
  logoMark: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.12)',
    marginBottom: '28px',
  },
  brandName: {
    fontSize: '2.6rem',
    fontWeight: 800,
    letterSpacing: '0.12em',
    color: '#ffffff',
    margin: '0 0 8px 0',
    lineHeight: 1,
  },
  brandTagline: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: 0,
  },
  divider: {
    width: '48px',
    height: '2px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '2px',
    margin: '32px 0',
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  statIcon: {
    fontSize: '1.2rem',
    flexShrink: 0,
  },
  statText: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 400,
  },
  brandFooter: {
    position: 'relative',
    zIndex: 1,
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.25)',
    margin: 0,
  },

  /* ── Login panel ── */
  loginPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    background: '#0f0f0f',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    animation: 'sk-fadein 0.55s ease 0.1s both',
  },
  cardHeader: {
    marginBottom: '36px',
  },
  cardLogoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '28px',
  },
  cardLogoMark: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  cardBrandText: {
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.5)',
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  cardSubtitle: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },

  /* ── Form ── */
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: '0.02em',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    height: '48px',
    paddingLeft: '42px',
    paddingRight: '14px',
    borderRadius: '12px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.6)',
    background: 'rgba(239, 68, 68, 0.05)',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '6px',
    transition: 'color 0.2s',
  },
  fieldError: {
    fontSize: '0.78rem',
    color: '#f87171',
    margin: 0,
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#f87171',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    height: '50px',
    borderRadius: '12px',
    border: 'none',
    background: '#ffffff',
    color: '#0a0a0a',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s',
    marginTop: '4px',
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(10,10,10,0.2)',
    borderTopColor: '#0a0a0a',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'sk-spin 0.7s linear infinite',
    flexShrink: 0,
  },
  secureNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '28px',
    fontSize: '0.73rem',
    color: 'rgba(255,255,255,0.2)',
  },
};
