"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  BedDouble,
  ChevronRight,
  DoorOpen,
  Grid2X2,
  PanelTop,
  PanelsTopLeft,
  Sofa,
  Archive,
  Armchair,
  Menu,
  X,
} from "lucide-react";
import { categoryDescription, categoryName, modelDescription, modelName, t, type Language } from "@/i18n/translations";

import {
  furniture3DCategories,
  furniture3DModels,
} from "@/data/furniture3d";

import type {
  Furniture3DCategory,
  Furniture3DModel,
} from "@/data/furniture3d";

type ThreeDSidebarProps = {
  language: Language;
  selectedModel:
    Furniture3DModel | null;

  isModelLoading: boolean;
  modelLoadProgress: number;
  isModelReady: boolean;
  modelLoadError: string;

  onSelectModel: (
    model: Furniture3DModel,
  ) => void;

  onClearModel: () => void;
  onAddToRoom: () => void;
};

function CategoryIcon({
  categoryId,
}: {
  categoryId: string;
}) {
  switch (categoryId) {
    case "hinged-wardrobes":
      return <DoorOpen size={22} />;

    case "sliding-wardrobes":
      return (
        <PanelsTopLeft size={22} />
      );

    case "wardrobe-systems":
      return <Grid2X2 size={22} />;

    case "beds":
      return <BedDouble size={22} />;

    case "sofas":
      return <Sofa size={22} />;

    case "dressers":
      return <Archive size={22} />;

    case "sliding-systems":
      return <PanelsTopLeft size={22} />;

    case "armchairs":
      return <Armchair size={22} />;

    case "hangers":
      return <PanelTop size={22} />;

    case "tables":
      return <Grid2X2 size={22} />;

    case "chairs":
      return <Armchair size={22} />;

    case "table-chair-sets":
      return <Armchair size={22} />;

    default:
      return <Grid2X2 size={22} />;
  }
}

export function ThreeDSidebar({
  language,
  selectedModel,
  isModelLoading,
  modelLoadProgress,
  isModelReady,
  modelLoadError,
  onSelectModel,
  onClearModel,
  onAddToRoom,
}: ThreeDSidebarProps) {
  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<Furniture3DCategory | null>(
      null,
    );

  const [isMobileOpen, setIsMobileOpen] =
    useState(false);

  const models = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return furniture3DModels.filter(
      (model) =>
        model.categoryId ===
        selectedCategory.id,
    );
  }, [selectedCategory]);

  const handleSelectCategory = (
    category: Furniture3DCategory,
  ) => {
    setSelectedCategory(category);
    onClearModel();
  };

  const handleBackToCategories =
    () => {
      setSelectedCategory(null);
      onClearModel();
    };

  const handleBackToModels = () => {
    onClearModel();
  };

  return (
    <>
      <button
        type="button"
        className="mobileSidebarToggle mobileSidebarToggle3D"
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

      <aside
        className={`threeDSidebar ${isMobileOpen ? "mobileDrawerOpen" : ""}`}
      >
        <button
          type="button"
          className="mobileSidebarClose"
          onClick={() => setIsMobileOpen(false)}
          aria-label={t(language, "closeCatalog")}
        >
          <X size={21} />
        </button>
      <div className="threeDBrand">
        <img
          src="/images/logo/logo.png"
          alt="NevFim"
          className="threeDBrandLogo"
        />

        <div className="threeDBrandText">
          <h1>
            <span className="threeDBrandWhite">
              NevFim
            </span>

            <span className="threeDBrandGold">
              .grup
            </span>
          </h1>

          <p>{t(language, "constructor3d")}</p>
        </div>
      </div>

      {!selectedCategory &&
        !selectedModel && (
          <div className="threeDSidebarContent">
            <div className="threeDSectionHeader">
              <span className="threeDStep">
                01
              </span>

              <div>
                <h2>
                  {t(language, "chooseCategory")}
                </h2>

                <p>{t(language, "chooseType")}</p>
              </div>
            </div>

            <div className="threeDCategoryList">
              {furniture3DCategories.map(
                (category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="threeDCategoryCard"
                    onClick={() =>
                      handleSelectCategory(
                        category,
                      )
                    }
                  >
                    <span className="threeDCategoryIcon">
                      <CategoryIcon
                        categoryId={
                          category.id
                        }
                      />
                    </span>

                    <span className="threeDCategoryText">
                      <strong>
                        {categoryName(language, category.id, category.name)}
                      </strong>

                      <small>
                        {categoryDescription(
                          language,
                          category.id,
                          category.description,
                        )}
                      </small>
                    </span>

                    <span className="threeDCategoryArrow">
                      <ChevronRight
                        size={18}
                      />
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
        )}

      {selectedCategory &&
        !selectedModel && (
          <div className="threeDSidebarContent">
            <button
              type="button"
              className="threeDBackButton"
              onClick={
                handleBackToCategories
              }
            >
              ← {t(language, "allCategories")}
            </button>

            <div className="threeDSectionHeader">
              <span className="threeDStep">
                02
              </span>

              <div>
                <h2>
                  {categoryName(language, selectedCategory.id, selectedCategory.name)}
                </h2>

                <p>{t(language, "chooseModel")}</p>
              </div>
            </div>

            <div className="threeDModelGrid">
              {models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  className="threeDModelCard"
                  onClick={() =>
                    onSelectModel(model)
                  }
                >
                  <div className="threeDModelImageWrap">
                    <img
                      src={
                        model.imagePath
                      }
                      alt={modelName(language, model.categoryId, model.name)}
                      className="threeDModelImage"
                      loading="lazy"
                    />
                  </div>

                  <div className="threeDModelCardInfo">
                    <small className="threeDProductCode">
                      {model.productCode}
                    </small>
                    <strong>
                      {modelName(language, model.categoryId, model.name)}
                    </strong>

                    <small>
                      {modelDescription(
                        language,
                        model.categoryId,
                        model.description,
                      )}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      {selectedModel && (
        <div className="threeDSidebarContent">
          <button
            type="button"
            className="threeDBackButton"
            onClick={
              handleBackToModels
            }
          >
            ← {t(language, "otherModels")}
          </button>

          <div className="threeDSectionHeader">
            <span className="threeDStep">
              03
            </span>

            <div>
              <h2>{t(language, "selectedModel")}</h2>

              <p>
                {t(language, "modelPreloads")}
              </p>
            </div>
          </div>

          <div className="threeDSelectedModel">
            <div className="threeDSelectedPreview">
              <img
                src={
                  selectedModel.imagePath
                }
                alt={
                  selectedModel.name
                }
                className="threeDSelectedImage"
              />
            </div>

            <div className="threeDSelectedInfo">
              <small>{selectedModel.productCode}</small>

              <strong>
                {modelName(language, selectedModel.categoryId, selectedModel.name)}
              </strong>

              <span>
                {
                  modelDescription(language, selectedModel.categoryId, selectedModel.description)
                }
              </span>
            </div>
          </div>

          {isModelLoading && (
            <div className="threeDSidebarLoadStatus">
              <div>
                <span>
                  {t(language, "modelLoading")}
                </span>

                <strong>
                  {modelLoadProgress}%
                </strong>
              </div>

              <div className="threeDSidebarLoadBar">
                <span
                  style={{
                    width: `${modelLoadProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {modelLoadError && (
            <p className="threeDModelLoadError">
              {modelLoadError}
            </p>
          )}

          <button
            type="button"
            className="threeDAddToRoomButton"
            onClick={onAddToRoom}
            disabled={!isModelReady}
          >
            <span>＋</span>

            {isModelLoading
              ? `${t(language, "modelLoading")} ${modelLoadProgress}%`
              : isModelReady
                ? t(language, "addToRoom")
                : t(language, "modelNotReady")}
          </button>
        </div>
      )}
    </aside>
    </>
  );
}