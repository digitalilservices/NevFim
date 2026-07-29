"use client";

import Link from "next/link";
import {
  ArrowRight,
  Box,
  Globe2,
  Leaf,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { SiteFooter } from "@/components/Site/SiteFooter";
import { SiteHeader } from "@/components/Site/SiteHeader";
import { getSiteCopy } from "@/i18n/siteTranslations";
import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";

const advantageIcons: LucideIcon[] = [
  ShieldCheck,
  Leaf,
  Globe2,
  Box,
];

export default function Home() {
  const { language } = useNevFimLanguage();
  const copy = getSiteCopy(language).home;

  return (
    <main className="sitePage">
      <SiteHeader />

      <section className="siteHero">
        <div className="siteHeroMedia" />
        <div className="siteHeroOverlay" />

        <div className="siteHeroContent">
          <span className="siteEyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>

          <div className="siteHeroActions">
            <Link href="/catalog" className="siteButton siteButtonGold">
              {copy.openCatalog}
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/configurator"
              className="siteButton siteButtonGhost"
            >
              {copy.openConstructor}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="siteQualitySection">
        <div className="siteQualityHeading">
          <span>{copy.qualityEyebrow}</span>
          <h2>{copy.qualityTitle}</h2>
        </div>

        <div className="siteQualityGrid">
          {copy.qualityItems.map((item) => (
            <article className="siteQualityCard" key={item.number}>
              <div className="siteQualityNumber" aria-hidden="true">
                <span>{item.number[0]}</span>
                <b>{item.number[1]}</b>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="siteDarkSection">
        <div className="siteSectionHeading light">
          <span>{copy.whyEyebrow}</span>
          <h2>{copy.whyTitle}</h2>
        </div>

        <div className="siteAdvantages">
          {copy.whyItems.map((item, index) => {
            const Icon = advantageIcons[index] ?? ShieldCheck;
            return (
              <article key={item.title}>
                <Icon />
                <b>{item.title}</b>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="siteSplitSection">
        <div className="siteSplitMedia siteSplitMediaFactory" />

        <div className="siteSplitContent">
          <span className="siteEyebrow">{copy.aboutEyebrow}</span>
          <h2>{copy.aboutTitle}</h2>
          <p>{copy.aboutDescription}</p>

          <Link href="/about" className="siteTextLink">
            {copy.aboutLink}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="siteCta">
        <div>
          <span className="siteEyebrow">{copy.ctaEyebrow}</span>
          <h2>{copy.ctaTitle}</h2>
        </div>

        <Link
          href="/configurator"
          className="siteButton siteButtonGold"
        >
          {copy.ctaButton}
          <ArrowRight size={18} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
