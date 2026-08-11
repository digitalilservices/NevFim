import OpenAI, { toFile } from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY не знайдений у .env.local" },
        { status: 500 },
      );
    }

    const formData = await request.formData();

    const roomImage = formData.get("roomImage");
    const furnitureImage = formData.get("furnitureImage");
    const fabricImage = formData.get("fabricImage");

    const userPrompt = String(formData.get("prompt") ?? "");
    const category = String(formData.get("category") ?? "");
    const modelName = String(formData.get("modelName") ?? "");
    const width = String(formData.get("width") ?? "");
    const height = String(formData.get("height") ?? "");
    const depth = String(formData.get("depth") ?? "");
    const material = String(formData.get("material") ?? "");
    const color = String(formData.get("color") ?? "");
    const fabric = String(formData.get("fabric") ?? "");

    if (!(roomImage instanceof File)) {
      return NextResponse.json(
        { error: "Не передано фотографію кімнати." },
        { status: 400 },
      );
    }

    if (!(furnitureImage instanceof File)) {
      return NextResponse.json(
        { error: "Не передано фотографію меблів." },
        { status: 400 },
      );
    }

    const roomBuffer = Buffer.from(
      await roomImage.arrayBuffer(),
    );

    const furnitureBuffer = Buffer.from(
      await furnitureImage.arrayBuffer(),
    );

    const roomFile = await toFile(
      roomBuffer,
      roomImage.name || "room.png",
      {
        type: roomImage.type || "image/png",
      },
    );

    const furnitureFile = await toFile(
      furnitureBuffer,
      furnitureImage.name || "furniture.png",
      {
        type: furnitureImage.type || "image/png",
      },
    );

    const fabricFile =
      fabricImage instanceof File
        ? await toFile(
            Buffer.from(await fabricImage.arrayBuffer()),
            fabricImage.name || "fabric-swatch.jpg",
            {
              type: fabricImage.type || "image/jpeg",
            },
          )
        : null;

    const referenceImages = fabricFile
      ? [roomFile, furnitureFile, fabricFile]
      : [roomFile, furnitureFile];

    const technicalPrompt = `
The first reference image is the customer's real room.
The second reference image is the exact furniture model that must be integrated into that room.
${fabricFile ? "The third reference image is the EXACT upholstery/fabric swatch selected by the customer. Treat its visible color, texture, weave, pile and pattern as the authoritative upholstery reference." : ""}

Create a photorealistic, professionally staged interior visualization.

Furniture category: ${category || "not specified"}
Furniture model: ${modelName || "not specified"}

Requested dimensions:
- Width: ${width || "standard"} mm
- Height: ${height || "standard"} mm
- Depth: ${depth || "standard"} mm

${(material && material.trim()) || (color && color.trim()) || (fabric && fabric.trim()) ? `
==== CRITICAL APPEARANCE OVERRIDES — HIGHEST PRIORITY ====
These settings MUST be applied. They override the reference furniture image appearance.
${material && material.trim() ? `• MATERIAL: The furniture body MUST be rendered in "${material}" material. Do NOT preserve the original material from the reference image.` : ""}
${color && color.trim() ? `• COLOR: The furniture color MUST be changed to "${color}". ABSOLUTELY DO NOT use the original color from the reference furniture image. If upholstery fabric is selected, this COLOR rule applies to non-upholstered/hard parts only; the fabric swatch has higher priority for all upholstered parts.` : ""}
${fabric && fabric.trim() ? `• UPHOLSTERY/FABRIC: The soft parts (seat, back, cushions, armrests) MUST use "${fabric}" fabric. Apply ONLY to fabric/upholstery parts. Do NOT apply to wooden legs, metal frames, or hard structural parts.${fabricFile ? " The THIRD reference image is authoritative and has higher priority than the generic COLOR setting for every upholstered surface. Match it as closely as possible: reproduce its actual visible color, texture, weave/pile and pattern instead of inventing a generic fabric." : ""}` : ""}
==========================================================
` : `
Material: use the reference furniture material
Color: preserve the reference furniture color
`}

Customer placement/request notes:
${userPrompt || "Choose the most natural available location in the room."}

SPATIAL PLACEMENT RULES — VERY IMPORTANT:
- First analyze the room before placing anything.
- Detect and respect all existing large objects and occupied zones: beds, sofas, tables, chairs, cabinets, wardrobes, nightstands, radiators, windows, doors and architectural elements.
- DO NOT place the new furniture on top of, inside, or intersecting any existing furniture.
- DO NOT cover or block beds, sofas, tables, doors, windows, radiators, door swings, walkways or circulation paths.
- Find a realistic free wall, empty corner, or open floor zone that can physically fit the requested furniture.
- If the room is crowded, choose the safest logical free location instead of overlapping existing objects.
- Keep realistic clearance around the furniture so a person can move around it.
- Respect the customer's prompt when physically possible. If the requested position would overlap an existing object or block access, move the furniture to the nearest sensible free position while preserving the intent.
- Place wardrobes, cabinets, dressers and similar storage furniture flush and parallel to an appropriate wall whenever possible.
- Place tables and chairs in usable open areas with natural spacing.
- Place beds and sofas only in zones where they fit without overlapping the existing furniture.

VISUAL CONSISTENCY RULES:
- Preserve the original room architecture and overall layout.
- Preserve walls, windows, doors, floor, ceiling and camera angle.
- Preserve existing furniture unless the customer explicitly asks to replace or remove something.
- The new furniture must stand naturally on the floor, with correct contact shadows.
- Match the room's perspective, scale, focal length, lighting direction, color temperature and shadows.
- Use the second reference image as the primary design reference for the selected furniture shape and model.
- Preserve the selected furniture's recognizable shape and design.
- Apply the CRITICAL APPEARANCE OVERRIDES above to the shape from the reference image.
- Do not duplicate the selected furniture.
- Do not add unrelated furniture, decor, text, labels, dimensions or watermarks.
- The final result should look like a realistic interior designer visualization, not a collage.
`;

    const result = await openai.images.edit({
      model: "gpt-image-2",
      image: referenceImages,
      prompt: technicalPrompt,
      size: "1536x1024",
      quality: "medium",
      output_format: "png",
    });

    const base64Image = result.data?.[0]?.b64_json;

    if (!base64Image) {
      return NextResponse.json(
        { error: "OpenAI не повернув готове зображення." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (error) {
    console.error("OpenAI image generation error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Невідома помилка генерації.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}