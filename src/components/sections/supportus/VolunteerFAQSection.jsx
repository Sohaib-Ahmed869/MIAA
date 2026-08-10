import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

export default function VolunteerFAQSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const t = useText()
  const FAQS = [
    { q: t("support.faq.q1"), a: t("support.faq.a1") },
    { q: t("support.faq.q2"), a: t("support.faq.a2") },
    { q: t("support.faq.q3"), a: t("support.faq.a3") },
    { q: t("support.faq.q4"), a: t("support.faq.a4") },
    { q: t("support.faq.q5"), a: t("support.faq.a5") },
  ]

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-stretch">
          {/* Left — heading + minimum age badge */}
          <motion.div {...fadeInLeft} className="flex flex-col justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug max-w-md 3xl:max-w-xl">
              <Text k="support.faq.heading" />
            </h2>

            <div className="mt-10 inline-flex flex-col items-center justify-center w-40 h-28 3xl:w-48 3xl:h-32 bg-accent-cream rounded-2xl">
              <span className="text-3xl 3xl:text-4xl font-medium text-primary"><Text k="support.faq.ageNumber" /></span>
              <span className="text-sm 3xl:text-base font-medium text-primary mt-1"><Text k="support.faq.ageLabel" /></span>
            </div>
          </motion.div>

          {/* Right — FAQ accordion */}
          <motion.div {...fadeInRight} className="flex flex-col">
            {FAQS.map((item, i) => (
              <div key={i} className="border-b border-primary/15">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center gap-4 py-6 text-left group"
                >
                  <span className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-full border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                    {openIndex === i ? (
                      <Minus className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-primary" />
                    )}
                  </span>
                  <span
                    className={`text-base sm:text-lg md:text-xl 3xl:text-2xl font-medium transition-colors ${
                      openIndex === i ? "text-primary" : "text-primary/50"
                    }`}
                  >
                    {item.q}
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pl-12 pb-6 text-sm sm:text-base 3xl:text-lg text-primary leading-relaxed max-w-2xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
