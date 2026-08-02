"use client";

import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PUBLIC_PREFIXES = ["/about", "/catalog", "/contacts"];

function isPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}

function directionForElement(element: HTMLElement, index: number) {
  if (element.matches(".siteHeroMedia")) return "scale";
  if (element.matches(".siteHeroContent")) return "left";

  if (element.matches(".siteCatalogCategoryCard > img")) {
    const card = element.parentElement;
    const cards = card?.parentElement
      ? Array.from(card.parentElement.children)
      : [];
    const cardIndex = card ? cards.indexOf(card) : index;
    return cardIndex % 2 === 0 ? "left" : "right";
  }

  if (element.matches(".siteCatalogCategoryCard > div")) {
    const card = element.parentElement;
    const cards = card?.parentElement
      ? Array.from(card.parentElement.children)
      : [];
    const cardIndex = card ? cards.indexOf(card) : index;
    return cardIndex % 2 === 0 ? "right" : "left";
  }

  if (element.matches(".siteSplitMedia")) {
    return element.closest(".reverse") ? "right" : "left";
  }

  if (element.matches(".siteSplitContent")) {
    return element.closest(".reverse") ? "left" : "right";
  }

  if (
    element.matches(
      ".siteProductCard, .siteCategoryCard, .siteAdvantages article, .siteQualityCard, .siteNumberAdvantages article",
    )
  ) {
    return "soft";
  }

  return "up";
}

const REVEAL_SELECTOR = [
  ".siteHeroMedia",
  ".siteHeroContent",
  ".sitePageHero",
  ".siteSectionHeading",
  ".siteQualityHeading",
  ".siteVideoPlaceholder",
  ".siteCategoryCard",
  ".siteAdvantages article",
  ".siteQualityCard",
  ".siteNumberAdvantages article",
  ".siteTimeline article",
  ".siteSplitMedia",
  ".siteSplitContent",
  ".siteCatalogCategoryCard > img",
  ".siteCatalogCategoryCard > div",
  ".siteProductCard",
  ".siteContactForm",
  ".siteContactDetails",
  ".siteContactMapSection",
  ".siteCta > *",
  ".siteFooter > *",
].join(",");

export function SiteMotion() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const routeKey = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams],
  );

  const [veilVisible, setVeilVisible] = useState(true);
  const navigationTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!isPublicPath(pathname)) {
      setVeilVisible(false);
      return;
    }

    setVeilVisible(true);
    const timer = window.setTimeout(() => setVeilVisible(false), 90);
    return () => window.clearTimeout(timer);
  }, [routeKey, pathname]);

  useEffect(() => {
    if (!isPublicPath(pathname)) return;

    const root = document.querySelector<HTMLElement>("main.sitePage");
    if (!root) return;

    const observed = new WeakSet<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.classList.add("isNevfimVisible");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    const prepareElements = () => {
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
      );

      elements.forEach((element, index) => {
        if (observed.has(element)) return;

        observed.add(element);
        element.dataset.nevfimMotion = directionForElement(element, index);
        element.style.setProperty(
          "--nevfim-delay",
          `${Math.min(index % 4, 3) * 70}ms`,
        );

        const isHero =
          element.matches(".siteHeroMedia") ||
          element.matches(".siteHeroContent") ||
          element.matches(".sitePageHero");

        if (isHero) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              element.classList.add("isNevfimVisible");
            });
          });
          return;
        }

        observer.observe(element);
      });
    };

    prepareElements();

    const delayedScan = window.setTimeout(prepareElements, 180);
    const finalScan = window.setTimeout(prepareElements, 650);

    const mutationObserver = new MutationObserver(() => {
      prepareElements();
    });

    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(delayedScan);
      window.clearTimeout(finalScan);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [routeKey, pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !anchor.closest("main.sitePage")) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.dataset.noTransition === "true"
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!isPublicPath(url.pathname)) return;

      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const next = `${url.pathname}${url.search}${url.hash}`;
      if (current === next) return;

      event.preventDefault();
      setVeilVisible(true);

      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
      }

      navigationTimer.current = window.setTimeout(() => {
        router.push(next);
      }, 220);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, [router]);

  if (!isPublicPath(pathname)) return null;

  return (
    <div
      className={`nevfimPageVeil ${veilVisible ? "isVisible" : ""}`}
      aria-hidden="true"
    />
  );
}
