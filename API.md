# Flip Communication Hub — Public Read API

Read-only JSON endpoints mirroring the content already published on the public site (Glossary, Guidelines, Mechanics, Tone). Use these instead of scraping page HTML — they're the canonical source for any external consumer (Figma plugins, linters, bots, docs).

All endpoints are versioned under `/api/v1/`. A future breaking change will ship as `/api/v2/...` rather than changing these paths.

**Base URL:** `https://<your-deployment-domain>/api/v1`

**Response shape:** every success response is `{ "data": ... }`. Every error response is `{ "error": "<code>" }` with a matching HTTP status — `404` for a missing/unpublished resource, `500` for an unexpected server error.

**Caching:** responses are sent with `Cache-Control: public, max-age=60, stale-while-revalidate=300` — safe to cache client-side for up to a minute.

**CORS:** `Access-Control-Allow-Origin: *` — this data is already public on the rendered site, so any origin (including a Figma plugin's UI context) can fetch it directly.

If a content section is toggled off in the dashboard, its endpoints return `404 { "error": "not_found" }`, the same as a human visitor seeing "Coming soon."

---

## `GET /api/v1/glossary`

All published glossary terms.

```json
{
  "data": [
    {
      "id": "…",
      "term": "Error state",
      "term_bahasa": "Status kesalahan",
      "definition": "…",
      "avoid": ["failure", "broke"],
      "category": "UI Patterns",
      "tags": ["forms", "validation"],
      "updated_at": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```

## `GET /api/v1/guidelines`

List of guidelines (title/slug only — fetch a slug's detail for full content).

```json
{ "data": [{ "id": "…", "title": "…", "slug": "…", "order_index": 0 }] }
```

## `GET /api/v1/guidelines/[slug]`

A single guideline's full content (markdown body in `content`).

```json
{
  "data": {
    "id": "…", "title": "…", "slug": "…",
    "content": "## Markdown body…",
    "order_index": 0,
    "updated_at": "2026-08-01T12:00:00.000Z"
  }
}
```

## `GET /api/v1/mechanics`

All mechanics rules (punctuation, capitalization, numbering/date, text formatting).

```json
{
  "data": [
    {
      "id": "…", "rule": "Exclamation Mark (!)", "category": "Punctuation",
      "example": "…", "dont_example": "…", "description": "…",
      "order_index": 0,
      "data": { "kind": "repeater", "rules": [ { "ruleText": "…", "doExamples": [], "dontExamples": [] } ] },
      "updated_at": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```

`data` is `null` for legacy rows, or one of two shapes: `{ kind: "capitalization", textComponents: string[], uiComponents: string[] }` or `{ kind: "repeater", rules: RuleEntry[] }` (`RuleEntry = { ruleText, doExamples, dontExamples }`, each example item is `{ type: "text", content }` or `{ type: "image", url }`).

## `GET /api/v1/tone`

List of products with tone-of-voice content (name/slug only — fetch a slug's detail for the full breakdown).

```json
{ "data": [{ "id": "…", "name": "Flip Core", "slug": "flip-core", "order_index": 0 }] }
```

## `GET /api/v1/tone/[slug]`

A product's full tone-of-voice detail: the product, its brand constants, and its tone pillars.

```json
{
  "data": {
    "product": { "id": "…", "name": "Flip Core", "slug": "flip-core", "description": "…", "features": [], "order_index": 0, "updated_at": "…" },
    "brandConstants": [{ "id": "…", "constant": "Fair", "heading": "…", "description": "…", "order_index": 0 }],
    "tonePillars": [{ "id": "…", "title": "…", "description": "…", "do_example": "…", "dont_example": "…", "order_index": 0 }]
  }
}
```
