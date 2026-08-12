import { motion } from "framer-motion"
import { useMedia } from "../../../content/context"


export default function StageBannerSection() {
  const image = useMedia("gala.hero.image")
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="w-full bg-bg-deep"
    >
      <div className="w-full h-[260px] md:h-[23.75rem] lg:h-[27.5rem] 3xl:h-[33vh] overflow-hidden">
        <img
          src={image.src}
          alt="Inaugural Gala Dinner — stage performance"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </motion.div>
  )
}
