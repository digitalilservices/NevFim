export type FabricCollection = {
  id: string;
  name: string;
  folder: string;
};

export type FabricSwatch = {
  id: string;
  number: number;
  label: string;
  image: string;
};

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

export function getFabricSwatches(collection: FabricCollection): FabricSwatch[] {
  return Array.from({ length: 9 }, (_, index) => {
    const number = index + 1;
    const fileNumber = String(number).padStart(2, "0");

    return {
      id: `${collection.id}-${fileNumber}`,
      number,
      label: `${collection.name} · №${number}`,
      image: `/images/fabrics/${collection.folder}/${fileNumber}.jpg`,
    };
  });
}

export function getFabricImageCandidates(
  collection: FabricCollection,
  number: number,
): string[] {
  const padded = String(number).padStart(2, "0");
  const plain = String(number);
  const bases = padded === plain ? [padded] : [padded, plain];
  const extensions = ["jpg", "png", "jpeg", "webp"];

  return extensions.flatMap((extension) =>
    bases.map(
      (base) => `/images/fabrics/${collection.folder}/${base}.${extension}`,
    ),
  );
}
