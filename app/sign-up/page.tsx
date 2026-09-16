import type { Metadata } from "next"

import { AuthPage } from "@/components/auth/auth-page"
import { SignUpForm } from "./sign-up-form"

export const metadata: Metadata = {
  title: "Create your account | Constimator",
  description:
    "Start your 30-day free trial of Constimator. Bring your bid documents together and head into bid day with confidence.",
}

export default function SignUpPage() {
  return (
    <AuthPage headingId="sign-up-heading" mode="sign-up">
      <SignUpForm />
    </AuthPage>
  )
}
