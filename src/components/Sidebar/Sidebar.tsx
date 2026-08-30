"use client";

import { useEffect, useState } from "react";
import type {
  FurnitureCategory,
  FurnitureModel,
} from "@/types/furniture";

import {
  BedDouble,
  ChevronRight,
  DoorClosed,
  DoorOpen,
  Grid2X2,
  PanelsTopLeft,
  Sofa,
  Archive,
  Armchair,
  Menu,
  X,
} from "lucide-react";
import { categoryDescription, categoryName, modelDescription, modelName, t, type Language } from "@/i18n/translations";
import { FabricPicker } from "@/components/Sidebar/FabricPicker";

type SidebarProps = {
  language: Language;
  categories: FurnitureCategory[];
  models: FurnitureModel[];

  selectedCategory: FurnitureCategory | null;
  selectedModel: FurnitureModel | null;

  isGenerated: boolean;
  isSoftFurniture: boolean;

  width: string;
  height: string;
  depth: string;
  material: string;
  color: string;
  customColor: string;
  fabric: string;
  fabricImage: string;
  prompt: string;

  estimatedPrice: number;

  onSelectCategory: (category: FurnitureCategory) => void;
  onSelectModel: (model: FurnitureModel) => void;
  onBackToCategories: () => void;
  onBackToModels: () => void;

  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onDepthChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onCustomColorChange: (value: string) => void;
  onFabricSelect: (value: string, image: string) => void;
  onReset: () => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;
  cartMessage: string;
  cartError: boolean;
};

type FurnitureIconProps = {
  categoryId: string;
};

function FurnitureIcon({ categoryId }: FurnitureIconProps) {
  const iconProps = {
    size: 23,
    strokeWidth: 1.6,
    "aria-hidden": true,
  };

  switch (categoryId) {
    case "hinged-wardrobe":
      return <DoorOpen {...iconProps} />;

    case "sliding-wardrobe":
      return <PanelsTopLeft {...iconProps} />;

    case "wardrobe-system":
      return <Grid2X2 {...iconProps} />;

    case "beds":
      return <BedDouble {...iconProps} />;

    case "sofas":
      return <Sofa {...iconProps} />;

    case "dressers":
      return <Archive {...iconProps} />;

    case "sliding-systems":
      return <PanelsTopLeft {...iconProps} />;

    case "armchairs":
      return <Armchair {...iconProps} />;

    case "hangers":
      return <DoorClosed {...iconProps} />;

    case "tables":
      return <Grid2X2 {...iconProps} />;

    case "chairs":
      return <Armchair {...iconProps} />;

    case "table-chair-sets":
      return <Armchair {...iconProps} />;

    default:
      return <PanelsTopLeft {...iconProps} />;
  }
}

const colors = [
  { name: "Світлий дуб", hex: "#d7bc8b" },
  { name: "Натуральний дуб", hex: "#b88b55" },
  { name: "Горіх", hex: "#70472d" },
  { name: "Чорний дуб", hex: "#282624" },
  { name: "Бежевий", hex: "#d8c9b3" },
  { name: "Графіт", hex: "#55585c" },
];

export function Sidebar({
  language,
  categories,
  models,
  selectedCategory,
  selectedModel,
  isGenerated,
  isSoftFurniture,
  width,
  height,
  depth,
  material,
  color,
  customColor,
  fabric,
  fabricImage,
  prompt,
  estimatedPrice,
  onSelectCategory,
  onSelectModel,
  onBackToCategories,
  onBackToModels,
  onWidthChange,
  onHeightChange,
  onDepthChange,
  onMaterialChange,
  onColorChange,
  onCustomColorChange,
  onFabricSelect,
  onReset,
  onAddToCart,
  isAddingToCart,
  cartMessage,
  cartError,
}: SidebarProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const openCatalog = () => setIsMobileOpen(true);
    window.addEventListener("nevfim-open-2d-catalog", openCatalog);
    return () => window.removeEventListener("nevfim-open-2d-catalog", openCatalog);
  }, []);

  const categoryModels = selectedCategory
    ? models.filter((model) => model.categoryId === selectedCategory.id)
    : [];

  const displayedColor =
    color === "Індивідуальний"
      ? (customColor ?? "").trim() || t(language, "customColor")
      : color || t(language, "notSpecified");

  return (
    <>
      <button
        type="button"
        className="mobileSidebarToggle"
        onClick={() => setIsMobileOpen(true)}
        aria-label={t(language, "openCatalog")}
        aria-expanded={isMobileOpen}
      >
        <Menu size={20} />
        <span>{t(language, "catalog")}</span>
      </button>

      {isMobileOpen && (
        <button
          type="button"
          className="mobileSidebarOverlay"
          onClick={() => setIsMobileOpen(false)}
          aria-label={t(language, "closeCatalog")}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? "mobileDrawerOpen" : ""}`}>
        <button
          type="button"
          className="mobileSidebarClose"
          onClick={() => setIsMobileOpen(false)}
          aria-label={t(language, "closeCatalog")}
        >
          <X size={21} />
        </button>
      <div className="brand">
       <img
        src="/images/logo/logo.png"
        alt="NevFim"
        className="brandLogoImage"
      />

      <div>
       <h1 className="logoTitle">
        <span className="logoWhite">NevFim</span>
        <span className="logoGold">.grup</span>
       </h1>

     <p>{t(language, "aiFurniture")}</p>
   </div>
  </div>

      {!isGenerated && !selectedCategory && (
        <>
          <div className="sidebarHeader">
            <span className="step">01</span>

            <div>
              <h2>{t(language, "chooseCategory")}</h2>
              <p>{t(language, "chooseType")}</p>
            </div>
          </div>

          <div className="categoryList">
            {categories.map((category) => (
              <button
                key={category.id}
                className="categoryButton"
                onClick={() => onSelectCategory(category)}
                type="button"
              >
                <span className="categoryIcon">
                   <FurnitureIcon categoryId={category.id} />
                </span>

                <span className="categoryText">
                  <strong>{categoryName(language, category.id, category.name)}</strong>
                  <small>{categoryDescription(language, category.id, category.description)}</small>
                </span>

                <span className="arrow">
                 <ChevronRight
                  size={18}
                  strokeWidth={1.6}
                  aria-hidden="true"
                 />
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {!isGenerated && selectedCategory && !selectedModel && (
        <section className="modelCatalog">
          <button
            className="backButton"
            onClick={onBackToCategories}
            type="button"
          >
            ← {t(language, "allCategories")}
          </button>

          <div className="sidebarHeader">
            <span className="step">02</span>

            <div>
              <h2>{categoryName(language, selectedCategory.id, selectedCategory.name)}</h2>
              <p>{t(language, "chooseModel")}</p>
            </div>
          </div>

          <div className="modelGrid">
            {categoryModels.map((model) => (
              <button
                key={model.id}
                className="modelCard"
                onClick={() => onSelectModel(model)}
                type="button"
              >
                <img src={model.image} alt={model.name} />

                <div className="modelCardContent">
                  <strong>{model.productCode}</strong>
                  <small>{modelDescription(language, model.categoryId, model.description)}</small>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {!isGenerated && selectedCategory && selectedModel && (
        <section className="parameters">
          <button
            className="backButton"
            onClick={onBackToModels}
            type="button"
          >
            ← {t(language, "otherModels")}
          </button>

          <div className="sidebarHeader">
            <span className="step">03</span>

            <div>
              <h2>{t(language, "parameters")}</h2>
              <p>{t(language, "configureModel")}</p>
            </div>
          </div>

          <div className="selectedModelCard">
            <button
              className="selectedModelImageButton"
              type="button"
              onClick={() => setPreviewImage(selectedModel.image)}
              aria-label={`${t(language, "clickPreview")}: ${modelName(language, selectedModel.categoryId, selectedModel.name)}`}
            >
              <img src={selectedModel.image} alt={selectedModel.name} />

              <span className="imageZoomHint">
                {t(language, "clickPreview")}
              </span>
            </button>

            <div>
              <small>{categoryName(language, selectedCategory.id, selectedCategory.name)}</small>
              <strong>{selectedModel.productCode}</strong>
            </div>
          </div>

          <div className="formGrid">
            <label>
              {t(language, "widthMm")}
              <input
                type="number"
                value={width}
                onChange={(event) => onWidthChange(event.target.value)}
                placeholder={selectedCategory.id === "beds" ? "1600" : "2400"}
                inputMode="numeric"
                min={100}
                max={10000}
                step={selectedCategory.id === "beds" ? 200 : 10}
              />
            </label>

            <label>
              {t(language, "heightMm")}
              <input
                value={height}
                onChange={(event) => onHeightChange(event.target.value)}
                placeholder="2600"
                inputMode="numeric"
              />
            </label>

            <label>
              {t(language, "depthMm")}
              <input
                value={depth}
                onChange={(event) => onDepthChange(event.target.value)}
                placeholder="600"
                inputMode="numeric"
              />
            </label>

            {!isSoftFurniture && (
              <label>
                {t(language, "material")}
                <select
                  value={material}
                  onChange={(event) => onMaterialChange(event.target.value)}
                >
                  <option value="">{t(language, "chooseMaterial")}</option>
                  <option value="ЛДСП">ЛДСП</option>
                  <option value="МДФ">МДФ</option>
                  <option value="Шпон">{t(language, "veneer")}</option>
                </select>
              </label>
            )}

            {!isSoftFurniture && (
              <div className="colorSection">
                <span className="fieldTitle">{t(language, "color")}</span>

                <div className="colorGrid">
                  {colors.map(({ name, hex }) => (
                    <button
                      key={name}
                      className={`colorOption ${
                        color === name ? "active" : ""
                      }`}
                      onClick={() => {
                        onColorChange(name);
                        onCustomColorChange("");
                      }}
                      type="button"
                    >
                      <span
                        className="colorPreview"
                        style={{ background: hex }}
                      />

                      <small>{({ "Світлий дуб": t(language, "lightOak"), "Натуральний дуб": t(language, "naturalOak"), "Горіх": t(language, "walnut"), "Чорний дуб": t(language, "blackOak"), "Бежевий": t(language, "beige"), "Графіт": t(language, "graphite") } as Record<string, string>)[name] ?? name}</small>
                    </button>
                  ))}
                </div>

                <button
                  className={`customColorButton ${
                    color === "Індивідуальний" ? "active" : ""
                  }`}
                  onClick={() => onColorChange("Індивідуальний")}
                  type="button"
                >
                  + {t(language, "customColor")}
                </button>

                {color === "Індивідуальний" && (
                  <label className="customColorField">
                    {t(language, "specifyColor")}
                    <input
                      type="text"
                      value={customColor}
                      onChange={(event) =>
                        onCustomColorChange(event.target.value)
                      }
                      placeholder={t(language, "customColorPlaceholder")}
                    />
                  </label>
                )}
              </div>
            )}

            {isSoftFurniture && (
              <FabricPicker
                language={language}
                value={fabric}
                image={fabricImage}
                onSelect={onFabricSelect}
              />
            )}
          </div>
        </section>
      )}

      {isGenerated && (
        <section className="resultPanel">
          <button
            className="backButton"
            onClick={onReset}
            type="button"
          >
            ← {t(language, "changeProject")}
          </button>

          <div className="productSummary">
            <img
              className="summaryImage"
              src={selectedModel?.image}
              alt={selectedModel?.name ?? "Модель"}
            />

            <div>
              <small>
                {selectedCategory
                  ? categoryName(
                      language,
                      selectedCategory.id,
                      selectedCategory.name,
                    )
                  : ""}
              </small>
              <h2>
                {selectedModel?.productCode ?? ""}
              </h2>
            </div>
          </div>

          <div className="resultSection">
            <h3>{t(language, "characteristics")}</h3>

            <div className="parameterRows">
              <div>
                <span>{t(language, "width")}</span>
                <strong>{width ? `${width} мм` : t(language, "standard")}</strong>
              </div>

              <div>
                <span>{t(language, "height")}</span>
                <strong>{height ? `${height} мм` : t(language, "standard")}</strong>
              </div>

              <div>
                <span>{t(language, "depth")}</span>
                <strong>{depth ? `${depth} мм` : t(language, "standard")}</strong>
              </div>

              {!isSoftFurniture && (
                <div>
                  <span>{t(language, "material")}</span>
                  <strong>{material || t(language, "notSpecified")}</strong>
                </div>
              )}

              {!isSoftFurniture && (
                <div>
                  <span>{t(language, "color")}</span>
                  <strong>{displayedColor}</strong>
                </div>
              )}

              {isSoftFurniture && (
                <div>
                  <span>{t(language, "fabric")}</span>
                  <strong className="fabricResultValue">
                    {fabricImage && <img src={fabricImage} alt="" />}
                    <span>{fabric || t(language, "notSpecified")}</span>
                  </strong>
                </div>
              )}
            </div>

            <div className="customerPrompt">
              <span>{t(language, "customerPrompt")}</span>

              <p>
                {prompt.trim()
                  ? prompt
                  : t(language, "noPrompt")}
              </p>
            </div>
          </div>

          <div className="priceCard">
            <small>{t(language, "price")}</small>
            <strong>
              {estimatedPrice.toLocaleString(
                language === "cs"
                  ? "cs-CZ"
                  : language === "ru"
                    ? "ru-RU"
                    : "en-US",
              )} Kč
            </strong>
          </div>

          <div className="deliveryCard">
            <span>◷</span>

            <div>
              <small>{t(language, "estimatedTime")}</small>
              <strong>{selectedCategory?.defaultDays}</strong>
            </div>
          </div>

          <div className="actionButtons">
            <button
              className="secondaryAction"
              type="button"
              onClick={onAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart
                ? language === "ru"
                  ? "Добавляем..."
                  : language === "cs"
                    ? "Přidáváme..."
                    : "Adding..."
                : t(language, "addCart")}
            </button>

            {cartMessage && (
              <p
                className={`cartActionMessage ${
                  cartError ? "cartActionMessage--error" : ""
                }`}
                role="status"
              >
                {cartMessage}
              </p>
            )}
          </div>
        </section>
      )}
      </aside>

      {previewImage && (
        <div
          className="imageLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t(language, "clickPreview")}
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="imageLightboxClose"
            type="button"
            onClick={() => setPreviewImage(null)}
            aria-label={t(language, "close")}
          >
            ×
          </button>

          <div
            className="imageLightboxContent"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={previewImage}
              alt={selectedModel?.name ?? "Модель меблів"}
            />

            <div className="imageLightboxCaption">
              <strong>
                {selectedModel?.productCode ?? ""}
              </strong>
              <span>
                {selectedCategory
                  ? categoryName(
                      language,
                      selectedCategory.id,
                      selectedCategory.name,
                    )
                  : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}