import { createContext, useContext, useMemo } from "react"
import { CONTENT_DEFAULTS, altKeyFor } from "./registry"

/**
 * Shared content context + hooks. Kept separate from the provider component so
 * the provider file only exports a component (React Fast Refresh requirement).
 */
export const ContentContext = createContext({
  get: (key) => CONTENT_DEFAULTS[key] ?? "",
  loading: false,
  isPreview: false,
})

/** Returns a resolver: `const t = useText(); t("about.hero.title")`. */
export function useText() {
  return useContext(ContentContext).get
}

export function useContentMeta() {
  const { loading, isPreview } = useContext(ContentContext)
  return { loading, isPreview }
}

/**
 * Resolves a media key to `{ src, alt }`.
 *
 * Media rides the same override → default machinery as copy: `src` is either
 * the URL of a file uploaded to the public S3 media bucket, or — when nothing
 * has been uploaded, the value is blank, or the upload later disappears — the
 * asset bundled with the build. That fallback is why the site keeps rendering
 * even if S3 is misconfigured or unreachable.
 *
 *   const hero = useMedia("about.hero.image")
 *   <img src={hero.src} alt={hero.alt} />
 */
export function useMedia(key) {
  const get = useText()
  return useMemo(() => {
    const value = (get(key) || "").trim()
    return {
      src: value || CONTENT_DEFAULTS[key] || "",
      alt: get(altKeyFor(key)) || "",
      isDefault: !value || value === CONTENT_DEFAULTS[key],
    }
  }, [get, key])
}

/**
 * Returns a `(key) => src` resolver, for sections whose images live in a
 * module-level array alongside layout data (positions, credits, captions):
 *
 *   const media = useMediaResolver()
 *   ART.map((piece) => <img src={media(piece.mediaKey)} alt={piece.credit} />)
 */
export function useMediaResolver() {
  const get = useText()
  return useMemo(
    () => (key) => (get(key) || "").trim() || CONTENT_DEFAULTS[key] || "",
    [get]
  )
}

/**
 * Normalises a pasted video link into something an <iframe> can load.
 * Editors paste whatever the browser address bar shows; players only accept
 * their embed form. Anything unrecognised is passed through untouched.
 */
export function toEmbedUrl(url) {
  const raw = (url || "").trim()
  if (!raw) return ""

  // youtube.com/watch?v=ID  ·  youtu.be/ID  ·  youtube.com/shorts/ID
  const yt =
    raw.match(/youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/) ||
    raw.match(/youtu\.be\/([\w-]+)/) ||
    raw.match(/youtube\.com\/shorts\/([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`

  // vimeo.com/ID (but not an existing player.vimeo.com/video/ID embed)
  const vimeo = raw.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  return raw
}

/** Resolves an "embed" media key straight to a normalised iframe src. */
export function useEmbed(key) {
  const get = useText()
  return useMemo(() => toEmbedUrl(get(key) || CONTENT_DEFAULTS[key] || ""), [get, key])
}
