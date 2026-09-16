import { Suspense } from "react"
import type { Metadata } from "next"
import { LoaderCircle, LogIn } from "lucide-react"

import { AuthPage } from "@/components/auth/auth-page"
import styles from "@/components/auth/auth-page.module.css"
import { SignInForm } from "./sign-in-form"

export const metadata: Metadata = {
  title: "Sign in | Constimator",
  description:
    "Sign in to your Constimator workspace and get back to building your next bid.",
}

export default function SignInPage() {
  return (
    <AuthPage headingId="sign-in-heading">
      <div className={styles.formIntro}>
        <span className={styles.welcomeIcon} aria-hidden="true">
          <LogIn size={25} strokeWidth={1.6} />
        </span>
        <p className={styles.formEyebrow}>YOUR NEXT PROJECT STARTS HERE</p>
        <h1 id="sign-in-heading">Welcome back.</h1>
        <p>Sign in to your Constimator workspace.</p>
      </div>
      <Suspense
        fallback={
          <div className={styles.formLoading} role="status">
            <LoaderCircle className={styles.spinner} aria-hidden="true" />
            Loading sign-in…
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </AuthPage>
  )
}
