"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react"

import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { createClient } from "@/lib/supabase/client"
import styles from "@/components/auth/auth-page.module.css"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedRedirect = searchParams.get("redirect")
  // Match the OAuth callback: return only to a path inside this application.
  const redirectTo =
    requestedRedirect && /^\/(?!\/|\\)/.test(requestedRedirect)
      ? requestedRedirect
      : "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(searchParams.get("error"))
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError("We couldn’t sign you in. Check your connection and try again.")
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className={styles.error} role="alert" id="sign-in-error">
          <CircleAlert size={18} aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}
      <GoogleAuthButton
        label="Continue with Google"
        redirectTo={redirectTo}
        onError={setError}
        disabled={loading}
        className={styles.googleButton}
      />
      <div className={styles.divider}>
        <span>or sign in with email</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        aria-label="Sign in"
        aria-busy={loading}
        aria-describedby={error ? "sign-in-error" : undefined}
      >
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <div className={styles.inputWrap}>
            <Mail className={styles.inputIcon} size={18} aria-hidden="true" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              disabled={loading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.passwordLabel}>
            <label htmlFor="password">Password</label>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
          <div className={`${styles.inputWrap} ${styles.passwordWrap}`}>
            <LockKeyhole
              className={styles.inputIcon}
              size={18}
              aria-hidden="true"
            />
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              disabled={loading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={styles.input}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <>
              <LoaderCircle className={styles.spinner} aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </Button>
        <span className={styles.srOnly} role="status">
          {loading ? "Signing in to your workspace…" : ""}
        </span>
      </form>

      <div className={styles.signUp}>
        <p>
          New to Constimator?{" "}
          <Link href="/sign-up">
            Start your free trial <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
        <span>30 days free. No credit card required.</span>
      </div>
    </>
  )
}
