import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import amber from "@park-ui/panda-preset/colors/amber";
import lime from "@park-ui/panda-preset/colors/lime";
import sand from "@park-ui/panda-preset/colors/sand";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "solid",
  presets: [
    createPreset({ accentColor: lime, grayColor: sand, radius: "2xl" }),
  ],
  theme: {
    extend: {
      tokens: {
        colors: {
          amber: amber.tokens,
        },
      },
    },
  },
  outdir: "styled-system",
});
