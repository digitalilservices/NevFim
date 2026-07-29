"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Group } from "three";

import { ThreeDSidebar } from "./ThreeDSidebar";
import { RoomScene } from "./RoomScene";

import type { Furniture3DModel } from "@/data/furniture3d";
import { languageOptions, t, type Language } from "@/i18n/translations";

const backToSiteLabel = (language: Language) =>
  language === "ru"
    ? "На сайт"
    : language === "cs"
      ? "Na web"
      : "Back to site";

const backToSiteStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "34px",
  padding: "0 13px",
  border: "1px solid rgba(215, 169, 81, 0.45)",
  borderRadius: "8px",
  background: "linear-gradient(135deg, rgba(215, 169, 81, 0.14), rgba(215, 169, 81, 0.04))",
  color: "#efc96f",
  fontSize: "10px",
  fontWeight: 800,
  textDecoration: "none",
  whiteSpace: "nowrap",
} as const;

type ThreeDWorkspaceProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onBackTo2D: () => void;
  isActive?: boolean;
};

type LoadedFurniture = {
  model: Furniture3DModel;
  scene: Group;
};

export function ThreeDWorkspace({
  language,
  onLanguageChange,
  onBackTo2D,
  isActive = true,
}: ThreeDWorkspaceProps) {
  const [selectedModel, setSelectedModel] =
    useState<Furniture3DModel | null>(null);

  const [preloadedFurniture, setPreloadedFurniture] =
    useState<LoadedFurniture | null>(null);

  const [addedFurniture, setAddedFurniture] =
    useState<LoadedFurniture | null>(null);

  const [isModelLoading, setIsModelLoading] =
    useState(false);

  const [modelLoadProgress, setModelLoadProgress] =
    useState(0);

  const [modelLoadError, setModelLoadError] =
    useState("");

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const loadRequestId = useRef(0);

  useEffect(() => {
    if (!selectedModel) {
      setPreloadedFurniture(null);
      setIsModelLoading(false);
      setModelLoadProgress(0);
      setModelLoadError("");
      return;
    }

    const currentRequestId =
      ++loadRequestId.current;

    setPreloadedFurniture(null);
    setIsModelLoading(true);
    setModelLoadProgress(0);
    setModelLoadError("");

    const loader = new GLTFLoader();

    loader.load(
      selectedModel.modelPath,

      (gltf) => {
        if (
          currentRequestId !==
          loadRequestId.current
        ) {
          return;
        }

        setPreloadedFurniture({
          model: selectedModel,
          scene: gltf.scene,
        });

        setModelLoadProgress(100);
        setIsModelLoading(false);
      },

      (event) => {
        if (
          currentRequestId !==
          loadRequestId.current
        ) {
          return;
        }

        if (event.total > 0) {
          const progress = Math.round(
            (event.loaded / event.total) *
              100,
          );

          setModelLoadProgress(
            Math.min(progress, 99),
          );
        } else {
          setModelLoadProgress(
            (current) =>
              Math.min(
                current + 4,
                90,
              ),
          );
        }
      },

      (error) => {
        if (
          currentRequestId !==
          loadRequestId.current
        ) {
          return;
        }

        console.error(
          "Не вдалося завантажити GLB:",
          error,
        );

        setModelLoadError(t(language, "failed3d"));

        setIsModelLoading(false);
        setModelLoadProgress(0);
      },
    );
  }, [selectedModel]);

  const handleSelectModel = (
    model: Furniture3DModel,
  ) => {
    setSelectedModel(model);
  };

  const handleClearModel = () => {
    loadRequestId.current += 1;

    setSelectedModel(null);
    setPreloadedFurniture(null);
    setIsModelLoading(false);
    setModelLoadProgress(0);
    setModelLoadError("");
  };

  const handleAddToRoom = () => {
    if (!preloadedFurniture) {
      return;
    }

    setAddedFurniture(
      preloadedFurniture,
    );
  };

  const isModelReady =
    !!selectedModel &&
    !!preloadedFurniture &&
    preloadedFurniture.model.id ===
      selectedModel.id;

  return (
    <section className="threeDWorkspaceShell">
      <ThreeDSidebar
        language={language}
        selectedModel={selectedModel}
        isModelLoading={isModelLoading}
        modelLoadProgress={
          modelLoadProgress
        }
        isModelReady={isModelReady}
        modelLoadError={modelLoadError}
        onSelectModel={
          handleSelectModel
        }
        onClearModel={
          handleClearModel
        }
        onAddToRoom={
          handleAddToRoom
        }
      />

      <section className="threeDWorkspace">
        <header className="threeDTopbar">
          <div className="threeDStudioTitle" style={{ gap: 14 }}>
            <Link href="/" aria-label={backToSiteLabel(language)} style={backToSiteStyle}>
              ← {backToSiteLabel(language)}
            </Link>

            <span className="threeDStatusDot" />

            <div>
              <strong>
                NevFim 3D Studio
              </strong>

              <small>
                {t(language, "roomConstructor")}
              </small>
            </div>
          </div>

          <div className="threeDTopbarActions">
            <div className="languageDropdown">
            <button
              type="button"
              className="languageDropdownButton"
              onClick={() => setIsLanguageOpen((current) => !current)}
            >
              {(() => {
                const currentLanguage =
                  languageOptions.find((option) => option.code === language) ??
                  languageOptions[0];
                return (
                  <>
                    <img src={currentLanguage.flag} alt="" className="languageFlag" />
                    <span>{currentLanguage.short} · {currentLanguage.label}</span>
                    <span className="languageChevron">⌄</span>
                  </>
                );
              })()}
            </button>

            {isLanguageOpen && (
              <div className="languageDropdownMenu">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    className={`languageDropdownOption ${
                      option.code === language ? "isActive" : ""
                    }`}
                    onClick={() => {
                      onLanguageChange(option.code);
                      setIsLanguageOpen(false);
                    }}
                  >
                    <img src={option.flag} alt="" className="languageFlag" />
                    <span>{option.short} · {option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="backTo2DButton"
            onClick={onBackTo2D}
          >
            ← {t(language, "back2d")}
          </button>
          </div>
        </header>

        <div className="threeDStage">
          <Canvas
            dpr={1}
            frameloop={isActive ? "always" : "demand"}
            shadows={false}
            gl={{
              antialias: false,
              alpha: false,
              powerPreference:
                "high-performance",
            }}
            camera={{
              position: [7, 5, 8],
              fov: 42,
              near: 0.1,
              far: 100,
            }}
          >
            <RoomScene
              addedFurniture={
                addedFurniture
              }
            />
          </Canvas>

          {selectedModel &&
            isModelLoading && (
              <div className="threeDLoadingOverlay">
                <div className="threeDLoadingCard">
                  <img
                    src={
                      selectedModel.imagePath
                    }
                    alt={
                      selectedModel.name
                    }
                    className="threeDLoadingImage"
                  />

                  <div className="threeDLoadingContent">
                    <span className="threeDLoadingEyebrow">
                      {t(language, "loading3d")}
                    </span>

                    <strong>
                      {
                        selectedModel.name
                      }
                    </strong>

                    <div className="threeDLoadingBar">
                      <span
                        style={{
                          width: `${modelLoadProgress}%`,
                        }}
                      />
                    </div>

                    <small>
                      {
                        modelLoadProgress
                      }
                      %
                    </small>
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>
    </section>
  );
}