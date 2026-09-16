import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  FileCheck2,
  HardHat,
  ShieldCheck,
} from "lucide-react"

import styles from "./auth-page.module.css"

function Brand() {
  return (
    <Link href="/" className={styles.brand} aria-label="Constimator home">
      <span className={styles.brandMark} aria-hidden="true">
        <HardHat size={26} strokeWidth={1.7} />
      </span>
      <span>
        Constimator
        <span className={styles.brandCaption}>BID WITH CONFIDENCE</span>
      </span>
    </Link>
  )
}

export function AuthPage({
  children,
  headingId,
  mode = "sign-in",
}: {
  children: ReactNode
  headingId: string
  mode?: "sign-in" | "sign-up"
}) {
  const isSignUp = mode === "sign-up"

  return (
    <main className={`${styles.page} theme-dark`}>
      <section className={styles.story} aria-labelledby="story-heading">
        <Image
          src="/images/construction-sunset.webp"
          alt=""
          fill
          sizes="(max-width: 960px) 1px, 56vw"
          className={styles.scene}
        />
        <div className={styles.storyShade} />
        <div className={styles.storyHeader}>
          <Brand />
        </div>

        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>
            <span /> BUILT FOR PUBLIC WORKS CONTRACTORS
          </p>
          <h2 id="story-heading">
            {isSignUp ? "Build your next bid" : "Great bids start"}
            <br />
            with <span>{isSignUp ? "confidence." : "every detail."}</span>
          </h2>
          <p className={styles.storyDescription}>
            {isSignUp
              ? "Bring your bid documents together. Find the gaps."
              : "Bring your documents together. Catch what matters."}
            <br />
            {isSignUp
              ? "Start your next project with a clearer picture."
              : "Head into bid day with confidence."}
          </p>
        </div>

        <div className={styles.storyBottom}>
          <div className={styles.reviewStack}>
            <div className={styles.reviewCard}>
              <div className={styles.reviewHeading}>
                <span className={styles.reviewIcon}>
                  <FileCheck2 size={24} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <p>EVERY ITEM. EVERY DETAIL.</p>
                  <h3>A clearer path to bid day.</h3>
                </div>
                <ShieldCheck
                  className={styles.reviewShield}
                  size={23}
                  aria-hidden="true"
                />
              </div>
              <ul className={styles.checks}>
                <li>
                  <Check aria-hidden="true" />
                  Find missing items
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Check quantities
                </li>
                <li>
                  <Check aria-hidden="true" />
                  Match bid units
                </li>
              </ul>
            </div>
          </div>
          <p className={styles.storyFootnote}>
            <span />
            Built by a contractor. For contractors who build America.
          </p>
        </div>
      </section>

      <section className={styles.formPanel} aria-labelledby={headingId}>
        <header className={styles.panelHeader}>
          <div className={styles.mobileBrand}>
            <Brand />
          </div>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to home</span>
          </Link>
        </header>

        <div className={styles.formArea}>{children}</div>

        <footer className={styles.panelFooter}>
          <span>Every detail. No surprises.</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      </section>
    </main>
  )
}
