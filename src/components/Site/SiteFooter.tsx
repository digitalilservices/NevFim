"use client";

import Link from "next/link";

import { getSiteCopy } from "@/i18n/siteTranslations";
import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";

export function SiteFooter() {
  const { language } = useNevFimLanguage();
  const copy = getSiteCopy(language).footer;

  return (
    <footer className="siteFooter">
      <div>
        <Link href="/" className="siteBrand">
          <img src="/images/logo/logo.png" alt="NevFim" />
          <span>
            NevFim<b>.grup</b>
          </span>
        </Link>
        <p>{copy.description}</p>
      </div>

      <div className="siteFooterLinks">
        <Link href="/about">{copy.about}</Link>
        <Link href="/catalog">{copy.catalog}</Link>
        <Link href="/configurator">{copy.constructor}</Link>
        <Link href="/contacts">{copy.contacts}</Link>
      </div>

      <small>© 2026 NevFim.grup</small>
    </footer>
  );
}
