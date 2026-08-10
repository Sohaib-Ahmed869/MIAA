import { useEffect, useMemo, useState } from "react"
import { api } from "../lib/api"
import { CONTENT_DEFAULTS } from "./registry"
import { ContentContext } from "./context"

/**
 * Content provider for the public site.
 *
 * Resolves every content key to a string with this precedence:
 *   live preview override  →  saved backend override  →  baked-in default
 *
 * Live preview: when the page is loaded inside the admin editor's iframe
 * (`?preview=1`), it announces itself to the parent window and then applies any
 * overrides the parent posts as the editor is typed into — so the admin sees
 * the real page, in the real design, updating live before saving.
 *
 * Hooks (`useText`, `useContentMeta`) live in `./context`.
 */

const isMeaningful = (v) => typeof v === "string" && v.trim() !== ""

function detectPreview() {
  if (typeof window === "undefined") return false
  return new URLSearchParams(window.location.search).has("preview")
}

export function ContentProvider({ children }) {
  const [saved, setSaved] = useState({}) // overrides persisted in the backend
  const [preview, setPreview] = useState({}) // live, unsaved overrides from editor
  const [loading, setLoading] = useState(true)
  const isPreview = useMemo(() => detectPreview(), [])

  // Load saved overrides. Failure is non-fatal — defaults still render.
  useEffect(() => {
    let alive = true
    api
      .siteContent()
      .then((res) => {
        if (alive && res?.values) setSaved(res.values)
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  // Preview channel: receive live edits from the parent editor window.
  useEffect(() => {
    if (!isPreview) return
    const onMessage = (event) => {
      const data = event?.data
      if (!data || data.type !== "miaa:preview-content") return
      setPreview(data.values || {})
    }
    window.addEventListener("message", onMessage)
    // Tell the editor we're ready so it can push the current draft immediately.
    try {
      window.parent?.postMessage({ type: "miaa:preview-ready" }, "*")
    } catch {
      /* cross-origin parent — ignore */
    }
    return () => window.removeEventListener("message", onMessage)
  }, [isPreview])

  const value = useMemo(() => {
    const get = (key) => {
      if (isMeaningful(preview[key])) return preview[key]
      // In preview an explicitly-cleared field should show the default, not the
      // stale saved value — mirrors what saving would produce.
      if (isPreview && key in preview) return CONTENT_DEFAULTS[key] ?? ""
      if (isMeaningful(saved[key])) return saved[key]
      return CONTENT_DEFAULTS[key] ?? ""
    }
    return { get, loading, isPreview }
  }, [saved, preview, isPreview, loading])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
