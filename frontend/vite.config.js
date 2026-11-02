import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @shared points at the project level shared package (sibling of frontend and /app).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5182,
    // allow importing files from the shared folder outside the project root
    fs: { allow: [".", fileURLToPath(new URL("../shared", import.meta.url))] },
    // Windows Docker bind mounts do not deliver file change events into the container,
    // so poll for changes to keep hot reload working.
    watch: { usePolling: true, interval: 300 },
  },
});
