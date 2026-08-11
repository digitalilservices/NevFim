import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const FABRIC_FOLDERS = [
  "navi",
  "ice-cream-nev",
  "a-869-flora",
  "ottimo",
  "bibtex-beta",
  "marko",
  "oliver",
  "komo",
  "lori",
  "lutos",
  "diamant",
] as const;

type ManifestSwatch = {
  slot: number;
  number: number;
  file: string;
  image: string;
};

type FabricManifest = Record<string, ManifestSwatch[]>;

function buildFabricManifest() {
  const root = process.cwd();
  const fabricsRoot = path.join(root, "public", "images", "fabrics");
  const manifestPath = path.join(fabricsRoot, "manifest.json");
  const manifest: FabricManifest = {};

  fs.mkdirSync(fabricsRoot, { recursive: true });

  let total = 0;

  for (const folder of FABRIC_FOLDERS) {
    const collectionDir = path.join(fabricsRoot, folder);
    const bySlot = new Map<number, ManifestSwatch>();

    if (fs.existsSync(collectionDir)) {
      const files = fs
        .readdirSync(collectionDir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      for (const file of files) {
        // 1-12.jpg => slot 1, visible fabric/color number 12.
        // First number must be 1..20. Second number may be any positive integer.
        const match = file.match(/^(\d+)-(\d+)\.(jpe?g|png|webp)$/i);
        if (!match) continue;

        const slot = Number(match[1]);
        const number = Number(match[2]);

        if (!Number.isInteger(slot) || slot < 1 || slot > 20) continue;
        if (!Number.isInteger(number) || number < 1) continue;
        if (bySlot.has(slot)) continue;

        bySlot.set(slot, {
          slot,
          number,
          file,
          image: `/images/fabrics/${folder}/${encodeURIComponent(file)}`,
        });
      }

      // Backward compatibility while you are renaming older samples.
      // Example: 3.jpg is treated as slot 3 / visible number 3, but only
      // when slot 3 is not already occupied by a new 3-XX.jpg file.
      for (const file of files) {
        const match = file.match(/^(\d+)\.(jpe?g|png|webp)$/i);
        if (!match) continue;

        const number = Number(match[1]);
        const slot = number;

        if (!Number.isInteger(slot) || slot < 1 || slot > 20) continue;
        if (bySlot.has(slot)) continue;

        bySlot.set(slot, {
          slot,
          number,
          file,
          image: `/images/fabrics/${folder}/${encodeURIComponent(file)}`,
        });
      }
    }

    const swatches = Array.from(bySlot.values()).sort((a, b) => a.slot - b.slot);
    manifest[folder] = swatches;
    total += swatches.length;
  }

  const tempPath = `${manifestPath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.renameSync(tempPath, manifestPath);

  console.log(`[NevFim fabrics] manifest generated: ${total} samples -> ${manifestPath}`);
}

buildFabricManifest();

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default nextConfig;
