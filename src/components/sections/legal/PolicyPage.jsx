import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import { splitParagraphs, withLineBreaks } from "../../../content/format"

/**
 * Shared renderer for the site's legal pages (Privacy Policy, Volunteer Policy).
 *
 * Both pages are the same shape — a dark title band, a sticky contents rail and
 * a run of numbered clauses — and both are edited entirely from Site Content, so
 * the clause list is passed in as registry keys rather than as copy. Adding a
 * clause is a registry entry plus one line in the caller's `sections` array.
 */

/**
 * One clause body, from a `richtext` value.
 *
 * Paragraphs split on a blank line, as everywhere else on the site. A paragraph
 * whose every line starts with "- " becomes a bullet list instead, which is the
 * only extra structure a policy needs and the only one an editor can type into a
 * plain textarea without being taught a syntax.
 */
function PolicyBody({ value }) {
  return splitParagraphs(value).map((block, i) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "))

    if (isList) {
      return (
        <ul key={i} className="mt-4 flex flex-col gap-2.5 list-none">
          {lines.map((line, j) => (
            <li key={j} className="flex gap-3 text-sm md:text-base 3xl:text-lg text-primary/85 leading-relaxed">
              <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full bg-secondary-terra flex-shrink-0" />
              <span>{line.slice(2)}</span>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <p
        key={i}
        className="mt-4 first:mt-0 text-sm md:text-base 3xl:text-lg text-primary/85 leading-relaxed"
      >
        {withLineBreaks(block)}
      </p>
    )
  })
}

export default function PolicyPage({
  eyebrowKey,
  titleKey,
  updatedKey,
  introKey,
  contentsLabelKey,
  sections,
}) {
  const t = useText()

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      {/* Title band */}
      <section className="relative bg-bg-deep">
        <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-14 md:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[0.6875rem] md:text-xs 3xl:text-sm tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3"
          >
            <Text k={eyebrowKey} />
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight max-w-3xl 3xl:max-w-5xl"
          >
            <Text k={titleKey} />
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mt-5 text-base md:text-lg 3xl:text-xl text-accent-cream/75 leading-relaxed max-w-2xl 3xl:max-w-4xl">
              <Text k={introKey} />
            </p>
            <p className="mt-6 text-[0.6875rem] md:text-xs 3xl:text-sm tracking-[0.18em] uppercase text-accent-cream/45 font-semibold">
              <Text k={updatedKey} />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Clauses */}
      <section className="bg-bg py-14 md:py-20 3xl:py-28">
        <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,17rem)_1fr] gap-10 lg:gap-16 3xl:gap-24">
            {/* Contents rail */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[0.6875rem] 3xl:text-xs tracking-[0.2em] uppercase text-primary/45 font-semibold mb-4">
                  <Text k={contentsLabelKey} />
                </p>
                <ol className="flex flex-col gap-2.5 border-l border-primary/15 pl-4">
                  {sections.map((section, i) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={scrollTo(section.id)}
                        className="flex gap-2 text-sm 3xl:text-base text-primary/65 hover:text-secondary-terra transition-colors leading-snug"
                      >
                        <span className="tabular-nums text-primary/35">{i + 1}.</span>
                        <span>{t(section.heading)}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Body */}
            <div className="flex flex-col">
              {sections.map((section, i) => (
                <motion.article
                  key={section.id}
                  {...fadeInUp}
                  id={section.id}
                  className="scroll-mt-28 py-8 first:pt-0 border-b border-primary/10 last:border-b-0"
                >
                  <h2 className="flex gap-3 text-lg md:text-xl lg:text-2xl 3xl:text-[2rem] font-medium text-primary tracking-tight leading-snug mb-4">
                    <span className="tabular-nums text-secondary-terra">{i + 1}.</span>
                    <span>{t(section.heading)}</span>
                  </h2>
                  <div className="max-w-3xl 3xl:max-w-5xl">
                    <PolicyBody value={t(section.body)} />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
