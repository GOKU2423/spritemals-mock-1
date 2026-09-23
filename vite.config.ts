import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standard TanStack Start setup with Netlify's first-party deployment plugin.
export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart({ server: { entry: "server" } }), netlify(), react()],
});
