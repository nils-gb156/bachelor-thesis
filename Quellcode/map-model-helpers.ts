// SPDX-FileCopyrightText: 2023-2025 Open Pioneer project (https://github.com/open-pioneer)
// SPDX-License-Identifier: Apache-2.0
import type { Page } from "@playwright/test";
import type { MapModel } from "@open-pioneer/map";

/** The type of the value exposed on `globalThis.__openPioneerMap` (see `MapComponent`). */
type ExposedMapModel = MapModel;

/** Returns the title of the currently active base layer. */
export function getActiveBaseLayerTitle(page: Page): Promise<string | undefined> {
    return page.evaluate(() => {
        const map = (globalThis as { __openPioneerMap?: ExposedMapModel }).__openPioneerMap;
        return map?.layers.getActiveBaseLayer()?.title;
    });
}

/** Returns `true` if the operational layer with the given `title` is currently rendered on the map. */
export function isLayerRendered(page: Page, title: string): Promise<boolean> {
    return page.evaluate((layerTitle) => {
        const map = (globalThis as { __openPioneerMap?: ExposedMapModel }).__openPioneerMap;
        const layer = map?.layers
            .getOperationalLayers()
            .find((entry) => entry.title === layerTitle);
        return layer?.visible === true;
    }, title);
}

/** Returns the current zoom level of the map. */
export function getMapZoomLevel(page: Page): Promise<number | undefined> {
    return page.evaluate(() => {
        const map = (globalThis as { __openPioneerMap?: ExposedMapModel }).__openPioneerMap;
        return map?.olMap.getView().getZoom();
    });
}

/** Returns the current center of the map in the map projection as [x, y]. */
export function getMapCenter(page: Page): Promise<[number, number] | undefined> {
    return page.evaluate(() => {
        const map = (globalThis as { __openPioneerMap?: ExposedMapModel }).__openPioneerMap;
        const center = map?.olMap.getView().getCenter();
        return center && center.length >= 2
            ? ([center[0], center[1]] as [number, number])
            : undefined;
    });
}

/** Returns the coordinate of the first active highlight on the map in the map projection as [x, y]. */
export function getHighlightedCoordinate(page: Page): Promise<[number, number] | undefined> {
    return page.evaluate(() => {
        const map = (globalThis as { __openPioneerMap?: ExposedMapModel }).__openPioneerMap;
        if (!map) return undefined;
        // The Highlights class registers a VectorLayer with className "highlight-layer"
        // on the underlying OL map. Iterate all OL layers to find it.
        const layers = map.olMap.getLayers().getArray();
        const highlightLayer = layers.find(
            (l) => (l as { getClassName?: () => string }).getClassName?.() === "highlight-layer"
        ) as
            | {
                  getSource?: () => {
                      getFeatures?: () => {
                          getGeometry?: () => { getCoordinates?: () => number[] };
                      }[];
                  };
              }
            | undefined;
        const features = highlightLayer?.getSource?.()?.getFeatures?.() ?? [];
        const coords = features[0]?.getGeometry?.()?.getCoordinates?.();
        return Array.isArray(coords) && coords.length >= 2
            ? ([coords[0], coords[1]] as [number, number])
            : undefined;
    });
}