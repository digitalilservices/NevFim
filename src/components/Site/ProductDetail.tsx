"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  ZoomIn,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { addToCart } from "@/lib/cart/cart";
import type {
  FurnitureCategory,
  FurnitureModel,
} from "@/types/furniture";
import {
  categoryName,
  modelDescription,
  modelName,
  type Language,
} from "@/i18n/translations";

import styles from "./ProductDetail.module.css";

type Props = {
  language: Language;
  model: FurnitureModel;
  category: FurnitureCategory;
  allModels: FurnitureModel[];
  locale: string;
};

const copy = {
  ru: {
    back: "Назад в каталог",
    allAbout: "Всё о товаре",
    description: "Описание",
    characteristics: "Характеристики",
    code: "Код",
    available: "В наличии",
    madeToOrder: "Изготавливается под заказ",
    price: "Цена",
    from: "от",
    material: "Материал",
    color: "Цвет",
    fabric: "Ткань",
    size: "Размер",
    quantity: "Количество",
    addCart: "Добавить в корзину",
    buyNow: "Купить сейчас",
    constructor: "Открыть в конструкторе",
    added: "Товар добавлен в корзину",
    goCart: "Перейти в личный кабинет",
    auth: "Для покупки необходимо войти в аккаунт.",
    error: "Не удалось добавить товар.",
    aboutTitle: "Описание",
    characteristicsTitle: "Основные характеристики",
    bestseller: "Хит продаж",
    recommended: "Вас может заинтересовать",
    details: "Подробнее",
    shortDescription: "Краткое описание",
    delivery: "Срок изготовления",
    warranty: "Гарантия",
    production: "Индивидуальное производство NevFim",
    days: "рабочих дней",
    imageZoom: "Увеличить изображение",
    close: "Закрыть",
    previous: "Предыдущее изображение",
    next: "Следующее изображение",
    width: "Ширина",
    height: "Высота",
    depth: "Глубина",
    millimeters: "мм",
    enterSize: "Введите размеры изделия",
    invalidSize: "Укажите корректные размеры от 100 до 10000 мм.",
    configurationNote:
      "Конфигурация изделия, оттенок и размеры уточняются перед запуском в производство.",
    warrantyValue: "24 мес.",
    productType: "Тип изделия",
    manufacture: "Производство",
    productionValue: "NevFim — индивидуальный заказ",
    leadTime: "Срок изготовления",
    country: "Страна производства",
    countryValue: "Словакия / Чехия",
    customDescription:
      "Модель изготавливается индивидуально с возможностью выбора материала, цвета и размеров.",
  },
  cs: {
    back: "Zpět do katalogu",
    allAbout: "Vše o produktu",
    description: "Popis",
    characteristics: "Parametry",
    code: "Kód",
    available: "Skladem",
    madeToOrder: "Výroba na objednávku",
    price: "Cena",
    from: "od",
    material: "Materiál",
    color: "Barva",
    fabric: "Látka",
    size: "Rozměr",
    quantity: "Množství",
    addCart: "Přidat do košíku",
    buyNow: "Koupit nyní",
    constructor: "Otevřít v konfigurátoru",
    added: "Produkt byl přidán do košíku",
    goCart: "Přejít do účtu",
    auth: "Pro nákup se musíte přihlásit.",
    error: "Produkt se nepodařilo přidat.",
    aboutTitle: "Popis",
    characteristicsTitle: "Hlavní parametry",
    bestseller: "Nejprodávanější",
    recommended: "Mohlo by vás zajímat",
    details: "Detail",
    shortDescription: "Stručný popis",
    delivery: "Doba výroby",
    warranty: "Záruka",
    production: "Individuální výroba NevFim",
    days: "pracovních dnů",
    imageZoom: "Zvětšit obrázek",
    close: "Zavřít",
    previous: "Předchozí obrázek",
    next: "Další obrázek",
    width: "Šířka",
    height: "Výška",
    depth: "Hloubka",
    millimeters: "mm",
    enterSize: "Zadejte rozměry výrobku",
    invalidSize: "Zadejte platné rozměry od 100 do 10000 mm.",
    configurationNote:
      "Konfigurace výrobku, odstín a rozměry budou upřesněny před zahájením výroby.",
    warrantyValue: "24 měsíců",
    productType: "Typ výrobku",
    manufacture: "Výroba",
    productionValue: "NevFim — individuální zakázka",
    leadTime: "Doba výroby",
    country: "Země výroby",
    countryValue: "Slovensko / Česko",
    customDescription:
      "Model se vyrábí individuálně s možností volby materiálu, barvy a rozměrů.",
  },
  en: {
    back: "Back to catalog",
    allAbout: "Product overview",
    description: "Description",
    characteristics: "Specifications",
    code: "Code",
    available: "In stock",
    madeToOrder: "Made to order",
    price: "Price",
    from: "from",
    material: "Material",
    color: "Color",
    fabric: "Fabric",
    size: "Size",
    quantity: "Quantity",
    addCart: "Add to cart",
    buyNow: "Buy now",
    constructor: "Open in constructor",
    added: "Product added to cart",
    goCart: "Go to account",
    auth: "Please sign in to purchase.",
    error: "Could not add the product.",
    aboutTitle: "Description",
    characteristicsTitle: "Main specifications",
    bestseller: "Best seller",
    recommended: "You may also like",
    details: "Details",
    shortDescription: "Short description",
    delivery: "Production time",
    warranty: "Warranty",
    production: "Custom NevFim production",
    days: "business days",
    imageZoom: "Zoom image",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    width: "Width",
    height: "Height",
    depth: "Depth",
    millimeters: "mm",
    enterSize: "Enter product dimensions",
    invalidSize: "Enter valid dimensions from 100 to 10000 mm.",
    configurationNote:
      "The configuration, finish and dimensions are confirmed before production begins.",
    warrantyValue: "24 months",
    productType: "Product type",
    manufacture: "Production",
    productionValue: "NevFim — custom order",
    leadTime: "Production time",
    country: "Country of production",
    countryValue: "Slovakia / Czechia",
    customDescription:
      "The model is made to order with a choice of material, color and dimensions.",
  },
} as const;

const softCategories = new Set(["beds", "sofas", "armchairs", "chairs"]);

const defaultMaterials = ["ЛДСП", "МДФ", "Шпон"];
const defaultColors = [
  "Светлый дуб",
  "Натуральный дуб",
  "Орех",
  "Графит",
  "Бежевый",
];
const defaultFabrics = ["Велюр", "Букле", "Рогожка"];

const optionTranslations: Record<
  Language,
  Record<string, string>
> = {
  ru: {
    ЛДСП: "ЛДСП",
    МДФ: "МДФ",
    Шпон: "Шпон",
    Фанера: "Фанера",
    "Массив дерева": "Массив дерева",
    "Светлый дуб": "Светлый дуб",
    "Натуральный дуб": "Натуральный дуб",
    Орех: "Орех",
    Графит: "Графит",
    Бежевый: "Бежевый",
    Велюр: "Велюр",
    Букле: "Букле",
    Рогожка: "Рогожка",
  },
  cs: {
    ЛДСП: "Laminovaná DTD",
    МДФ: "MDF",
    Шпон: "Dýha",
    Фанера: "Překližka",
    "Массив дерева": "Masivní dřevo",
    "Светлый дуб": "Světlý dub",
    "Натуральный дуб": "Přírodní dub",
    Орех: "Ořech",
    Графит: "Grafit",
    Бежевый: "Béžová",
    Велюр: "Velur",
    Букле: "Buklé",
    Рогожка: "Rohož",
  },
  en: {
    ЛДСП: "Laminated chipboard",
    МДФ: "MDF",
    Шпон: "Veneer",
    Фанера: "Plywood",
    "Массив дерева": "Solid wood",
    "Светлый дуб": "Light oak",
    "Натуральный дуб": "Natural oak",
    Орех: "Walnut",
    Графит: "Graphite",
    Бежевый: "Beige",
    Велюр: "Velour",
    Букле: "Bouclé",
    Рогожка: "Matting",
  },
};

function optionLabel(language: Language, value: string) {
  return optionTranslations[language]?.[value] ?? value;
}

function getDefaults(
  model: FurnitureModel,
  category: FurnitureCategory,
  language: Language,
  translatedCategory: string,
  translatedDescription: string,
) {
  const isSoft = softCategories.has(model.categoryId);
  const c = copy[language];

  return {
    images:
      model.images?.length
        ? Array.from(new Set([model.image, ...model.images]))
        : [model.image],
    materials:
      model.materials?.length
        ? model.materials
        : isSoft
          ? ["МДФ", "Фанера", "Массив дерева"]
          : defaultMaterials,
    colors: model.colors?.length ? model.colors : defaultColors,
    fabrics:
      isSoft
        ? model.fabrics?.length
          ? model.fabrics
          : defaultFabrics
        : [],
    dimensions: {
      widthMm: model.dimensions?.widthMm ?? (isSoft ? 1800 : 1600),
      heightMm: model.dimensions?.heightMm ?? (isSoft ? 1100 : 2200),
      depthMm: model.dimensions?.depthMm ?? (isSoft ? 2100 : 600),
    },
    description:
      model.fullDescription?.trim() ||
      `${translatedDescription}. ${c.customDescription}`,
    characteristics:
      model.characteristics?.length
        ? model.characteristics
        : [
            { label: c.productType, value: translatedCategory },
            { label: c.manufacture, value: c.productionValue },
            { label: c.leadTime, value: category.defaultDays },
            { label: c.country, value: c.countryValue },
          ],
  };
}

export function ProductDetail({
  language,
  model,
  category,
  allModels,
  locale,
}: Props) {
  const router = useRouter();
  const c = copy[language];

  const translatedName = modelName(
    language,
    model.categoryId,
    model.name,
  );
  const translatedDescription = modelDescription(
    language,
    model.categoryId,
    model.description,
  );
  const translatedCategory = categoryName(
    language,
    category.id,
    category.name,
  );

  const defaults = useMemo(
    () =>
      getDefaults(
        model,
        category,
        language,
        translatedCategory,
        translatedDescription,
      ),
    [
      model,
      category,
      language,
      translatedCategory,
      translatedDescription,
    ],
  );

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "description" | "characteristics"
  >("overview");
  const [selectedMaterial, setSelectedMaterial] = useState(
    defaults.materials[0] ?? "",
  );
  const [selectedColor, setSelectedColor] = useState(
    defaults.colors[0] ?? "",
  );
  const [selectedFabric, setSelectedFabric] = useState(
    defaults.fabrics[0] ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [widthMm, setWidthMm] = useState(
    defaults.dimensions.widthMm,
  );
  const [heightMm, setHeightMm] = useState(
    defaults.dimensions.heightMm,
  );
  const [depthMm, setDepthMm] = useState(
    defaults.dimensions.depthMm,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const recommendationsRef = useRef<HTMLDivElement | null>(null);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLElement | null>(null);
  const characteristicsRef = useRef<HTMLElement | null>(null);

  const recommendations = useMemo(() => {
    const explicitlyRecommended = model.recommendedIds?.length
      ? model.recommendedIds
          .map((id) => allModels.find((item) => item.id === id))
          .filter((item): item is FurnitureModel => Boolean(item))
      : [];

    if (explicitlyRecommended.length >= 4) {
      return explicitlyRecommended.slice(0, 8);
    }

    const sameCategory = allModels.filter(
      (item) =>
        item.id !== model.id &&
        item.categoryId === model.categoryId,
    );
    const bestSellers = allModels.filter(
      (item) =>
        item.id !== model.id &&
        item.isBestSeller &&
        !sameCategory.some((same) => same.id === item.id),
    );

    return [
      ...explicitlyRecommended,
      ...sameCategory,
      ...bestSellers,
    ]
      .filter(
        (item, index, array) =>
          array.findIndex((candidate) => candidate.id === item.id) ===
          index,
      )
      .slice(0, 8);
  }, [allModels, model]);

  useEffect(() => {
    setActiveImage(0);
    setSelectedMaterial(defaults.materials[0] ?? "");
    setSelectedColor(defaults.colors[0] ?? "");
    setSelectedFabric(defaults.fabrics[0] ?? "");
    setWidthMm(defaults.dimensions.widthMm);
    setHeightMm(defaults.dimensions.heightMm);
    setDepthMm(defaults.dimensions.depthMm);
    setQuantity(1);
    setMessage("");
    setActiveTab("overview");
  }, [model.id, language, defaults]);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-product-reveal]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.visible);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -7% 0px",
      },
    );

    elements.forEach((element, index) => {
      element.style.setProperty(
        "--product-delay",
        `${Math.min(index % 4, 3) * 75}ms`,
      );
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [model.id]);

  const openSection = (
    section: "overview" | "description" | "characteristics",
  ) => {
    setActiveTab(section);

    const target =
      section === "overview"
        ? overviewRef.current
        : section === "description"
          ? descriptionRef.current
          : characteristicsRef.current;

    if (!target) return;

    target.classList.add(styles.visible);

    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const normalizeDimension = (value: number) =>
    Number.isFinite(value) ? Math.round(value) : 0;

  const dimensionsAreValid =
    widthMm >= 100 &&
    widthMm <= 10000 &&
    heightMm >= 100 &&
    heightMm <= 10000 &&
    depthMm >= 100 &&
    depthMm <= 10000;

  const money = (value: number) =>
    `${value.toLocaleString(locale)} Kč`;

  const changeImage = (direction: number) => {
    setActiveImage((current) => {
      const total = defaults.images.length;
      return (current + direction + total) % total;
    });
  };

  const addProduct = async (buyNow: boolean) => {
    try {
      setIsAdding(true);
      setMessage("");
      setMessageType("");

      if (!dimensionsAreValid) {
        setMessage(c.invalidSize);
        setMessageType("error");
        return;
      }

      const result = await addToCart({
        source: "catalog",
        categoryId: category.id,
        categoryName: translatedCategory,
        modelId: model.id,
        productCode: model.productCode,
        modelName: translatedName,
        imageUrl: defaults.images[activeImage] ?? model.image,
        widthMm,
        heightMm,
        depthMm,
        material: optionLabel(language, selectedMaterial),
        color: optionLabel(language, selectedColor),
        fabric: selectedFabric
          ? optionLabel(language, selectedFabric)
          : undefined,
        customerPrompt: `${c.production}. ${translatedDescription}`,
        price: model.basePrice,
        quantity,
      });

      if (!result.success) {
        if (result.requiresAuth) {
          const next = encodeURIComponent(
            `${window.location.pathname}${window.location.search}`,
          );
          router.push(`/login?next=${next}`);
          return;
        }

        throw new Error(result.error || c.error);
      }

      setMessage(c.added);
      setMessageType("success");

      if (buyNow) {
        router.push("/account?checkout=1");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : c.error);
      setMessageType("error");
    } finally {
      setIsAdding(false);
    }
  };

  const scrollRecommendations = (direction: number) => {
    const container = recommendationsRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * Math.min(container.clientWidth * 0.78, 920),
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs} data-product-reveal>
        <Link href={`/catalog?category=${category.id}`}>
          <ArrowLeft size={17} />
          {c.back}
        </Link>
        <span>/</span>
        <span>{translatedCategory}</span>
        <span>/</span>
        <strong>{translatedName}</strong>
      </div>

      <section className={styles.productShell}>
        <div className={styles.tabs} data-product-reveal>
          <button
            type="button"
            className={
              activeTab === "overview" ? styles.activeTab : ""
            }
            onClick={() => openSection("overview")}
          >
            {c.allAbout}
          </button>
          <button
            type="button"
            className={
              activeTab === "description" ? styles.activeTab : ""
            }
            onClick={() => openSection("description")}
          >
            {c.description}
          </button>
          <button
            type="button"
            className={
              activeTab === "characteristics"
                ? styles.activeTab
                : ""
            }
            onClick={() => openSection("characteristics")}
          >
            {c.characteristics}
          </button>
        </div>

        <div
          className={styles.productGrid}
          id="overview"
          ref={overviewRef}
        >
          <section className={styles.gallery} data-product-reveal>
            <div className={styles.thumbnails}>
              {defaults.images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={
                    activeImage === index ? styles.activeThumbnail : ""
                  }
                  onClick={() => setActiveImage(index)}
                  aria-label={`${translatedName} ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>

            <div className={styles.mainImage}>
              <img
                src={defaults.images[activeImage]}
                alt={translatedName}
              />

              {defaults.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                    onClick={() => changeImage(-1)}
                    aria-label={c.previous}
                  >
                    <ChevronLeft size={21} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                    onClick={() => changeImage(1)}
                    aria-label={c.next}
                  >
                    <ChevronRight size={21} />
                  </button>
                </>
              )}

              <button
                type="button"
                className={styles.zoomButton}
                onClick={() => setIsZoomOpen(true)}
                aria-label={c.imageZoom}
              >
                <ZoomIn size={19} />
              </button>
            </div>
          </section>

          <section className={styles.info} data-product-reveal>
            <div className={styles.infoHeading}>
              <div>
                <small>{c.code}: {model.productCode}</small>
                <h1>{translatedName}</h1>
                <p>{translatedDescription}</p>
              </div>

              <button type="button" className={styles.favoriteButton}>
                <Heart size={20} />
              </button>
            </div>

            <div className={styles.availability}>
              <CheckCircle2 size={18} />
              <span>
                {model.inStock === false
                  ? c.madeToOrder
                  : c.available}
              </span>
            </div>

            <div className={styles.priceRow}>
              <span>{c.price}</span>
              <strong>{money(model.basePrice)}</strong>
            </div>

            <div className={styles.optionBlock}>
              <div className={styles.optionHeading}>
                <strong>{c.material}</strong>
                <span>{optionLabel(language, selectedMaterial)}</span>
              </div>
              <div className={styles.optionButtons}>
                {defaults.materials.map((material) => (
                  <button
                    type="button"
                    key={material}
                    className={
                      selectedMaterial === material
                        ? styles.selectedOption
                        : ""
                    }
                    onClick={() => setSelectedMaterial(material)}
                  >
                    {selectedMaterial === material && <Check size={15} />}
                    {optionLabel(language, material)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.optionBlock}>
              <div className={styles.optionHeading}>
                <strong>{c.color}</strong>
                <span>{optionLabel(language, selectedColor)}</span>
              </div>
              <div className={styles.colorButtons}>
                {defaults.colors.map((color, index) => (
                  <button
                    type="button"
                    key={color}
                    className={
                      selectedColor === color
                        ? styles.selectedColor
                        : ""
                    }
                    onClick={() => setSelectedColor(color)}
                    title={optionLabel(language, color)}
                    aria-label={optionLabel(language, color)}
                    style={{
                      "--swatch-color": [
                        "#d8c6a8",
                        "#b98d5f",
                        "#765039",
                        "#4d5052",
                        "#d4c5ae",
                      ][index % 5],
                    } as React.CSSProperties}
                  >
                    {selectedColor === color && <Check size={15} />}
                  </button>
                ))}
              </div>
            </div>

            {defaults.fabrics.length > 0 && (
              <div className={styles.optionBlock}>
                <div className={styles.optionHeading}>
                  <strong>{c.fabric}</strong>
                  <span>{optionLabel(language, selectedFabric)}</span>
                </div>
                <div className={styles.optionButtons}>
                  {defaults.fabrics.map((fabric) => (
                    <button
                      type="button"
                      key={fabric}
                      className={
                        selectedFabric === fabric
                          ? styles.selectedOption
                          : ""
                      }
                      onClick={() => setSelectedFabric(fabric)}
                    >
                      {selectedFabric === fabric && <Check size={15} />}
                      {optionLabel(language, fabric)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.sizeRow}>
              <div className={styles.dimensionEditor}>
                <small>{c.enterSize}</small>
                <div className={styles.dimensionFields}>
                  <label>
                    <span>{c.width}</span>
                    <div>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={100}
                        max={10000}
                        step={10}
                        value={widthMm}
                        onChange={(event) =>
                          setWidthMm(
                            normalizeDimension(
                              event.currentTarget.valueAsNumber,
                            ),
                          )
                        }
                      />
                      <b>{c.millimeters}</b>
                    </div>
                  </label>

                  <label>
                    <span>{c.height}</span>
                    <div>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={100}
                        max={10000}
                        step={10}
                        value={heightMm}
                        onChange={(event) =>
                          setHeightMm(
                            normalizeDimension(
                              event.currentTarget.valueAsNumber,
                            ),
                          )
                        }
                      />
                      <b>{c.millimeters}</b>
                    </div>
                  </label>

                  <label>
                    <span>{c.depth}</span>
                    <div>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={100}
                        max={10000}
                        step={10}
                        value={depthMm}
                        onChange={(event) =>
                          setDepthMm(
                            normalizeDimension(
                              event.currentTarget.valueAsNumber,
                            ),
                          )
                        }
                      />
                      <b>{c.millimeters}</b>
                    </div>
                  </label>
                </div>

                {!dimensionsAreValid && (
                  <p className={styles.dimensionError}>
                    {c.invalidSize}
                  </p>
                )}
              </div>

              <div className={styles.quantity}>
                <small>{c.quantity}</small>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                  >
                    <Minus size={15} />
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.min(20, current + 1))
                    }
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`${styles.message} ${
                  messageType === "success"
                    ? styles.successMessage
                    : styles.errorMessage
                }`}
              >
                {messageType === "success" && <CheckCircle2 size={18} />}
                <span>{message}</span>
                {messageType === "success" && (
                  <Link href="/account">{c.goCart}</Link>
                )}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.buyButton}
                disabled={isAdding || !dimensionsAreValid}
                onClick={() => addProduct(true)}
              >
                <ShoppingBag size={19} />
                {c.buyNow}
              </button>

              <button
                type="button"
                className={styles.cartButton}
                disabled={isAdding || !dimensionsAreValid}
                onClick={() => addProduct(false)}
              >
                <ShoppingCart size={19} />
                {c.addCart}
              </button>

              <Link
                className={styles.constructorButton}
                href={`/configurator?category=${model.categoryId}&model=${model.id}`}
              >
                <Sparkles size={18} />
                {c.constructor}
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section
        id="description"
        ref={descriptionRef}
        className={styles.contentSection}
        data-product-reveal
      >
        <div className={styles.sectionHeading}>
          <small>NEVFIM PRODUCT</small>
          <h2>{c.aboutTitle} {translatedName}</h2>
        </div>

        <div className={styles.descriptionGrid}>
          <article>
            <p>{defaults.description}</p>
            <p>
              {c.production}. {c.configurationNote}
            </p>
          </article>

          <aside>
            <div>
              <strong>{category.defaultDays}</strong>
              <span>{c.delivery}</span>
            </div>
            <div>
              <strong>{c.warrantyValue}</strong>
              <span>{c.warranty}</span>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="characteristics"
        ref={characteristicsRef}
        className={styles.contentSection}
        data-product-reveal
      >
        <div className={styles.sectionHeading}>
          <small>NEVFIM SPECIFICATIONS</small>
          <h2>{c.characteristicsTitle} {translatedName}</h2>
        </div>

        <div className={styles.characteristicsTable}>
          <div>
            <span>{c.size}</span>
            <strong>
              {widthMm} × {heightMm} × {depthMm} {c.millimeters}
            </strong>
          </div>

          {defaults.characteristics.map((item) => (
            <div key={`${item.label}-${item.value}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.recommendations} data-product-reveal>
        <div className={styles.recommendationsHeading}>
          <div>
            <small>
              <Sparkles size={15} />
              {c.bestseller}
            </small>
            <h2>{c.recommended}</h2>
          </div>

          <div>
            <button
              type="button"
              onClick={() => scrollRecommendations(-1)}
              aria-label={c.previous}
            >
              <ChevronLeft size={21} />
            </button>
            <button
              type="button"
              onClick={() => scrollRecommendations(1)}
              aria-label={c.next}
            >
              <ChevronRight size={21} />
            </button>
          </div>
        </div>

        <div
          className={styles.recommendationsTrack}
          ref={recommendationsRef}
        >
          {recommendations.map((item) => {
            const itemName = modelName(
              language,
              item.categoryId,
              item.name,
            );

            return (
              <article className={styles.recommendationCard} key={item.id}>
                <Link
                  className={styles.recommendationImage}
                  href={`/catalog?category=${item.categoryId}&model=${item.id}`}
                >
                  <img src={item.image} alt={itemName} />
                  {item.isBestSeller && (
                    <span>{c.bestseller}</span>
                  )}
                </Link>

                <div>
                  <small>{item.productCode}</small>
                  <h3>{itemName}</h3>
                  <strong>{money(item.basePrice)}</strong>
                  <Link
                    href={`/catalog?category=${item.categoryId}&model=${item.id}`}
                  >
                    {c.details}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {isZoomOpen && (
        <div
          className={styles.zoomOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            className={styles.zoomClose}
            onClick={() => setIsZoomOpen(false)}
            aria-label={c.close}
          >
            ×
          </button>

          <img
            src={defaults.images[activeImage]}
            alt={translatedName}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
