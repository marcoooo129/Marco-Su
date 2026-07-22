"use client";

import { site } from "@/data/site";

type ContactSectionProps = {
  onBackToTop: () => void;
};

export function ContactSection({ onBackToTop }: ContactSectionProps) {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-inner">
        <span className="contact-kicker">START A PROJECT / SAY HELLO</span>
        <h2 id="contact-title" className="text-balance">
          If you’re building with AI, language or an idea worth testing, let’s talk.
        </h2>
        <p className="text-pretty">
          I’m open to collaborations, product experiments and conversations with people making something of their own.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="email-link focus-ring"
          data-cursor="MAIL"
        >
          <span>Send an email</span>
          <i aria-hidden="true" />
          <b aria-hidden="true">↗</b>
        </a>
      </div>

      <div className="contact-socials">
        {site.socials.map((social) => {
          const external = social.href.startsWith("http");
          return (
            <a
              key={social.label}
              href={social.href}
              className="social-link focus-ring"
              data-cursor={social.label === "Email" ? "MAIL" : "VIEW"}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <span className="social-label">{social.label}</span>
              <span className="social-handle">{social.handle}</span>
              <span className="social-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          );
        })}
      </div>

      <footer className="site-footer">
        <div>
          <span>{site.name}</span>
          <span>{site.role}</span>
        </div>
        <div>
          <span>{site.location}</span>
        </div>
        <div>
          <span>© {new Date().getFullYear()}</span>
          <button type="button" className="focus-ring" onClick={onBackToTop} data-cursor="GO">
            Back to top ↑
          </button>
        </div>
      </footer>
    </section>
  );
}
