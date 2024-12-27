/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  arrowParens: "avoid",
  semi: false,
  tabWidth: 2,
  trailingComma: "none",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ]
}
