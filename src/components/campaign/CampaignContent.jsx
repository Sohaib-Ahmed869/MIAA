import { motion } from "framer-motion"

// Renders campaign content blocks on the public campaign page.
export default function CampaignContent({ blocks = [] }) {
  const valid = (Array.isArray(blocks) ? blocks : []).filter((b) => b && b.type)
  if (!valid.length) return null

  return (
    <div className="space-y-6">
      {valid.map((b, i) => {
        const reveal = {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        }

        if (b.type === "heading") {
          const cls = `font-medium text-primary tracking-tight pt-2 ${
            b.level === 3 ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
          }`
          return b.level === 3 ? (
            <motion.h3 key={i} {...reveal} className={cls}>
              {b.text}
            </motion.h3>
          ) : (
            <motion.h2 key={i} {...reveal} className={cls}>
              {b.text}
            </motion.h2>
          )
        }

        if (b.type === "paragraph") {
          return (
            <motion.p
              key={i}
              {...reveal}
              className="text-[0.9375rem] md:text-base text-primary/75 leading-relaxed whitespace-pre-line"
            >
              {b.text}
            </motion.p>
          )
        }

        if (b.type === "quote") {
          return (
            <motion.blockquote
              key={i}
              {...reveal}
              className="border-l-4 border-secondary-terra pl-5 py-1 my-2"
            >
              <p className="text-lg md:text-xl text-primary/80 italic leading-relaxed">
                “{b.text}”
              </p>
              {b.cite && (
                <cite className="block mt-2 text-[0.8125rem] text-primary/50 not-italic">
                  — {b.cite}
                </cite>
              )}
            </motion.blockquote>
          )
        }

        if (b.type === "image") {
          return b.imageUrl ? (
            <motion.figure key={i} {...reveal} className="my-2">
              <img
                src={b.imageUrl}
                alt={b.caption || ""}
                className="w-full rounded-lg border border-primary/10"
              />
              {b.caption && (
                <figcaption className="text-[0.8125rem] text-primary/50 mt-2 text-center">
                  {b.caption}
                </figcaption>
              )}
            </motion.figure>
          ) : null
        }

        return null
      })}
    </div>
  )
}
