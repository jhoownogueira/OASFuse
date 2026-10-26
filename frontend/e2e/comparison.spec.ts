import { expect, test } from "@playwright/test";

test("compares the bundled contracts through the real API", async ({
  page,
}) => {
  await page.goto("/compare");
  await page.getByRole("button", { name: "Load example" }).click();
  const comparisonResponse = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/v1/comparisons") &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Compare Specifications" }).click();
  const response = await comparisonResponse;
  expect(response.status(), await response.text()).toBe(200);

  await expect(page.getByText("Comparison results")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Response type changed")).toBeVisible();
  await expect(page.getByText("Response property removed")).toBeVisible();
});
