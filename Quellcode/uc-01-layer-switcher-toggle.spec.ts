import { test, expect } from "@playwright/test";

test("UC-1: show and hide the layer switcher via the toolbar button", async ({ page }) => {
    await page.goto("http://localhost:5173/ba-webgis-llm-e2e/");

    const map = page.getByTestId("map-container");
    const layerSwitcher = page.getByTestId("layer-switcher");
    const layerSwitcherToggle = page.getByTestId("layer-switcher-toggle");

    // Vorbedingung: App geladen, Karte gerendert, TOC sichtbar.
    await expect(map).toBeVisible();
    await page.waitForFunction(
        () => (globalThis as { __openPioneerMap?: unknown }).__openPioneerMap != null
    );
    await expect(layerSwitcher).toBeVisible();

    // Schritt 1: TOC ausblenden.
    await layerSwitcherToggle.click();
    await expect(layerSwitcher).toBeHidden();

    // Schritt 2: TOC wieder einblenden.
    await layerSwitcherToggle.click();
    await expect(layerSwitcher).toBeVisible();
});
