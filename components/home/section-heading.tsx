import type { ReactNode } from "react"

import styles from "@/components/home/sections.module.css"

/**
 * The one section heading used by every marketing section below the hero:
 * eyebrow pill, title, optional lead. Same pill as the hero's "Built for
 * public works contractors" and the Problem section's "Why good bids lose",
 * so the page has a single voice for "here is what this part is about".
 *
 * `title` accepts nodes so a section can lift a phrase in orange with
 * <em> — the stylesheet renders <em> inside .title upright and primary-
 * coloured, which keeps the emphasis semantic rather than a styling span.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "primary",
  titleId,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: "center" | "left"
  tone?: "primary" | "glow"
  titleId?: string
}) {
  return (
    <div className={align === "center" ? styles.headingCenter : styles.heading}>
      <p className={styles.eyebrow} data-tone={tone}>
        <span />
        {eyebrow}
      </p>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  )
}
