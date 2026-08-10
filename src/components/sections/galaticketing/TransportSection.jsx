import { motion } from "framer-motion"
import { BusFront, TrainFront, CarFront } from "lucide-react"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"

export default function TransportSection() {
  const t = useText()
  const OPTIONS = [
    {
      Icon: BusFront,
      title: t("gala.transport.busTitle"),
      body: t("gala.transport.busBody"),
    },
    {
      Icon: TrainFront,
      title: t("gala.transport.trainTitle"),
      body: (
        <>
          St James and Martin Place stations are both about a 10-minute walk.
          For more information about public transport options, times or disruptions, contact the
          Transport Infoline on 131 500 or{" "}
          <a href="https://transportnsw.info" target="_blank" rel="noopener noreferrer" className="text-secondary-terra underline hover:text-secondary-rust transition-colors">
            transportnsw.info
          </a>
        </>
      ),
    },
    {
      Icon: CarFront,
      title: t("gala.transport.taxiTitle"),
      body: t("gala.transport.taxiBody"),
    },
  ]
  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.h2
          {...fadeInUp}
          className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] 3xl:text-[3.2rem] font-normal text-primary tracking-tight leading-snug mb-10 md:mb-14 uppercase"
        >
          <Text k="gala.transport.heading" />
        </motion.h2>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {OPTIONS.map(({ Icon, title, body }, i) => (
            <motion.div
              key={i}
              {...staggerItem}
              whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.25 }}
              className="bg-accent-cream rounded-2xl p-6 md:p-8 flex flex-col gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Icon strokeWidth={2.5} className="text-secondary-sand w-6 h-6" />
                <h3 className="text-lg md:text-xl 3xl:text-2xl font-semibold text-primary">{title}</h3>
              </div>
              <p className="text-base 3xl:text-lg text-primary leading-relaxed">
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
