import { createFileRoute } from "@tanstack/react-router";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const Route = createFileRoute("/api/generate-spritemal")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.OPENAI_API_KEY;
        const demoCode = process.env.SPRITEMALS_DEMO_CODE;
        if (!apiKey) {
          return Response.json({ error: "AI generation is not configured yet." }, { status: 503 });
        }
        if (!demoCode || request.headers.get("x-spritemals-demo-code") !== demoCode) {
          return Response.json(
            { error: "Enter the private demo code to open the creation portal." },
            { status: 401 },
          );
        }

        const incoming = await request.formData();
        const image = incoming.get("image");
        if (!(image instanceof File)) {
          return Response.json({ error: "Choose a pet photo first." }, { status: 400 });
        }
        if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
          return Response.json({ error: "Use a JPEG, PNG, or WebP pet photo." }, { status: 415 });
        }
        if (image.size > MAX_IMAGE_BYTES) {
          return Response.json(
            { error: "That photo is too large. Use an image under 10 MB." },
            { status: 413 },
          );
        }

        const form = new FormData();
        form.set("model", "gpt-image-2.5-flare");
        form.set("image", image, image.name || "pet-photo.jpg");
        form.set("size", "1024x1024");
        form.set("quality", "medium");
        form.set("output_format", "webp");
        form.set(
          "prompt",
          [
            "Transform the pet in the reference photo into an original SPRITEMALS companion character.",
            "Faithfully preserve the pet's species, face shape, coat colors, markings, eye color, and recognizable personality.",
            "Create a polished premium 3D game-character portrait with a cute digital-plush feel, subtle magical cyan and violet energy, and a full-body centered pose.",
            "Use a clean dark cosmic background with a soft glowing portal beneath the pet.",
            "Do not add words, logos, crowns, humans, extra animals, collars, or merchandise.",
          ].join(" "),
        );

        const response = await fetch("https://api.openai.com/v1/images/edits", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: form,
        });
        const payload = (await response.json()) as {
          data?: Array<{ b64_json?: string }>;
          error?: { message?: string };
        };

        if (!response.ok) {
          console.error("OpenAI image generation failed", response.status, payload.error?.message);
          return Response.json(
            { error: "The creation portal could not transform this photo. Please try again." },
            { status: response.status === 429 ? 429 : 502 },
          );
        }

        const base64 = payload.data?.[0]?.b64_json;
        if (!base64) {
          return Response.json(
            { error: "The AI returned no image. Please try again." },
            { status: 502 },
          );
        }
        return Response.json({ image: `data:image/webp;base64,${base64}` });
      },
    },
  },
});
