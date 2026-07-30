"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Group } from "three";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Menu, X } from "lucide-react";

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
  mobileMode?: boolean;
};

type LoadedFurniture = {
  model: Furniture3DModel;
  scene: Group;
};

type MobileMoveDirection = "forward" | "backward" | "left" | "right";

function dispatchMobileMove(
  direction: MobileMoveDirection,
  active: boolean,
) {
  window.dispatchEvent(
    new CustomEvent("nevfim-mobile-move", {
      detail: { direction, active },
    }),
  );
}

export function ThreeDWorkspace({
  language,
  onLanguageChange,
  onBackTo2D,
  isActive = true,
  mobileMode = false,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <header className="threeDTopbar constructorTopbar">
          <button
            type="button"
            className="constructorCatalogTopButton"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("nevfim-open-3d-catalog"))
            }
          >
            <Menu size={20} />
            <span>{t(language, "catalog")}</span>
          </button>

          <div className="constructorStudioIdentity">
            <span className="threeDStatusDot" />
            <div>
              <strong>NevFim 3D Studio</strong>
              <small>{t(language, "roomConstructor")}</small>
            </div>
          </div>

          <button
            type="button"
            className="constructorMobileMenuButton"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={25} />
          </button>

          <div className="threeDTopbarActions constructorDesktopActions">
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

        {isMobileMenuOpen && (
          <>
            <button
              type="button"
              className="constructorMenuBackdrop"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <aside className="constructorMobileMenu isOpen">
              <div className="constructorMobileMenuHeader">
                <strong>NevFim 3D Studio</strong>
                <button type="button" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <Link href="/" className="constructorMenuLink" onClick={() => setIsMobileMenuOpen(false)}>
                ← {backToSiteLabel(language)}
              </Link>

              <button type="button" className="constructorMenuLink" onClick={() => { onBackTo2D(); setIsMobileMenuOpen(false); }}>
                ← {t(language, "back2d")}
              </button>

              <div className="constructorMenuSection">
                <span>{language === "ru" ? "Язык" : language === "cs" ? "Jazyk" : "Language"}</span>
                <div className="constructorLanguageGrid">
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className={option.code === language ? "isActive" : ""}
                      onClick={() => onLanguageChange(option.code)}
                    >
                      <img src={option.flag} alt="" />
                      {option.short}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </>
        )}

        <div className="threeDStage">
          <Canvas
            dpr={mobileMode ? [1, 1.25] : [1, 1.5]}
            frameloop={isActive ? "always" : "demand"}
            shadows={false}
            performance={{
              min: mobileMode ? 0.65 : 0.5,
              max: 1,
              debounce: 250,
            }}
            gl={{
              antialias: false,
              alpha: false,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
              depth: true,
              stencil: false,
            }}
            camera={{
              position: mobileMode ? [0, 1.72, 4.15] : [7, 5, 8],
              fov: mobileMode ? 44 : 42,
              near: 0.1,
              far: 50,
            }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;

              const handleContextLost = (event: Event) => {
                event.preventDefault();
                console.warn("WebGL context lost on mobile");
              };

              canvas.addEventListener(
                "webglcontextlost",
                handleContextLost,
                false,
              );
            }}
          >
            <RoomScene
              addedFurniture={addedFurniture}
              mobileMode={mobileMode}
            />
          </Canvas>

          {mobileMode && (
            <div className="mobile3DControls" aria-label="3D movement controls">
              <button
                type="button"
                className="mobile3DControl mobile3DControlUp"
                aria-label="Move forward"
                onPointerDown={() => dispatchMobileMove("forward", true)}
                onPointerUp={() => dispatchMobileMove("forward", false)}
                onPointerCancel={() => dispatchMobileMove("forward", false)}
                onPointerLeave={() => dispatchMobileMove("forward", false)}
              >
                <ChevronUp size={25} />
              </button>

              <button
                type="button"
                className="mobile3DControl mobile3DControlLeft"
                aria-label="Move left"
                onPointerDown={() => dispatchMobileMove("left", true)}
                onPointerUp={() => dispatchMobileMove("left", false)}
                onPointerCancel={() => dispatchMobileMove("left", false)}
                onPointerLeave={() => dispatchMobileMove("left", false)}
              >
                <ChevronLeft size={25} />
              </button>

              <button
                type="button"
                className="mobile3DControl mobile3DControlRight"
                aria-label="Move right"
                onPointerDown={() => dispatchMobileMove("right", true)}
                onPointerUp={() => dispatchMobileMove("right", false)}
                onPointerCancel={() => dispatchMobileMove("right", false)}
                onPointerLeave={() => dispatchMobileMove("right", false)}
              >
                <ChevronRight size={25} />
              </button>

              <button
                type="button"
                className="mobile3DControl mobile3DControlDown"
                aria-label="Move backward"
                onPointerDown={() => dispatchMobileMove("backward", true)}
                onPointerUp={() => dispatchMobileMove("backward", false)}
                onPointerCancel={() => dispatchMobileMove("backward", false)}
                onPointerLeave={() => dispatchMobileMove("backward", false)}
              >
                <ChevronDown size={25} />
              </button>
            </div>
          )}

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