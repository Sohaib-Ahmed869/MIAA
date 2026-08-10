import { useText } from "./context"
import { withLineBreaks } from "./format"

/**
 * Inline editable text. Renders the resolved value for `k`, turning newlines
 * into <br>. Drop-in for a hardcoded heading/paragraph:
 *
 *   <h1 className="…"><Text k="home.hero.title" /></h1>
 *
 * For paragraph lists or attribute text (alt, title) use `useText()` from
 * `./context` together with `splitParagraphs` from `./format`.
 */
export default function Text({ k }) {
  const t = useText()
  return <>{withLineBreaks(t(k))}</>
}
