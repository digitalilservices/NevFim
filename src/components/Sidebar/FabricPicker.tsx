"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Layers3, Palette } from "lucide-react";
import {
  fabricCollections,
  getFabricImageCandidates,
  getFabricSwatches,
} from "@/data/fabrics";
import type { Language } from "@/i18n/translations";
import type { FabricCollection, FabricSwatch } from "@/data/fabrics";

type FabricPickerProps = {
  language: Language;
  value: string;
  image: string;
  onSelect: (value: string, image: string) => void;
};


type FabricSwatchImageProps = {
  collection: FabricCollection;
  swatch: FabricSwatch;
  onResolved: (id: string, image: string) => void;
  onMissing: (id: string) => void;
};

function FabricSwatchImage({
  collection,
  swatch,
  onResolved,
  onMissing,
}: FabricSwatchImageProps) {
  const candidates = useMemo(
    () => getFabricImageCandidates(collection, swatch.number),
    [collection, swatch.number],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[candidateIndex] ?? swatch.image;

  useEffect(() => {
    setCandidateIndex(0);
  }, [collection.id, swatch.id]);

  return (
    <img
      src={src}
      alt={swatch.label}
      onLoad={() => onResolved(swatch.id, src)}
      onError={() => {
        if (candidateIndex < candidates.length - 1) {
          setCandidateIndex((current) => current + 1);
          return;
        }

        onMissing(swatch.id);
      }}
    />
  );
}

const copy = {
  en: {
    title: "Fabric",
    trigger: "Choose fabric",
    collection: "Fabric collection",
    swatch: "Choose a color sample",
    helper: "Select a collection, then the exact fabric sample.",
    selected: "Selected",
    unavailable: "Add image",
  },
  cs: {
    title: "Látka",
    trigger: "Vybrat látku",
    collection: "Kolekce látky",
    swatch: "Vyberte vzorek barvy",
    helper: "Vyberte kolekci a potom přesný vzorek látky.",
    selected: "Vybráno",
    unavailable: "Přidat obrázek",
  },
  ru: {
    title: "Ткань",
    trigger: "Выбрать ткань",
    collection: "Коллекция ткани",
    swatch: "Выберите образец цвета",
    helper: "Сначала выберите коллекцию, затем точный образец ткани.",
    selected: "Выбрано",
    unavailable: "Добавьте фото",
  },
} satisfies Record<Language, Record<string, string>>;

export function FabricPicker({
  language,
  value,
  image,
  onSelect,
}: FabricPickerProps) {
  const text = copy[language];
  const [isOpen, setIsOpen] = useState(false);
  const [activeCollectionId, setActiveCollectionId] = useState(
    fabricCollections[0]?.id ?? "",
  );
  const [brokenSwatches, setBrokenSwatches] = useState<Set<string>>(new Set());
  const [resolvedSwatches, setResolvedSwatches] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!image) {
      return;
    }

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
    () => (activeCollection ? getFabricSwatches(activeCollection) : []),
    [activeCollection],
  );

  return (
    <div className={`fabricPicker ${isOpen ? "isOpen" : ""}`}>
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
                onClick={() => setActiveCollectionId(collection.id)}
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
                <span>9</span>
              </div>

              <div className="fabricSwatchGrid">
                {swatches.map((swatch) => {
                  const isBroken = brokenSwatches.has(swatch.id);
                  const resolvedImage = resolvedSwatches[swatch.id] ?? "";
                  const isSelected = Boolean(
                    image && resolvedImage && image === resolvedImage,
                  );

                  return (
                    <button
                      type="button"
                      key={swatch.id}
                      className={`fabricSwatch ${isSelected ? "active" : ""} ${
                        isBroken ? "isMissing" : ""
                      }`}
                      onClick={() => {
                        if (!isBroken && resolvedImage) {
                          onSelect(swatch.label, resolvedImage);
                        }
                      }}
                      disabled={isBroken || !resolvedImage}
                      title={swatch.label}
                    >
                      {!isBroken ? (
                        <FabricSwatchImage
                          collection={activeCollection}
                          swatch={swatch}
                          onResolved={(id, resolvedImage) => {
                            setResolvedSwatches((current) =>
                              current[id] === resolvedImage
                                ? current
                                : { ...current, [id]: resolvedImage },
                            );
                          }}
                          onMissing={(id) => {
                            setBrokenSwatches((current) => {
                              const next = new Set(current);
                              next.add(id);
                              return next;
                            });
                          }}
                        />
                      ) : (
                        <span className="fabricMissingPreview">
                          <small>{text.unavailable}</small>
                          <b>{String(swatch.number).padStart(2, "0")}.jpg</b>
                        </span>
                      )}

                      <span className="fabricSwatchNumber">
                        {String(swatch.number).padStart(2, "0")}
                      </span>

                      {isSelected && (
                        <span className="fabricSwatchCheck">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
