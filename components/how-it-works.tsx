import { Calculator, ClipboardList, Scale } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import styles from "@/components/home/sections.module.css"

// Step 01 is deliberately the manual path, because that is the path
// docs/PILOT_CHECKLIST.md step 5 actually walks contractors through: bid form
// line items are entered by hand, there is no upload-and-auto-fill yet. Promise
// the thing they will really do.
const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Enter the official bid form",
    description:
      "Item by item — description, unit, official quantity, spec section. Upload the plans, specs, and addenda alongside it so the whole set lives with the project.",
  },
  {
    number: "02",
    icon: Calculator,
    title: "Build your estimate your way",
    description:
      "Keep estimating the way you already do — your quantities, your unit prices, your labor and equipment rates. Constimator never overwrites your numbers.",
  },
  {
    number: "03",
    icon: Scale,
    title: "Reconcile before you submit",
    description:
      "Constimator checks your estimate against the official bid form and flags anything missing or off — so you fix it before bid day, not after.",
  },
] as const

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={styles.section}
      aria-labelledby="how-it-works-title"
    >
      <div className={styles.atmosphere} data-tone="quiet" aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="How it works"
          titleId="how-it-works-title"
          title={
            <>
              Three steps to a bid you&apos;ve <em>double-checked</em>
            </>
          }
        />

        <ol className={styles.stepper}>
          {steps.map(({ number, icon: Icon, title, description }) => (
            <li
              key={number}
              className={`${styles.panel} ${styles.panelLift} ${styles.step}`}
            >
              <span className={styles.stepBadge} aria-hidden="true">
                {number}
              </span>
              <span
                className={`${styles.iconTile} ${styles.stepIcon}`}
                data-tone="primary"
                aria-hidden="true"
              >
                <Icon size={21} strokeWidth={1.8} />
              </span>
              <h3 className={styles.stepTitle}>
                <span className="sr-only">Step {number}: </span>
                {title}
              </h3>
              <p className={styles.stepText}>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
