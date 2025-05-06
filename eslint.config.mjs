import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"),
      "simple-import-sort": require("eslint-plugin-simple-import-sort"),
    },
    rules: {
      // Simple Import Sort with custom groups
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@?\\w"], // React and external packages
            ["^@/"], // Internal aliases
            ["^\\.\\./.*", "^\\./?$", "^\\./?.*"], // Relative imports
            ["^.+\\.?(css|scss|sass)$"], // Styles
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // Prettier
      "prettier/prettier": "error",
    },
  },
];

export default eslintConfig;
