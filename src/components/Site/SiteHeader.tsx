"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";

import { AccountButton } from "@/components/Account/AccountButton";
import { furnitureCategories, furnitureModels } from "@/data/furniture";
import {
  categoryName,
  modelName,
  type Language,
} from "@/i18n/translations";
import { getSiteCopy } from "@/i18n/siteTranslations";
import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useNevFimLanguage();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");

  const copy = getSiteCopy(language).header;

  const items = useMemo(
    () => [
      ...furnitureCategories.map((category) => ({
        title: categoryName(language, category.id, category.name),
        href: `/catalog?category=${category.id}`,
      })),
      ...furnitureModels.map((model) => ({
        title: `${model.productCode} — ${modelName(
          language,
          model.categoryId,
          model.name,
        )}`,
        href: `/catalog?category=${model.categoryId}&model=${model.id}`,
      })),
    ],
    [language],
  );

  const normalizedQuery = query.trim().toLocaleLowerCase(
    language === "cs" ? "cs-CZ" : language === "en" ? "en-US" : "ru-RU",
  );

  const suggestions = normalizedQuery
    ? items
        .filter((item) =>
          item.title
            .toLocaleLowerCase(
              language === "cs" ? "cs-CZ" : language === "en" ? "en-US" : "ru-RU",
            )
            .includes(normalizedQuery),
        )
        .slice(0, 6)
    : [];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(
      suggestions[0]?.href ??
        `/catalog?search=${encodeURIComponent(query.trim())}`,
    );
  };

  const links = [
    ["/", copy.home],
    ["/about", copy.about],
    ["/catalog", copy.catalog],
    ["/contacts", copy.contacts],
  ] as const;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="siteHeader">
      <div className="siteHeaderInner">
        <Link href="/" className="siteBrand">
          <img src="/images/logo/logo.png" alt="NevFim" />
          <span>
            NevFim<b>.grup</b>
          </span>
        </Link>

        <nav className={`siteNav ${menu ? "isOpen" : ""}`}>
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? "active" : ""}
              onClick={() => setMenu(false)}
            >
              {label}
            </Link>
          ))}

          <Link
            href="/configurator"
            className="siteNavConstructor"
            onClick={() => setMenu(false)}
          >
            {copy.constructor}
          </Link>
        </nav>

        <form className="siteSearch" onSubmit={submit}>
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            aria-label={copy.search}
          />

          {suggestions.length > 0 && (
            <div className="siteSearchResults">
              {suggestions.map((item) => (
                <button
                  type="button"
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setQuery("");
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </form>

        <div className="siteHeaderActions">
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as Language)
            }
            aria-label="Language"
          >
            <option value="ru">RU</option>
            <option value="cs">CZ</option>
            <option value="en">EN</option>
          </select>

          <Link
            href="/account#cart"
            className="siteCartButton"
            aria-label={language === "cs" ? "Košík" : language === "en" ? "Cart" : "Корзина"}
          >
            <ShoppingCart size={18} />
          </Link>

          <AccountButton language={language} />

          <button
            type="button"
            className="siteMenuButton"
            onClick={() => setMenu((current) => !current)}
            aria-label="Menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
