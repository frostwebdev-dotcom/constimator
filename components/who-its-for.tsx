import { Building2, Landmark, TrafficCone } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import styles from "@/components/home/sections.module.css"

const projectTypes = [
  {
    icon: TrafficCone,
    tone: "primary",
    title: "State DOT projects",
    description:
      "Caltrans and equivalent state work — standard spec sections, addenda, and the official bid form they publish with them.",
  },
  {
    icon: Building2,
    tone: "glow",
    title: "County and municipal work",
    description:
      "County road jobs, city street and utility work, and the smaller bid forms that still disqualify you for a missing line.",
  },
  {
    icon: Landmark,
    tone: "review",
    title: "Federal-aid infrastructure",
    description:
      "Federally funded projects with the extra requirements — prevailing wage, DBE goals, and the paperwork that rides along.",
  },
] as const

// Only the tools the copy already names. The dashed last chip is the copy's
// own "or whatever you already estimate in", not a fourth integration.
const tools = ["HeavyBid", "HCSS", "Excel"] as const

export function WhoItsFor() {
  return (
    <section
      id="who-its-for"
      className={styles.section}
      aria-labelledby="who-its-for-title"
    >
      <div className={styles.atmosphere} data-tone="quiet" aria-hidden="true" />
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Who it's for"
          titleId="who-its-for-title"
          title={
            <>
              Built for <em>public works</em> contractors
            </>
          }
          lead="Constimator is designed specifically for contractors bidding on:"
        />

        <div className={styles.audienceGrid}>
          {projectTypes.map(({ icon: Icon, tone, title, description }) => (
            <article
              key={title}
              className={`${styles.panel} ${styles.panelLift} ${styles.audienceCard}`}
            >
              <span className={styles.iconTile} data-tone={tone} aria-hidden="true">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3 className={styles.audienceTitle}>{title}</h3>
              <p className={styles.audienceText}>{description}</p>
            </article>
          ))}
        </div>

        <div className={styles.tools}>
          <p>
            Works alongside whatever you already estimate in. No rip-and-replace,
            no learning curve during bid season.
          </p>
          <ul className={styles.toolChips} aria-label="Works alongside">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
            <li data-muted="true">…or your own spreadsheet</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
