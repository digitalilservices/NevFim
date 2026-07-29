"use client";

import { SiteFooter } from "@/components/Site/SiteFooter";
import { SiteHeader } from "@/components/Site/SiteHeader";
import { getSiteCopy } from "@/i18n/siteTranslations";
import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";

export default function About() {
  const { language } = useNevFimLanguage();
  const copy = getSiteCopy(language).about;

  return (
    <main className="sitePage">
      <SiteHeader />

      <section className="sitePageHero">
        <span>{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </section>

      <section className="siteVideoSection">
        <div className="siteVideoPlaceholder">
          {copy.videoPlaceholder}
        </div>
      </section>

      <section className="siteSection">
        <div className="siteSectionHeading">
          <span>{copy.advantagesEyebrow}</span>
          <h2>{copy.advantagesTitle}</h2>
        </div>

        <div className="siteNumberAdvantages">
          {copy.advantages.map(([number, title, description]) => (
            <article key={number}>
              <strong>{number}</strong>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="siteSection">
        <div className="siteSectionHeading">
          <span>{copy.historyEyebrow}</span>
          <h2>{copy.historyTitle}</h2>
        </div>

        <div className="siteTimeline">
          {copy.history.map(([year, text]) => (
            <article key={year}>
              <strong>{year}</strong>
              <span />
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
