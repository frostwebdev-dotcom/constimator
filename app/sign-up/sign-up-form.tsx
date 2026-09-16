"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MailCheck,
  UserRoundPlus,
} from "lucide-react"

import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { createClient } from "@/lib/supabase/client"
import shared from "@/components/auth/auth-page.module.css"
import styles from "./sign-up.module.css"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const confirmationHeading = useRef<HTMLHeadingElement>(null)
  const emailInput = useRef<HTMLInputElement>(null)
  const editingEmail = useRef(false)

  useEffect(() => {
    if (submitted) confirmationHeading.current?.focus()
    else if (editingEmail.current) {
      emailInput.current?.focus()
      emailInput.current?.select()
      editingEmail.current = false
    }
  }, [submitted])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setPassword("")
      setSubmitted(true)
    } catch {
      setError(
        "We couldn’t create your account. Check your connection and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  function changeEmail() {
    editingEmail.current = true
    setError(null)
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className={styles.confirmation}>
        <div className={shared.formIntro}>
          <span className={styles.confirmationIcon} aria-hidden="true">
            <MailCheck size={30} strokeWidth={1.6} />
            <span>
              <Check size={12} />
            </span>
          </span>
          <p className={shared.formEyebrow}>ONE MORE STEP</p>
          <h1
            id="sign-up-heading"
            ref={confirmationHeading}
            tabIndex={-1}
            className={styles.confirmationHeading}
          >
            Check your inbox.
          </h1>
          <p>Confirm your email to finish creating your account.</p>
        </div>
        <div className={styles.emailCard} role="status">
          <Mail size={21} aria-hidden="true" />
          <div>
            <span>Look for a confirmation link at</span>
            <strong>{email}</strong>
          </div>
        </div>
        <ol className={styles.nextSteps}>
          <li>
            <span>1</span>
            <p>Open your confirmation email.</p>
          </li>
          <li>
            <span>2</span>
            <p>Follow the confirmation link to get started.</p>
          </li>
        </ol>
        <p className={styles.inboxHint}>
          Can’t find it? Check your spam folder. The email may take a few
          minutes to arrive.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/sign-in" />}
          className={shared.submitButton}
        >
          Back to sign in
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
        <button
          type="button"
          className={styles.changeEmail}
          onClick={changeEmail}
        >
          Use a different email address
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={`${shared.formIntro} ${styles.intro}`}>
        <div className={styles.trialIntro}>
          <span className={shared.welcomeIcon} aria-hidden="true">
            <UserRoundPlus size={24} strokeWidth={1.6} />
          </span>
          <div>
            <p>YOUR 30-DAY FREE TRIAL</p>
            <span>
              <Check size={12} aria-hidden="true" />
              No credit card required
            </span>
          </div>
        </div>
        <h1 id="sign-up-heading">Create your account.</h1>
        <p>Your next bid starts here.</p>
      </div>

      {error && (
        <div className={shared.error} role="alert" id="sign-up-error">
          <CircleAlert size={18} aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <GoogleAuthButton
        label="Sign up with Google"
        onError={setError}
        disabled={loading}
        className={shared.googleButton}
      />
      <div className={shared.divider}>
        <span>or sign up with email</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className={shared.form}
        aria-label="Create your account"
        aria-busy={loading}
        aria-describedby={error ? "sign-up-error" : undefined}
      >
        <div className={shared.field}>
          <label htmlFor="email">Email</label>
          <div className={shared.inputWrap}>
            <Mail className={shared.inputIcon} size={18} aria-hidden="true" />
            <Input
              ref={emailInput}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              disabled={loading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={shared.input}
            />
          </div>
        </div>
        <div className={shared.field}>
          <label htmlFor="password">Password</label>
          <div className={`${shared.inputWrap} ${shared.passwordWrap}`}>
            <LockKeyhole
              className={shared.inputIcon}
              size={18}
              aria-hidden="true"
            />
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              minLength={6}
              required
              disabled={loading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby="password-hint"
              className={shared.input}
            />
          </div>
          <p id="password-hint" className={styles.passwordHint}>
            Use at least 6 characters.
          </p>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={shared.submitButton}
        >
          {loading ? (
            <>
              <LoaderCircle className={shared.spinner} aria-hidden="true" />
              Creating account…
            </>
          ) : (
            <>
              Sign up
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </Button>
        <span className={shared.srOnly} role="status">
          {loading ? "Creating your Constimator account…" : ""}
        </span>
      </form>

      <p className={styles.terms}>
        By signing up, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <div className={`${shared.signUp} ${styles.signInLink}`}>
        <p>
          Already have an account?{" "}
          <Link href="/sign-in">
            Sign in <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </>
  )
}
