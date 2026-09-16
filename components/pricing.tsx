import { ArrowRight, Check } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import styles from "@/components/home/sections.module.css"

// Two claims from the original draft are gone, because the code doesn't back
// them and there's no reason to build limits nobody asked for:
//
//   "15 projects per month"  — there is no project quota anywhere in the
//                              codebase. Projects are unlimited today. Saying
//                              15 would have invented a cap and then required
//                              us to go build it.
//   "Unlimited pages"        — not quite true. Document processing pauses when
//                              an org crosses its monthly AI spend limit
//                              (Settings → Monthly AI usage limit, $20 default).
//                              Stated as the budget it actually is instead.
//
// PRICING MODEL: per seat, matching what the app actually bills. Checkout in
// app/billing/actions.ts sets quantity to the org's live user count, reconciled
// on load by lib/seat-sync.ts, per the Billing decision in docs/DECISIONS.md.
//
// This page briefly quoted a flat per-company rate, which meant /billing quoted
// a 5-person contractor five times what the homepage did. Both numbers below are
// per user, and the note under the CTA says so, so the price a prospect reads
// here is the price the "Total if you subscribe" row shows them later.
const REGULAR_PRICE = "$249"
const FOUNDING_PRICE = "$124"
const SPOTS = 20

const includes = [
  "Unlimited projects and bid forms",
  "Full bid-form reconciliation, PDF and Excel exports",
  "Document reading, with a monthly AI budget you set",
  "Direct input on the product roadmap",
  "Founding rate locked for life",
]

export function Pricing() {
  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-title">
      <div className={styles.atmosphere} data-tone="primary" aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Pricing"
          titleId="pricing-title"
          title={
            <>
              Founding <em>members</em>
            </>
          }
          lead="We're bringing on a small group of founding contractors to shape Constimator and lock in founding pricing as we grow."
        />

        <div className={styles.priceWrap}>
          <div className={`${styles.panel} ${styles.panelPrimary} ${styles.priceCard}`}>
            <div className={styles.priceBanner}>Founding member</div>

            <div className={styles.priceBody}>
              <p className={styles.priceRow}>
                <span className={styles.priceAmount}>{FOUNDING_PRICE}</span>
                <span className={styles.priceUnit}>per user / month</span>
              </p>

              <p className={styles.priceCompare}>
                <s>{REGULAR_PRICE} per user</s> regular price — 50% off, locked
                for life
              </p>

              <ul className={styles.priceList}>
                {includes.map((item) => (
                  <li key={item}>
                    <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:support@constimator.com?subject=Constimator Founding Access"
                className={`${styles.buttonPrimary} ${styles.priceCta}`}
              >
                Request founding access
                <ArrowRight size={16} aria-hidden="true" />
              </a>

              <p className={styles.priceSpots}>Only {SPOTS} spots available</p>
            </div>
          </div>

          {/* Says the same thing app/billing/page.tsx says, in the same words,
              so the seat mechanics aren't a surprise discovered at checkout. */}
          <p className={styles.priceNote}>
            Billed per user. Add or remove an estimator any time — your seat
            count adjusts and prorates on the next invoice.
          </p>

          <p className={styles.priceNote}>
            Every account starts with 30 days free and no credit card — run a
            real bid through it before you pay anything.
          </p>
        </div>
      </div>
    </section>
  )
}
