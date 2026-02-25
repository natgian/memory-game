import { defineConfig } from "vite";

export default defineConfig({
  base: "/memory-game/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        settings: "settings.html",
      },
    },
  },
});
