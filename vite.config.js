import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "doble 5",
        short_name: "doble5",
        description: "Descripción de tu app PWA",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        lang: "es",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/logo-original.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo-original.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/logo-original.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
