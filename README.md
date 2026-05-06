# Bluedenta Map

An interactive clinic finder built for [Bluedenta](https://map.bluedenta.de/), a dental supply platform. Users can search for dental practices across Germany and locate them on an interactive map. Built independently as part of my work at Cubular.

## Components

### `MapPage.tsx`
The core map component, built with `react-map-gl` and Mapbox GL JS. Key features:
- Smooth `flyTo` animation when a location is selected from the list, using a `useRef` reference to the Mapbox instance
- Viewport-aware marker filtering: only renders markers visible within the current map bounds, calculated via a degrees-per-pixel formula based on the current zoom level
- Markers are suppressed entirely below zoom level 8 to avoid visual clutter at country/continent scale

### `MapItem.tsx`
Individual map marker component. Renders a custom SVG marker with a `Popup` overlay showing the practice name and address. Popup visibility is controlled both by direct user click and by external selection state passed via props.

### `LocationSearchPage.tsx`
The parent page that orchestrates the full search-and-map experience:
- Text search filtering across name, street, postal code, and city fields
- Client-side pagination (5 results per page)
- Selected location state shared between the list and the map
- Clicking a selected item again deselects it and closes the popup

### `PracticeListItem.tsx`
A typed MUI list item representing a single practice. Uses the shared `locationProps` interface for consistent typing across all components.

## Tech Stack

- **React** + **TypeScript**
- **react-map-gl** – React wrapper for Mapbox GL JS
- **Mapbox GL JS** – map rendering and interaction
- **MUI (Material UI)** – list, pagination, and layout components

## Notes

This is an excerpt from a larger application. Some imports (internal API client, internal UI components) have been replaced with placeholders for clarity. The `VITE_BLUEDENTA_MAPBOX_TOKEN` environment variable is required to run the map.
