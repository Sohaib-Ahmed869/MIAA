import { motion } from "framer-motion"
import heroImg from "../../../assets/images/Support/support-hero.jpg"
import supportElement from "../../../assets/images/Support/supportuselement.png"
import Text from "../../../content/Text"

export default function SupportHeroSection() {
  return (
    <section className="relative bg-bg-deep overflow-visible">
      {/* Three centered headings */}
      <div className="w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-8 md:pb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[0.6875rem] md:text-xs 3xl:text-sm tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3"
        >
          <Text k="support.hero.eyebrow" />
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight"
        >
          <Text k="support.hero.title" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg 3xl:text-xl text-accent-cream/75 mt-5 md:mt-6 max-w-2xl mx-auto font-medium"
        >
          <Text k="support.hero.subtitle" />
        </motion.p>
      </div>

      {/* Banner image with support element at bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="relative w-full"
      >
        <div className="w-full h-[55vh] md:h-[26.25rem] lg:h-[31.25rem] 3xl:h-[40vh] overflow-hidden">
          <img
            src={heroImg}
            alt="Speaker addressing the MIAA community"
            className="w-full object-cover object-center block"
            style={{ height: "100%" }}
          />
        </div>

        {/* Support element — bottom-right corner, half on image / half on next section */}
        <motion.img
          src={supportElement}
          alt=""
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-12 sm:-bottom-16 md:-bottom-[7.5rem] lg:-bottom-[10rem] right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-52 lg:h-52 3xl:w-64 3xl:h-64 object-contain z-10"
        />
      </motion.div>
    </section>
  )
}
