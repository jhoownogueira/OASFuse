import { expect, test } from "@playwright/test";

test("compares the bundled contracts through the real API", async ({
  page,
}) => {
  await page.goto("/compare");
  await page.getByRole("button", { name: "Load example" }).click();
  await page.getByRole("button", { name: "Compare Specifications" }).click();

  await expect(page.getByText("Comparison results")).toBeVisible();
  await expect(page.getByText("Response type changed")).toBeVisible();
  await expect(page.getByText("Response property removed")).toBeVisible();
});
