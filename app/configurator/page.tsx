"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { categoryName, modelName, t, type Language } from "@/i18n/translations";
import { addToCart } from "@/lib/cart/cart";
import { calculateFurniturePrice } from "@/lib/pricing";

import { Sidebar } from "@/components/Sidebar/Sidebar";
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
  const [fabricImage, setFabricImage] = useState("");
  const [prompt, setPrompt] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  const [language, setLanguage] = useState<Language>("en");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState(false);


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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("category");
    const modelId = params.get("model");

    if (!categoryId && !modelId) {
      return;
    }

    const matchedModel = modelId
      ? furnitureModels.find((model) => model.id === modelId)
      : undefined;
    const matchedCategory = furnitureCategories.find(
      (category) => category.id === (matchedModel?.categoryId ?? categoryId),
    );

    if (!matchedCategory) {
      return;
    }

    setSelectedCategory(matchedCategory);
    setSelectedModel(
      matchedModel?.categoryId === matchedCategory.id ? matchedModel : null,
    );
    setMaterial("");
    setColor("");
    setCustomColor("");
    setFabric("");
    setFabricImage("");
    setGeneratedImage(null);
    setIsGenerated(false);
    setGenerationError("");
  }, []);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("nevfim-language", nextLanguage);
    document.cookie = `nevfim-language=${nextLanguage}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const isSoftFurniture = [
    "beds",
    "sofas",
    "armchairs",
    "hangers",
  ].includes(selectedCategory?.id ?? "");

  // Для ліжок basePrice відповідає ширині 1600 мм. Кожні 200 мм = ±500 Kč.
  const productPrice = calculateFurniturePrice(
    selectedModel,
    width ? Number(width) : null,
  );

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
    setFabricImage("");
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
        isSoftFurniture
          ? ""
          : color === "Індивідуальний"
            ? customColor
            : color,
      );
      formData.append("fabric", fabric);

      if (isSoftFurniture && fabricImage) {
        const fabricResponse = await fetch(fabricImage);

        if (!fabricResponse.ok) {
          throw new Error(
            language === "ru"
              ? "Не удалось загрузить выбранный образец ткани."
              : language === "cs"
                ? "Vybraný vzorek látky se nepodařilo načíst."
                : "Could not load the selected fabric sample.",
          );
        }

        const fabricBlob = await fabricResponse.blob();
        formData.append("fabricImage", fabricBlob, "fabric-swatch.jpg");
      }

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

    const selectedColor = isSoftFurniture
      ? ""
      : color === "Індивідуальний"
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
      fabricImage={fabricImage}
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
      onFabricSelect={(value, image) => {
        setFabric(value);
        setFabricImage(image);
      }}
      onReset={handleReset}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAddingToCart}
      cartMessage={cartMessage}
      cartError={cartError}
    />
  );

  return (
    <main className="app">
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
      />
    </main>
  );
}
