import { createContext, useContext } from "react"
import { CONTENT_DEFAULTS } from "./registry"

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
