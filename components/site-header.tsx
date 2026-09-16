"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  HardHat,
  Menu,
  X,
} from "lucide-react"
import styles from "./site-header.module.css"

const navLinks = [
  { label: "Reconciliation", href: "#reconciliation" },
  { label: "How it works", href: "#how-it-works" },
  { label: "What it does", href: "#what-it-does" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const header = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sections = navLinks.map(({ href }) => ({
      href,
      element: document.getElementById(href.slice(1)),
    }))
    let frame = 0
    function updateNavigation() {
      frame = 0
      setScrolled(window.scrollY > 16)
      let active: string | null = null
      for (const section of sections) {
        if (
          section.element &&
          section.element.getBoundingClientRect().top <= 160
        )
          active = section.href
      }
      setActiveSection(active)
    }
    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(updateNavigation)
    }
    updateNavigation()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        setOpen(false)
    }
    const desktop = window.matchMedia("(min-width: 1121px)")
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    document.addEventListener("keydown", closeOnEscape)
    document.addEventListener("pointerdown", closeOutside)
    desktop.addEventListener("change", closeOnDesktop)
    return () => {
      document.removeEventListener("keydown", closeOnEscape)
      document.removeEventListener("pointerdown", closeOutside)
      desktop.removeEventListener("change", closeOnDesktop)
    }
  }, [open])

  return (
    <header
      ref={header}
      className={styles.header}
      data-scrolled={scrolled}
      data-menu-open={open}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Constimator home">
          <span className={styles.logoStage} aria-hidden="true">
            <span className={styles.logoBase} />
            <span className={styles.logoFace}>
              <HardHat size={27} strokeWidth={1.7} />
            </span>
          </span>
          <span className={styles.wordmark}>
            <span>Constimator</span>
            <span className={styles.brandCaption}>Bid with confidence</span>
          </span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary">
          <div className={styles.navRail}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={
                  activeSection === link.href ? "location" : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <div className={styles.headerActions}>
          <Link href="/sign-in" className={styles.signIn}>
            Sign in <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <Link href="/sign-up" className={styles.headerCta}>
            Get started <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className={styles.mobileNav}
          aria-label="Mobile"
        >
          <p className={styles.mobileEyebrow}>Explore Constimator</p>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              aria-current={
                activeSection === link.href ? "location" : undefined
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          ))}
          <div className={styles.mobileActions}>
            <Link href="/sign-in" className={styles.signIn}>
              Sign in <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/sign-up" className={styles.headerCta}>
              Get started <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className={styles.mobileTrial}>
            30 days free. No credit card required.
          </p>
        </nav>
      )}
    </header>
  )
}
