import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});



// 🔧 Ajout de la propriété `ignores`
const eslintConfig = [
  {
    ignores: ["app/generated/**"], // ← Ignore ce dossier (tu peux adapter le chemin)
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
