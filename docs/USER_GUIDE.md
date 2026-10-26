# User guide

Open the comparison workspace, paste or upload a baseline OpenAPI document and a candidate document, then run the comparison. Sample contracts can populate both editors. Use severity and category controls to focus the report, and export JSON or Markdown for review.

Use the language selector in the header to switch between Brazilian Portuguese (`pt-BR`), English (`en-US`), and Spanish (`es-ES`). The preference is stored in the browser and reused on the next visit.

Only JSON and YAML OpenAPI 3.x contracts are accepted. Each contract is limited to 2 MiB. Replace external `$ref` values with local component references before comparing. Inputs are processed in memory and are not saved.

For CI, build the shaded CLI jar and run `oasfuse compare` with `--fail-on breaking`. Use `--format markdown --output report.md` to retain a review artifact.
