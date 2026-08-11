export type FabricCollection = {
  id: string;
  name: string;
  folder: string;
};

export type FabricManifestEntry = {
  slot: number;
  number: number;
  file: string;
  image: string;
};

export type FabricManifest = Record<string, FabricManifestEntry[]>;

export type FabricSwatch = {
  id: string;
  slot: number;
  number: number;
  label: string;
  image: string;
};

export const FABRIC_MANIFEST_URL = "/images/fabrics/manifest.json";

export const fabricCollections: FabricCollection[] = [
  { id: "navi", name: "Navi", folder: "navi" },
  { id: "ice-cream-nev", name: "Ice Cream Nev", folder: "ice-cream-nev" },
  { id: "a-869-flora", name: "A-869-Flora", folder: "a-869-flora" },
  { id: "ottimo", name: "Ottimo", folder: "ottimo" },
  { id: "bibtex-beta", name: "Bibtex Beta", folder: "bibtex-beta" },
  { id: "marko", name: "Marko", folder: "marko" },
  { id: "oliver", name: "Oliver", folder: "oliver" },
  { id: "komo", name: "Komo", folder: "komo" },
  { id: "lori", name: "Lori", folder: "lori" },
  { id: "lutos", name: "Lutos", folder: "lutos" },
  { id: "diamant", name: "Diamant", folder: "diamant" },
];

export function getFabricSwatches(
  collection: FabricCollection,
  manifest: FabricManifest,
): FabricSwatch[] {
  const entries = manifest[collection.folder] ?? [];

  return entries
    .filter(
      (entry) =>
        Number.isInteger(entry.slot) &&
        entry.slot >= 1 &&
        entry.slot <= 20 &&
        Number.isInteger(entry.number) &&
        entry.number >= 1 &&
        Boolean(entry.image),
    )
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => ({
      id: `${collection.id}-${entry.slot}-${entry.number}`,
      slot: entry.slot,
      number: entry.number,
      label: `${collection.name} · №${entry.number}`,
      image: entry.image,
    }));
}
