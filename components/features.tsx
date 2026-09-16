import {
  CheckCircle2,
  FileOutput,
  FileText,
  ListChecks,
  Scale,
} from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import styles from "@/components/home/sections.module.css"

// Document reading (the first two cards) is real — the extraction worker ships
// and runs — but docs/PILOT_CHECKLIST.md keeps it out of scope for the pilot
// because it hasn't been validated against real plan sets yet. So it stays on
// the page wearing this badge rather than being sold flat. Drop the badge when
// the checklist stops warning contractors off it.
function EarlyAccessBadge() {
  return <span className={styles.chip}>Early access</span>
}

const flags = [
  "Missing bid items",
  "Quantity discrepancies",
  "Unit mismatches",
  "Low-confidence items that need a human look",
]

export function Features() {
  return (
    <section
      id="what-it-does"
      className={styles.section}
      aria-labelledby="what-it-does-title"
    >
      <div className={styles.atmosphere} data-tone="glow" aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="What it does"
          titleId="what-it-does-title"
          title={
            <>
              From bid documents to a bid you can <em>trust</em>
            </>
          }
        />

        <div className={styles.featureList}>
          <article className={`${styles.panel} ${styles.featureRow}`}>
            <span className={styles.iconTile} data-tone="glow" aria-hidden="true">
              <FileText size={20} strokeWidth={1.8} />
            </span>
            <div className={styles.featureBody}>
              <div className={styles.featureTitleRow}>
                <h3 className={styles.featureTitle}>Reads your bid documents</h3>
                <EarlyAccessBadge />
              </div>
              <p className={styles.featureText}>
                Upload the plans, specs, addenda, and official bid form.
                Constimator reads them and pulls out what matters — project
                summary, scope items, schedules, and requirements — so
                you&apos;re not hunting through hundreds of pages. This is the
                newest part of the product and still being validated against
                real plan sets: treat it as a head start, not a replacement for
                your own takeoff.
              </p>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.featureRow}`}>
            <span className={styles.iconTile} data-tone="review" aria-hidden="true">
              <ListChecks size={20} strokeWidth={1.8} />
            </span>
            <div className={styles.featureBody}>
              <div className={styles.featureTitleRow}>
                <h3 className={styles.featureTitle}>Bid requirements in one summary</h3>
                <EarlyAccessBadge />
              </div>
              <p className={styles.featureText}>
                Constimator reads the DBE/DVBE participation goal off the specs
                — the percentage, which certification it calls for, and the link
                the specs print for obtaining the documents — tied back to the
                page it came from. The engineer&apos;s estimate and bid deadline
                you enter when you create the project sit alongside it. Goal
                extraction is new and still being validated against real spec
                books.
              </p>
            </div>
          </article>

          <article
            id="reconciliation-details"
            className={`${styles.panel} ${styles.panelPrimary} ${styles.featureRow}`}
            data-primary="true"
          >
            <span className={styles.iconTile} data-tone="primarySolid" aria-hidden="true">
              <Scale size={21} strokeWidth={1.8} />
            </span>
            <div className={styles.featureBody}>
              <div className={styles.featureTitleRow}>
                <h3 className={styles.featureTitle}>
                  Reconciles against the official bid form
                </h3>
                <span className={styles.chip} data-tone="primary">
                  The differentiator
                </span>
              </div>
              <p className={styles.featureText}>
                {/* Was "official quantity vs. what it read in the plans vs.
                    what's in your estimate". lib/reconciliation-diff.ts is a
                    two-way compare — the official bid item against your
                    estimate line — so the three-way version described a
                    product that doesn't exist. */}
                This is what nothing else does. Constimator compares your
                estimate against the official bid form, line by line — every
                official bid item against every line of your estimate — and
                flags each mismatch:
              </p>
              <ul className={styles.flagGrid}>
                {flags.map((flag) => (
                  <li key={flag}>
                    <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.featureRow}`}>
            <span className={styles.iconTile} data-tone="success" aria-hidden="true">
              <FileOutput size={20} strokeWidth={1.8} />
            </span>
            <div className={styles.featureBody}>
              <h3 className={styles.featureTitle}>Exports clean reports</h3>
              <p className={styles.featureText}>
                Estimate summary and a full reconciliation report, in PDF or
                Excel, with every number&apos;s source clearly marked —
                official, AI-extracted, or your own entry.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
