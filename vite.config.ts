import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/oma-fit-analysis-prototype/",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
