"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/Site/SiteFooter";
import { SiteHeader } from "@/components/Site/SiteHeader";
import {
  furnitureCategories,
  furnitureModels,
} from "@/data/furniture";
import {
  categoryDescription,
  categoryName,
  modelDescription,
  modelName,
} from "@/i18n/translations";
import {
  formatModelCount,
  getSiteCopy,
} from "@/i18n/siteTranslations";
import { useNevFimLanguage } from "@/i18n/useNevFimLanguage";

export default function Catalog() {
  const searchParams = useSearchParams();
  const { language } = useNevFimLanguage();
  const copy = getSiteCopy(language).catalog;

  const categoryId = searchParams.get("category");
  const category = furnitureCategories.find(
    (item) => item.id === categoryId,
  );
  const models = category
    ? furnitureModels.filter(
        (model) => model.categoryId === category.id,
      )
    : [];

  const locale =
    language === "cs"
      ? "cs-CZ"
      : language === "en"
        ? "en-US"
        : "ru-RU";

  return (
    <main className="sitePage">
      <SiteHeader />

      <section className="sitePageHero compact">
        <span>{copy.eyebrow}</span>
        <h1>
          {category
            ? categoryName(language, category.id, category.name)
            : copy.title}
        </h1>
        <p>
          {category
            ? categoryDescription(
                language,
                category.id,
                category.description,
              )
            : copy.description}
        </p>
      </section>

      {!category ? (
        <section className="siteSection">
          <div className="siteCatalogCategoryGrid">
            {furnitureCategories.map((item, index) => {
              const preview = furnitureModels.find(
                (model) => model.categoryId === item.id,
              );
              const translatedName = categoryName(
                language,
                item.id,
                item.name,
              );

              return (
                <Link
                  key={item.id}
                  href={`/catalog?category=${item.id}`}
                  className="siteCatalogCategoryCard"
                >
                  <img
                    src={
                      preview?.image ??
                      "/images/backgrounds/showroom.jpg"
                    }
                    alt={translatedName}
                  />

                  <div>
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2>{translatedName}</h2>
                    <p>
                      {categoryDescription(
                        language,
                        item.id,
                        item.description,
                      )}
                    </p>
                    <b>
                      {copy.openCategory}
                      <ArrowRight size={17} />
                    </b>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="siteSection">
          <div className="siteCatalogToolbar">
            <Link href="/catalog">
              ← {copy.allCategories}
            </Link>
            <span>{formatModelCount(language, models.length)}</span>
          </div>

          <div className="siteProductGrid">
            {models.map((model) => {
              const translatedName = modelName(
                language,
                model.categoryId,
                model.name,
              );

              return (
                <article
                  key={model.id}
                  className="siteProductCard"
                >
                  <Link
                    href={`/catalog?category=${model.categoryId}&model=${model.id}`}
                    className="siteProductImage"
                  >
                    <img src={model.image} alt={translatedName} />
                  </Link>

                  <div>
                    <small>{model.productCode}</small>
                    <h3>{translatedName}</h3>
                    <p>
                      {modelDescription(
                        language,
                        model.categoryId,
                        model.description,
                      )}
                    </p>
                    <strong>
                      {model.basePrice.toLocaleString(locale)} Kč
                    </strong>

                    <div className="siteProductActions">
                      <Link
                        href={`/catalog?category=${model.categoryId}&model=${model.id}`}
                      >
                        {copy.details}
                      </Link>
                      <Link
                        className="gold"
                        href={`/configurator?category=${model.categoryId}&model=${model.id}`}
                      >
                        {copy.constructor}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
