// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "import/first": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
});
