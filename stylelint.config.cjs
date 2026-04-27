/** @type {import('stylelint').Config} */
module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": null,
    "length-zero-no-unit": null,
  },
  overrides: [
    {
      files: ["**/*.module.css"],
      rules: {
        "selector-class-pattern": null,
        "length-zero-no-unit": null,
      },
    },
  ],
};

