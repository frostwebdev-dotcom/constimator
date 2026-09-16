import Link from "next/link"
import { ArrowRight, Info } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import styles from "@/components/home/sections.module.css"

const intelSummary = [
  { label: "Engineer's estimate", value: "$1,850,000" },
  { label: "Working days", value: "60" },
  { label: "Liquidated damages", value: "$2,500/day" },
  { label: "Prevailing wage", value: "Required" },
]

const reconSummary = [
  { item: "HMA Type A", status: "Match", tone: "success" },
  { item: '18" RCP Class III', status: "Quantity discrepancy", tone: "warning" },
  { item: "Minor Concrete (Curb & Gutter)", status: "Missing from estimate", tone: "danger" },
] as const

export function Proof() {
  return (
    <section id="results" className={styles.section} aria-labelledby="results-title">
      <div className={styles.atmosphere} data-tone="primary" aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Sample project"
          titleId="results-title"
          title={
            <>
              See it on a <em>real project</em>
            </>
          }
        />

        <div className={styles.proofGrid}>
          <div className={`${styles.panel} ${styles.window}`}>
            <div className={styles.windowBar}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <small>Project Intelligence — Shasta County Roadway Improvements</small>
            </div>
            <dl className={styles.statGrid}>
              {intelSummary.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={`${styles.panel} ${styles.window}`}>
            <div className={styles.windowBar}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <small>Reconciliation — Shasta County Roadway Improvements</small>
            </div>
            <ul className={styles.rowList}>
              {reconSummary.map((row) => (
                <li key={row.item}>
                  <span>{row.item}</span>
                  <span className={styles.status} data-tone={row.tone}>
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.proofFooter}>
          <p className={styles.note}>
            <Info size={15} aria-hidden="true" />
            <span>
              Sample project shown for demonstration. Constimator is an early
              prototype built by a former public works contractor.
            </span>
          </p>
          <Link href="/demo-guide" className={styles.buttonPrimary}>
            Explore the sample project
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
