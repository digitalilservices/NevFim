"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Layers3, Palette } from "lucide-react";
import {
  FABRIC_MANIFEST_URL,
  fabricCollections,
  getFabricSwatches,
} from "@/data/fabrics";
import type { Language } from "@/i18n/translations";
import type { FabricManifest } from "@/data/fabrics";

type FabricPickerProps = {
  language: Language;
  value: string;
  image: string;
  onSelect: (value: string, image: string) => void;
  variant?: "constructor" | "site";
};

const copy = {
  en: {
    title: "Fabric",
    trigger: "Choose fabric",
    collection: "Fabric collection",
    swatch: "Choose a color sample",
    helper: "Select a collection, then the exact fabric color number.",
    selected: "Selected",
    loading: "Loading samples…",
    empty: "No samples have been added to this collection yet.",
  },
  cs: {
    title: "Látka",
    trigger: "Vybrat látku",
    collection: "Kolekce látky",
    swatch: "Vyberte vzorek barvy",
    helper: "Vyberte kolekci a potom přesné číslo barvy látky.",
    selected: "Vybráno",
    loading: "Načítání vzorků…",
    empty: "V této kolekci zatím nejsou žádné vzorky.",
  },
  ru: {
    title: "Ткань",
    trigger: "Выбрать ткань",
    collection: "Коллекция ткани",
    swatch: "Выберите образец цвета",
    helper: "Сначала выберите коллекцию, затем точный номер цвета ткани.",
    selected: "Выбрано",
    loading: "Загружаем образцы…",
    empty: "В этой коллекции пока нет образцов.",
  },
} satisfies Record<Language, Record<string, string>>;

export function FabricPicker({
  language,
  value,
  image,
  onSelect,
  variant = "constructor",
}: FabricPickerProps) {
  const text = copy[language];
  const [isOpen, setIsOpen] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState(
    fabricCollections[0]?.id ?? "",
  );
  const [manifest, setManifest] = useState<FabricManifest>({});
  const [isManifestLoading, setIsManifestLoading] = useState(true);
  const [brokenSwatches, setBrokenSwatches] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadManifest() {
      try {
        const response = await fetch(FABRIC_MANIFEST_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Fabric manifest: ${response.status}`);
        }

        const data = (await response.json()) as FabricManifest;
        if (!cancelled) {
          setManifest(data ?? {});
        }
      } catch (error) {
        console.error("Failed to load fabric manifest", error);
        if (!cancelled) {
          setManifest({});
        }
      } finally {
        if (!cancelled) {
          setIsManifestLoading(false);
        }
      }
    }

    loadManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!image) return;

    const match = fabricCollections.find((collection) =>
      image.includes(`/images/fabrics/${collection.folder}/`),
    );

    if (match) {
      setActiveCollectionId(match.id);
    }
  }, [image]);

  const activeCollection =
    fabricCollections.find((collection) => collection.id === activeCollectionId) ??
    fabricCollections[0];

  const swatches = useMemo(
    () =>
      activeCollection
        ? getFabricSwatches(activeCollection, manifest).filter(
            (swatch) => !brokenSwatches.has(swatch.id),
          )
        : [],
    [activeCollection, manifest, brokenSwatches],
  );

  return (
    <div
      className={`fabricPicker fabricPicker--${variant} ${isOpen ? "isOpen" : ""}`}
    >
      <span className="fieldTitle">{text.title}</span>

      <button
        type="button"
        className={`fabricPickerTrigger ${value ? "hasValue" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className="fabricPickerTriggerIcon">
          <Palette size={18} />
        </span>

        <span className="fabricPickerTriggerText">
          <small>{value ? text.selected : text.collection}</small>
          <strong>{value || text.trigger}</strong>
        </span>

        {image && (
          <span className="fabricPickerMiniSwatch" aria-hidden="true">
            <img src={image} alt="" />
          </span>
        )}

        <ChevronDown className="fabricPickerChevron" size={18} />
      </button>

      {isOpen && (
        <div className="fabricPickerPanel">
          <div className="fabricPickerPanelHead">
            <span>
              <Layers3 size={17} />
            </span>
            <div>
              <strong>{text.collection}</strong>
              <small>{text.helper}</small>
            </div>
          </div>

          <div className="fabricCollectionGrid">
            {fabricCollections.map((collection) => (
              <button
                type="button"
                key={collection.id}
                className={
                  collection.id === activeCollectionId ? "active" : undefined
                }
                onClick={() => {
                  setActiveCollectionId(collection.id);
                  setBrokenSwatches(new Set());
                }}
                aria-pressed={collection.id === activeCollectionId}
              >
                {collection.name}
              </button>
            ))}
          </div>

          {activeCollection && (
            <div className="fabricSwatchSection">
              <div className="fabricSwatchHeading">
                <div>
                  <small>{text.swatch}</small>
                  <strong>{activeCollection.name}</strong>
                </div>
                <span>{swatches.length}</span>
              </div>

              {isManifestLoading ? (
                <span className="fabricMissingPreview" style={{ position: "relative", minHeight: 88 }}>
                  <small>{text.loading}</small>
                </span>
              ) : swatches.length > 0 ? (
                <div className="fabricSwatchGrid">
                  {swatches.map((swatch) => {
                    const isSelected = image === swatch.image;

                    return (
                      <button
                        type="button"
                        key={swatch.id}
                        className={`fabricSwatch ${isSelected ? "active" : ""}`}
                        onClick={() => {
                          onSelect(swatch.label, swatch.image);
                          setIsOpen(false);
                        }}
                        title={swatch.label}
                        aria-label={`${activeCollection.name}, №${swatch.number}`}
                        aria-pressed={isSelected}
                      >
                        <img
                          src={swatch.image}
                          alt={`${activeCollection.name} №${swatch.number}`}
                          onError={() => {
                            setBrokenSwatches((current) => {
                              const next = new Set(current);
                              next.add(swatch.id);
                              return next;
                            });
                          }}
                        />

                        <span className="fabricSwatchNumber">№{swatch.number}</span>

                        {isSelected && (
                          <span className="fabricSwatchCheck">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="fabricMissingPreview" style={{ position: "relative", minHeight: 88 }}>
                  <small>{text.empty}</small>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
