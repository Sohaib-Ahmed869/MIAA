/**
 * Artwork captions are written the way a gallery supplies them, with the year
 * leading: "(2008), Borderlands series surfboard: digital decal fibreglass…".
 *
 * On the site the credit reads artist → title → year, so the leading year is
 * split off here and re-attached to the end of the credit line. Anything that
 * doesn't start with a parenthesised date is passed through untouched — the
 * caption still renders, it just carries no separate date.
 */
const LEADING_DATE = /^\s*\(([^)]*)\)\s*[.,]?\s*/

export function splitCaptionDate(caption = "") {
  const match = String(caption).match(LEADING_DATE)
  if (!match) return { date: "", caption: String(caption).trim() }
  return {
    date: match[1].trim(),
    caption: String(caption).slice(match[0].length).trim(),
  }
}

/** "Phillip George ~ Inshalla (2008)" — artist, title, then the year. */
export function creditLine(artist, title, date) {
  const name = [artist, title].filter(Boolean).join(" ~ ")
  return date ? `${name} (${date})` : name
}
