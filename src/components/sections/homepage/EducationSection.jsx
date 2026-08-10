import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import educatingImg from "../../../assets/images/Homepage/educatingnextgen.png"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

export default function EducationSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const t = useText()
  const accordionItems = [
    { title: t("home.education.item1.title"), content: t("home.education.item1.body") },
    { title: t("home.education.item2.title"), content: t("home.education.item2.body") },
  ]

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-10 lg:gap-12 items-center">
          {/* Left - Image */}
          <motion.div {...fadeInLeft} className="rounded-xl overflow-hidden">
            <img
              src={educatingImg}
              alt="Man viewing art gallery"
              className="w-full h-[300px] md:h-[26.25rem] 3xl:h-[35vh] object-cover"
            />
          </motion.div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-3/4 bg-primary/20 self-center" />

          {/* Right - Content with accordion */}
          <motion.div {...fadeInRight}>
            <h2 className="text-3xl md:text-4xl 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-snug">
              <Text k="home.education.heading" />
            </h2>

            {/* Accordion */}
            <div className="mt-8 flex flex-col">
              {accordionItems.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-primary/10"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    className="w-full flex items-center gap-3 py-5 text-left group"
                  >
                    <span className="w-6 h-6 rounded-full border border-primary flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors">
                      {openIndex === i ? (
                        <Minus className="w-3 h-3 text-primary" />
                      ) : (
                        <Plus className="w-3 h-3 text-primary" />
                      )}
                    </span>
                    <span
                      className={`text-base 3xl:text-xl font-medium transition-colors ${
                        openIndex === i
                          ? "text-primary"
                          : "text-primary/60"
                      }`}
                    >
                      {item.title}
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
                        <p className="pl-9 pb-5 text-sm 3xl:text-lg text-primary leading-relaxed">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
