import { test, expect } from "@playwright/test";
import { isLayerRendered } from "../../map-model-helpers";

const UVI_LAYER_TITLE = "UV-Index";

test("UC-4: activate the UV-Index overlay and verify it is rendered on the map", async ({ page }) => {
    await page.goto("http://localhost:5173/ba-webgis-llm-e2e/");

    const map = page.getByTestId("map-container");
    const layerSwitcher = page.getByTestId("layer-switcher");
    // The TOC renders each layer with a checkbox whose accessible name is the layer title. `exact` avoids also matching the "UV-Index Stations" layer.
    const uviToggle = layerSwitcher.getByRole("checkbox", { name: UVI_LAYER_TITLE, exact: true });
    const uviLabel = layerSwitcher.getByText(UVI_LAYER_TITLE, { exact: true });

    // Preconditions
    await expect(map).toBeVisible();
    await page.waitForFunction(
        () => (globalThis as { __openPioneerMap?: unknown }).__openPioneerMap != null
    );
    await expect(layerSwitcher).toBeVisible();
    await expect(uviToggle).not.toBeChecked();
    expect(await isLayerRendered(page, UVI_LAYER_TITLE)).toBe(false);

    // Steps
    await uviLabel.click();

    // Expected result
    await expect(uviToggle).toBeChecked();
    await expect.poll(() => isLayerRendered(page, UVI_LAYER_TITLE)).toBe(true);
});
