import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standard TanStack Start setup; this app no longer needs Lovable to build.
export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart({ server: { entry: "server" } }), nitro(), react()],
});
