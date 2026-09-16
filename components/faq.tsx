import { Plus } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"
import styles from "@/components/home/sections.module.css"

// Native <details>/<summary> rather than a JS accordion: this stays a server
// component with zero client bundle, and the answers are still in the DOM for
// search engines and for anyone who hits Ctrl-F looking for "HeavyBid".
//
// The first entry is the old <WhyDifferent /> section ("Not another takeoff
// tool"). It was a full-width section above the fold; it is a good answer to a
// question nobody had asked yet, which is exactly what an FAQ is for.
const faqs = [
  {
    question: "Isn't this just another AI takeoff tool?",
    answer:
      "No. Most AI estimating tools race to measure quantities off drawings. Constimator does something different: it makes sure the estimate you already built matches the official bid form the owner will judge it against. It checks your numbers, it doesn't replace them.",
  },
  {
    question: "Do I have to stop using HeavyBid, HCSS, or Excel?",
    answer:
      "No. Keep estimating exactly the way you do now. Constimator reads the bid documents alongside you and reconciles what you built against the official bid form. No rip-and-replace, and no learning curve during bid season.",
  },
  {
    question: "What documents does it need?",
    answer:
      "The official bid form is the one that matters — that's what Constimator reconciles against, and you enter its line items directly. You can upload the plans, specs, and addenda too, so the whole set lives with the project and Constimator can pull the bid requirements out of them.",
  },
  {
    question: "Does it do the takeoff for me?",
    answer:
      "Not yet, and don't plan a bid around it. Constimator's document reading will pull a project summary and the bid requirements out of a plan set, but it's the newest part of the product and still being validated against real drawings. The part you can bet a bid on today is reconciliation: your estimate, checked line by line against the official bid form.",
  },
  {
    question: "Does it work with any plan set?",
    answer:
      "Yes. Constimator reads standard public works plan sets, specifications, and bid forms as published — state DOT, county, municipal, and federal-aid. You upload what the agency posted; there's no special format to prepare.",
  },
  {
    question: "What exactly does it flag?",
    answer:
      "Bid items on the official form that are missing from your estimate, quantities that disagree between the plans and the bid form, units that don't match between the two, and items the AI read with low confidence and wants a human to look at.",
  },
  {
    question: "Do my numbers stay mine?",
    answer:
      "Yes. Your estimates, documents, and pricing live in your own organization's data and are not shared with other contractors or used to train anything. Every number in a report is marked with its source — official, AI-extracted, or your own entry.",
  },
  {
    question: "How far along is Constimator?",
    answer:
      "It's early. Accounts, document processing, estimating, reconciliation, and exports are all real and working on your own data — but this is an early-stage product built by a former public works contractor and still being validated with its first contractors. That's what the founding member program is for.",
  },
]

export function Faq() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.atmosphere} data-tone="quiet" aria-hidden="true" />
      <div className={styles.innerNarrow}>
        <SectionHeading
          eyebrow="FAQ"
          titleId="faq-title"
          title={
            <>
              Questions <em>contractors</em> ask
            </>
          }
        />

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question} className={`${styles.panel} ${styles.faqItem}`}>
              <summary>
                {faq.question}
                <span aria-hidden="true">
                  <Plus size={15} strokeWidth={2.2} />
                </span>
              </summary>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
