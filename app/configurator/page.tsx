"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { categoryName, modelName, t, type Language } from "@/i18n/translations";
import { addToCart } from "@/lib/cart/cart";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ThreeDWorkspace } from "@/components/ThreeD/ThreeDWorkspace";
import { Workspace } from "@/components/Workspace/Workspace";
import {
  furnitureCategories,
  furnitureModels,
} from "@/data/furniture";

import type {
  FurnitureCategory,
  FurnitureModel,
} from "@/types/furniture";

type GenerateResponse = {
  image?: string;
  error?: string;
};

type ViewMode = "2d" | "3d";

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState<FurnitureCategory | null>(null);

  const [selectedModel, setSelectedModel] =
    useState<FurnitureModel | null>(null);

  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] =
    useState<string | null>(null);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [fabric, setFabric] = useState("");
  const [prompt, setPrompt] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [language, setLanguage] = useState<Language>("en");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState(false);

  const [transitionPhase, setTransitionPhase] =
    useState<"cover" | "hold" | "reveal" | null>(null);

  const transitionTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach((timer) =>
        window.clearTimeout(timer),
      );
    };
  }, []);


  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("nevfim-language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "cs" ||
      savedLanguage === "ru"
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("nevfim-language", nextLanguage);
    document.cookie = `nevfim-language=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const startViewTransition = (nextMode: ViewMode) => {
    if (transitionPhase || nextMode === viewMode) {
      return;
    }

    transitionTimers.current.forEach((timer) =>
      window.clearTimeout(timer),
    );
    transitionTimers.current = [];

    // 1. Шторка падает сверху.
    setTransitionPhase("cover");

    // 2. Когда экран уже закрыт, переключаем 2D/3D.
    // Новый режим начинает рендериться ПОД полупрозрачной шторкой.
    const switchTimer = window.setTimeout(() => {
      setViewMode(nextMode);
      setTransitionPhase("hold");
    }, 620);

    // 3. Даём новому режиму время спокойно отрисовать Canvas/интерфейс.
    const revealTimer = window.setTimeout(() => {
      setTransitionPhase("reveal");
    }, 1550);

    // 4. После ухода шторки полностью удаляем overlay.
    const finishTimer = window.setTimeout(() => {
      setTransitionPhase(null);
    }, 2250);

    transitionTimers.current.push(
      switchTimer,
      revealTimer,
      finishTimer,
    );
  };

  const isSoftFurniture = [
    "beds",
    "sofas",
    "armchairs",
    "hangers",
  ].includes(selectedCategory?.id ?? "");

  // Цена товара берётся только из basePrice, который ты укажешь в furniture.ts.
  // Размеры, материал, цвет и ткань цену больше не изменяют.
  const productPrice = selectedModel?.basePrice ?? 0;

  const handleRoomImage = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (roomImage?.startsWith("blob:")) {
      URL.revokeObjectURL(roomImage);
    }

    const imageUrl = URL.createObjectURL(file);

    setRoomImage(imageUrl);
    setGeneratedImage(null);
    setGenerationError("");
    setIsGenerated(false);
  };

  const handleSelectCategory = (
    category: FurnitureCategory,
  ) => {
    setSelectedCategory(category);
    setSelectedModel(null);
    setMaterial("");
    setColor("");
    setCustomColor("");
    setFabric("");
    setGenerationError("");
  };

  const handleSelectModel = (model: FurnitureModel) => {
    setSelectedModel(model);
    setGenerationError("");
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedModel(null);
    setGenerationError("");
  };

  const handleBackToModels = () => {
    setSelectedModel(null);
    setGenerationError("");
  };

  const handleGenerate = async () => {
    if (!selectedCategory || !selectedModel) {
      alert(t(language, "selectFurnitureFirst"));
      return;
    }

    if (!roomImage) {
      alert(t(language, "addRoomPhoto"));
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError("");

      const roomResponse = await fetch(roomImage);

      if (!roomResponse.ok) {
        throw new Error(t(language, "readRoomError"));
      }

      const roomBlob = await roomResponse.blob();

      const furnitureResponse = await fetch(selectedModel.image);

      if (!furnitureResponse.ok) {
        throw new Error(t(language, "furniturePhotoError"));
      }

      const furnitureBlob = await furnitureResponse.blob();
      const formData = new FormData();

      formData.append("roomImage", roomBlob, "room-image.png");
      formData.append(
        "furnitureImage",
        furnitureBlob,
        "furniture-model.png",
      );

      formData.append("prompt", prompt);
      formData.append("category", selectedCategory.name);
      formData.append("modelName", selectedModel.name);
      formData.append("width", width);
      formData.append("height", height);
      formData.append("depth", depth);
      formData.append("material", isSoftFurniture ? "" : material);
      formData.append(
        "color",
        color === "Індивідуальний" ? customColor : color,
      );
      formData.append("fabric", fabric);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as GenerateResponse;

      if (!response.ok || !data.image) {
        throw new Error(
          data.error || t(language, "generateError"),
        );
      }

      setGeneratedImage(data.image);
      setIsGenerated(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t(language, "unknownError");

      setGenerationError(message);
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIsGenerated(false);
    setGeneratedImage(null);
    setGenerationError("");
  };

  const handleAddToCart = async () => {
    if (!selectedCategory || !selectedModel) {
      setCartError(true);
      setCartMessage(t(language, "selectFurnitureFirst"));
      return;
    }

    const selectedColor =
      color === "Індивідуальний"
        ? customColor.trim()
        : color;

    try {
      setIsAddingToCart(true);
      setCartMessage("");
      setCartError(false);

      const result = await addToCart({
        source: "2d",
        categoryId: selectedCategory.id,
        categoryName: categoryName(
          language,
          selectedCategory.id,
          selectedCategory.name,
        ),
        modelId: selectedModel.id,
        productCode: selectedModel.productCode,
        modelName: modelName(
          language,
          selectedModel.categoryId,
          selectedModel.name,
        ),
        imageUrl: selectedModel.image,
        widthMm: width ? Number(width) : null,
        heightMm: height ? Number(height) : null,
        depthMm: depth ? Number(depth) : null,
        material: isSoftFurniture ? "" : material,
        color: selectedColor,
        fabric: isSoftFurniture ? fabric : "",
        customerPrompt: prompt,
        price: productPrice,
        quantity: 1,
      });

      if (!result.success) {
        if (result.requiresAuth) {
          setCartError(true);
          setCartMessage(
            language === "ru"
              ? "Сначала войдите или зарегистрируйтесь."
              : language === "cs"
                ? "Nejprve se přihlaste nebo zaregistrujte."
                : "Please log in or register first.",
          );

          window.setTimeout(() => {
            window.location.href = "/login";
          }, 900);

          return;
        }

        throw new Error(result.error);
      }

      setCartError(false);
      setCartMessage(
        language === "ru"
          ? "Товар добавлен в вашу корзину."
          : language === "cs"
            ? "Produkt byl přidán do vašeho košíku."
            : "The product was added to your cart.",
      );
    } catch (error) {
      setCartError(true);
      setCartMessage(
        error instanceof Error
          ? error.message
          : language === "ru"
            ? "Не удалось добавить товар."
            : language === "cs"
              ? "Produkt se nepodařilo přidat."
              : "Could not add the product.",
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const sidebar = (
    <Sidebar
      language={language}
      categories={furnitureCategories}
      models={furnitureModels}
      selectedCategory={selectedCategory}
      selectedModel={selectedModel}
      isGenerated={isGenerated}
      isSoftFurniture={isSoftFurniture}
      width={width}
      height={height}
      depth={depth}
      material={material}
      color={color}
      customColor={customColor}
      fabric={fabric}
      prompt={prompt}
      estimatedPrice={productPrice}
      onSelectCategory={handleSelectCategory}
      onSelectModel={handleSelectModel}
      onBackToCategories={handleBackToCategories}
      onBackToModels={handleBackToModels}
      onWidthChange={setWidth}
      onHeightChange={setHeight}
      onDepthChange={setDepth}
      onMaterialChange={setMaterial}
      onColorChange={setColor}
      onCustomColorChange={setCustomColor}
      onFabricChange={setFabric}
      onReset={handleReset}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAddingToCart}
      cartMessage={cartMessage}
      cartError={cartError}
    />
  );

  return (
    <main className={`app modeHost ${viewMode === "3d" ? "threeDMode" : ""}`}>
      {/* 2D остаётся смонтированным, чтобы при возврате не было повторной тяжёлой инициализации */}
      <div
        className={`modeLayer ${
          viewMode === "2d" ? "modeLayer--active" : "modeLayer--hidden"
        }`}
        aria-hidden={viewMode !== "2d"}
      >
        {sidebar}

        <Workspace
          language={language}
          onLanguageChange={handleLanguageChange}
          roomImage={roomImage}
          generatedImage={generatedImage}
          isGenerated={isGenerated}
          isGenerating={isGenerating}
          generationError={generationError}
          prompt={prompt}
          onRoomImageChange={handleRoomImage}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          onOpen3D={() => startViewTransition("3d")}
        />
      </div>

      {/* 3D Canvas создаётся один раз сразу при открытии сайта.
          Пока пользователь в 2D, он скрыт и переведён в frameloop="demand",
          поэтому не перерисовывается постоянно и почти не грузит GPU. */}
      <div
        className={`modeLayer ${
          viewMode === "3d" ? "modeLayer--active" : "modeLayer--hidden"
        }`}
        aria-hidden={viewMode !== "3d"}
      >
        <ThreeDWorkspace
          language={language}
          onLanguageChange={handleLanguageChange}
          onBackTo2D={() => startViewTransition("2d")}
          isActive={viewMode === "3d"}
        />
      </div>

      {transitionPhase && (
        <div
          className={`modeTransitionCurtain modeTransitionCurtain--${transitionPhase}`}
          aria-hidden="true"
        >
          <div className="modeTransitionBrand">
            <div className="modeTransitionLogo">
              <span className="modeTransitionWhite">NevFim</span>
              <span className="modeTransitionGold">.grup</span>
            </div>

            <p>
              {language === "ru"
                ? "AI-конструктор мебели"
                : language === "cs"
                  ? "AI návrhář nábytku"
                  : "AI furniture constructor"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}