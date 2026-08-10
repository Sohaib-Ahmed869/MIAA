import { Fragment } from "react"

/** Split a rich-text value into paragraphs (blank line = new paragraph). */
export function splitParagraphs(str) {
  return String(str || "")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Render a string with single newlines turned into <br> line breaks. */
export function withLineBreaks(str) {
  const parts = String(str || "").split("\n")
  return parts.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < parts.length - 1 && <br />}
    </Fragment>
  ))
}
