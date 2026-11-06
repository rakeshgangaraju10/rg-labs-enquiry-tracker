import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build the app as plain HTML/CSS/JS files (in the `out` folder),
  // so it can be hosted on Netlify for free with no server.
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
