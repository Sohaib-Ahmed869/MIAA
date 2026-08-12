# Editable Site Content (Content CMS)

Lets staff edit the **text, images and video** on public pages from the admin
panel, with a live preview — the design is untouched, only content becomes
dynamic.

## How it works

Defaults for every editable value live in code — copy in **`registry.js`**,
media in **`mediaRegistry.js`** (whose defaults are the bundled assets, imported
so Vite fingerprints them as usual). The site therefore always renders even with
an empty database and an unreachable S3 — same philosophy as `useCMS`. The
database (`SiteContent` singleton) only stores the admin's **overrides**. At
runtime the public site merges: `override ?? default`.

```
registry.js  ─────▶ CONTENT_DEFAULTS ─┐
mediaRegistry.js ──▶ (merged in)      ├─▶ ContentProvider ─▶ useText / useMedia
GET /api/site-content (overrides) ────┘
```

Media rides the *same* override map: an image's value is just a URL string, so
it shares the preview channel, dirty tracking, publish flow and audit log with
the copy. A media override is the permanent public URL of a file uploaded to the
public S3 bucket (`site-media/<page>/…`); clearing it falls back to the bundled
asset.

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

## Making a new image or video editable — 3 steps

1. **Register it** in `mediaRegistry.js`, under the `groupId`/`sectionId` of the
   section it belongs to (the entry is merged into that section automatically):

   ```js
   import heroImg from "../assets/images/About/about-hero.png"
   // …
   { groupId: "about", sectionId: "hero", fields: [
     { key: "about.hero.image", label: "Hero image", type: "image",
       default: heroImg, alt: "Audience at MIAA event" },
   ]}
   ```

   Types: `image` (uploadable still), `video` (uploadable file),
   `embed` (YouTube/Vimeo URL — no upload). `alt` declares a companion text key
   `<key>.alt` edited inside the same card.

2. **Swap the literal** in the component — drop the asset import and read the
   key instead:

   ```jsx
   import { useMedia } from "../../../content/context"
   const image = useMedia("about.hero.image")
   <img src={image.src} alt={image.alt} />
   ```

   For images that sit in a module-level array next to layout data (positions,
   captions, aspect ratios) use `useMediaResolver()`, which returns a
   `(key) => src` function. For `embed` fields use `useEmbed(key)` — it
   normalises a pasted watch/share link into the player's embed form.

3. Done. It appears in the editor automatically, with upload, live preview and
   reset-to-original.

## Adding a whole new page

Add a group to `TEXT_GROUPS` in `registry.js` with
`{ id, label, path, sections: [...] }`, or give a `mediaRegistry.js` entry a
`groupLabel` + `groupPath` and it will be created. `path` is the public route
the preview iframe loads.

## Notes

- An override equal to the default (or empty) is treated as "not overridden" and
  falls back to the default; the editor's **Reset** does exactly this. For media
  that means the bundled asset comes back, so later design updates flow through.
- Decorative artwork (background patterns, floating ornaments, icon glyphs) is
  deliberately left static — see the header comment in `mediaRegistry.js` for
  the full list and reasoning.
- Backend routes: `GET /api/site-content` (public), `PATCH` + `DELETE /:key`
  (admin only). See `miaa-backend/src/routes/siteContent.js`. Media uploads go
  through `POST /api/uploads/media/presign` and `DELETE /api/uploads/media`.
