import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { I18nProvider } from "./provider";

it("switches locale and persists the selection", async () => {
  window.localStorage.clear();
  const user = userEvent.setup();
  render(
    <I18nProvider>
      <SiteHeader />
    </I18nProvider>,
  );

  await user.selectOptions(screen.getByLabelText("Language"), "pt-BR");

  expect(screen.getByText("Comparar")).toBeInTheDocument();
  expect(window.localStorage.getItem("oasfuse-locale")).toBe("pt-BR");
  expect(document.documentElement.lang).toBe("pt-BR");
});
