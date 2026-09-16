import { ArrowRight } from "lucide-react"

import styles from "@/components/home/sections.module.css"

export function Cta() {
  return (
    <section aria-labelledby="cta-title">
      <div className={styles.ctaWrap}>
        <div className={`${styles.panel} ${styles.ctaPanel}`}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            Chase the right jobs. Bid them <em className="not-italic text-primary">without the busts.</em>
          </h2>
          <p className={styles.ctaLead}>
            Let Constimator read the documents and reconcile your estimate
            against the official bid form — so your bid is complete, responsive,
            and right, before you submit it.
          </p>
          <div className={styles.ctaActions}>
            <a href="/sign-up" className={styles.buttonPrimary}>
              Analyze your first project
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href="mailto:support@constimator.com?subject=Constimator demo"
              className={styles.buttonGhost}
            >
              Book a demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
