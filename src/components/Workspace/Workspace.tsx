"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import {
  ImagePlus,
  MessageSquareText,
  Palette,
  Ruler,
  Sparkles,
  Download,
  Menu,
  X,
} from "lucide-react";
import { languageOptions, t, type Language } from "@/i18n/translations";
import { AccountButton } from "@/components/Account/AccountButton";

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

type WorkspaceProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  roomImage: string | null;
  generatedImage: string | null;
  isGenerated: boolean;
  isGenerating: boolean;
  generationError: string;
  prompt: string;

  onRoomImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
};

export function Workspace({
  language,
  onLanguageChange,
  roomImage,
  generatedImage,
  isGenerated,
  isGenerating,
  generationError,
  prompt,
  onRoomImageChange,
  onPromptChange,
  onGenerate,
}: WorkspaceProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHelpOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsHelpOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isHelpOpen]);

  const handleDownloadGeneratedImage = () => {
    if (!generatedImage) {
      return;
    }

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "nevfim-ai-visualization.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="workspace">
      <header className="topbar constructorTopbar">
        <button
          type="button"
          className="constructorCatalogTopButton"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("nevfim-open-2d-catalog"))
          }
        >
          <Menu size={20} />
          <span>{t(language, "catalog")}</span>
        </button>

        <div className="constructorStudioIdentity">
          <span className="constructorStatusDot" />
          <div>
            <strong>NevFim 2D Studio</strong>
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

        <div className="topbarActions constructorDesktopActions">
          <Link href="/" style={backToSiteStyle}>
            ← {backToSiteLabel(language)}
          </Link>

          <AccountButton language={language} />

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
            className="helpButton"
            type="button"
            onClick={() => setIsHelpOpen(true)}
          >
            {t(language, "howWorks")}
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
              <strong>NevFim 2D Studio</strong>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <Link href="/" className="constructorMenuLink" onClick={() => setIsMobileMenuOpen(false)}>
              ← {backToSiteLabel(language)}
            </Link>

            <button type="button" className="constructorMenuLink" onClick={() => { setIsHelpOpen(true); setIsMobileMenuOpen(false); }}>
              {t(language, "howWorks")}
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

            <div className="constructorMenuAccount">
              <AccountButton language={language} />
            </div>
          </aside>
        </>
      )}

      <div className="canvas">
        {!roomImage ? (
          <label className="uploadArea">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onRoomImageChange}
              hidden
            />

            <div className="uploadIcon">＋</div>

            <h2>{t(language, "uploadRoom")}</h2>

            <p>
              {t(language, "uploadRoomDesc")}
            </p>

            <span className="uploadButton">{t(language, "choosePhoto")}</span>

            <small>JPG, PNG або WEBP</small>
          </label>
        ) : (
          <div className="imagePreview">
            <img
              src={generatedImage || roomImage}
              alt={
                isGenerated
                  ? t(language, "generatedAlt")
                  : t(language, "roomAlt")
              }
            />

            {isGenerating && (
              <div className="generationOverlay">
                <div className="generationSpinner" />

                <strong>{t(language, "creating")}</strong>

                <span>{t(language, "mayTakeTime")}</span>
              </div>
            )}

            {isGenerated && !isGenerating && (
              <>
                <div className="generatedBadge">
                  <span>✦</span>
                  {t(language, "ready")}
                </div>

                {generatedImage && (
                  <button
                    type="button"
                    className="downloadGeneratedButton"
                    onClick={handleDownloadGeneratedImage}
                  >
                    <Download size={17} />
                    {t(language, "saveImage")}
                  </button>
                )}
              </>
            )}

            {!isGenerating && (
              <label className="changePhoto">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onRoomImageChange}
                  hidden
                />

                {t(language, "changePhoto")}
              </label>
            )}
          </div>
        )}
      </div>

      <div className="promptPanel">
        <div className="promptInfo">
          <span>✦</span>

          <div>
            <strong>{t(language, "prompt")}</strong>

            <small>
              {t(language, "promptHint")}
            </small>
          </div>
        </div>

        <div className="promptRow">
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder={t(language, "promptPlaceholder")}
            disabled={isGenerating}
          />

          <button
            className="generateButton"
            onClick={onGenerate}
            type="button"
            disabled={isGenerating}
          >
            <span>✦</span>
            {isGenerating ? t(language, "generating") : t(language, "generate")}
          </button>
        </div>

        {generationError && (
          <p className="generationError" role="alert">
            {generationError}
          </p>
        )}
      </div>

      <div className="constructorHashtagBar" aria-label="NevFim hashtags">
        <span>#byevsi</span>
        <span>#byevse</span>
      </div>

      {isHelpOpen && (
        <div
          className="howItWorksOverlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="howItWorksModal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="howItWorksClose"
              onClick={() => setIsHelpOpen(false)}
              aria-label={t(language, "close")}
            >
              <X size={22} />
            </button>

            <div className="howItWorksIntro">
              <span className="howItWorksBadge">NevFim Studio</span>

              <h2 id="how-it-works-title">{t(language, "helpTitle")}</h2>

              <p>
                {t(language, "helpIntro")}
              </p>
            </div>

            <div className="howItWorksModes">
              <article className="howItWorksCard">
                <div className="howItWorksCardTop">
                  <span className="howItWorksNumber">2D</span>

                  <div>
                    <h3>AI Design Studio</h3>
                    <p>{t(language, "aiDesignDesc")}</p>
                  </div>
                </div>

                <div className="howItWorksSteps">
                  <div className="howItWorksStep">
                    <span>
                      <ImagePlus size={20} />
                    </span>

                    <div>
                      <strong>{t(language, "uploadRoomStep")}</strong>
                      <p>
                        {t(language, "uploadRoomStepDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="howItWorksStep">
                    <span>
                      <Ruler size={20} />
                    </span>

                    <div>
                      <strong>{t(language, "parametersStep")}</strong>
                      <p>
                        {t(language, "parametersStepDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="howItWorksStep">
                    <span>
                      <Palette size={20} />
                    </span>

                    <div>
                      <strong>{t(language, "appearanceStep")}</strong>
                      <p>
                        {t(language, "appearanceStepDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="howItWorksStep">
                    <span>
                      <MessageSquareText size={20} />
                    </span>

                    <div>
                      <strong>{t(language, "customPromptStep")}</strong>
                      <p>
                        {t(language, "customPromptStepDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="howItWorksStep">
                    <span>
                      <Sparkles size={20} />
                    </span>

                    <div>
                      <strong>{t(language, "aiResultStep")}</strong>
                      <p>{t(language, "aiResultStepDesc")}</p>
                    </div>
                  </div>
                </div>
              </article>


            </div>

            <div className="howItWorksSummary">
              <div>
                <strong>2D</strong>
                <span>{t(language, "summary2d")}</span>
              </div>


            </div>

            <button
              type="button"
              className="howItWorksStartButton"
              onClick={() => setIsHelpOpen(false)}
            >
              {t(language, "startWork")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}