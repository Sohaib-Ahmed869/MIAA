# Editable Site Content (Content CMS)

Lets staff edit the **text** on public pages from the admin panel, with a live
preview — the design is untouched, only copy becomes dynamic.

## How it works

Default copy for every editable string lives in **`registry.js`** (in code, so
the site always renders even with an empty database — same philosophy as
`useCMS`). The database (`SiteContent` singleton) only stores the admin's
**overrides**. At runtime the public site merges: `override ?? default`.

```
registry.js ──▶ CONTENT_DEFAULTS ─┐
                                   ├─▶ ContentProvider ─▶ useText(key) / <Text k>
GET /api/site-content (overrides) ─┘
```

The admin editor (`admin/pages/ContentAdmin.jsx`) is generated entirely from the
registry and renders a live `?preview=1` iframe of the real page, pushing edits
over `postMessage` as you type.

## Making a new string editable — 3 steps

1. **Register it** in `registry.js` under the right page group / section:

   ```js
   { key: "about.hero.subtitle", label: "Subtitle", type: "text",
     default: "The exact text currently in the JSX" }
   ```
   Types: `text` (one line), `multiline` (newline → `<br>`),
   `richtext` (blank line → new `<p>`).

2. **Swap the literal** in the component:

   ```jsx
   import Text from "../../../content/Text"
   // …
   <h2><Text k="about.hero.subtitle" /></h2>
   ```

   For custom rendering (paragraph lists, `alt` text) use the hook instead:

   ```jsx
   import { useText } from "../../../content/ContentContext"
   import { splitParagraphs } from "../../../content/Text"
   const t = useText()
   splitParagraphs(t("about.director.body")).map(...)
   <img alt={t("about.hero.imageAlt")} />
   ```

3. Done. It appears in the admin editor automatically. **Copy the default text
   verbatim** from the current JSX so nothing changes until an editor edits it.

## Adding a whole new page

Add a group to `CONTENT_GROUPS` with `{ id, label, path, sections: [...] }`.
`path` is the public route the preview iframe loads.

## Notes

- An override equal to the default (or empty) is treated as "not overridden" and
  falls back to the default; the editor's **Reset** does exactly this.
- Backend routes: `GET /api/site-content` (public), `PATCH` + `DELETE /:key`
  (admin only). See `miaa-backend/src/routes/siteContent.js`.
