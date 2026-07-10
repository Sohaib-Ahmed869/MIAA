import { motion } from "framer-motion"
import { HandHeart } from "lucide-react"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

export default function DonationProductsGrid({ products = [] }) {
  if (products.length === 0) return null

  return (
    <section id="choose-a-cause" className="scroll-mt-24 py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.p
          {...fadeInUp}
          className="text-[0.6875rem] md:text-xs tracking-[0.25em] uppercase text-secondary-terra font-semibold mb-2"
        >
          Choose a Cause
        </motion.p>
        <motion.h2
          {...fadeInUp}
          className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-primary tracking-tight leading-tight"
        >
          Where Your Donation Goes
        </motion.h2>
        <motion.p
          {...fadeInUp}
          className="text-base 3xl:text-lg text-primary/70 leading-relaxed mt-4 mb-10 md:mb-14 max-w-xl"
        >
          Every gift is directed to a specific programme — from safeguarding
          collections to educating the next generation. Choose where your support
          makes the greatest difference.
        </motion.p>

        <motion.div
          {...staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 3xl:gap-10"
        >
          {products.map((p) => {
            const pct = p.goalAmount > 0
              ? Math.min(100, ((p.raisedAmount || 0) / p.goalAmount) * 100)
              : 0
            return (
              <motion.div
                key={p._id || p.slug}
                {...staggerItem}
                className="group flex flex-col bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-secondary-terra/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden bg-bg-deep relative">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent-cream/30">
                      <HandHeart className="w-10 h-10" strokeWidth={1.25} />
                    </div>
                  )}
                  {p.category && (
                    <span className="absolute top-3 left-3 text-[0.5625rem] tracking-[0.2em] uppercase text-white font-semibold bg-secondary-terra/90 px-2.5 py-1 rounded-sm backdrop-blur-sm">
                      {p.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 3xl:p-8">
                  <h3 className="text-lg 3xl:text-xl font-medium text-primary mb-2">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-[0.8125rem] 3xl:text-sm text-primary/70 leading-relaxed mb-4 line-clamp-3">
                      {p.description}
                    </p>
                  )}

                  {/* Progress + CTA pinned to the bottom for even card heights */}
                  <div className="mt-auto pt-2">
                    {p.goalAmount > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-baseline text-[0.625rem] tracking-[0.15em] uppercase text-primary/55 mb-1.5">
                          <span className="text-secondary-terra font-semibold">
                            ${((p.raisedAmount || 0) / 100).toLocaleString()} raised
                          </span>
                          <span>${(p.goalAmount / 100).toLocaleString()} goal</span>
                        </div>
                        <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-secondary-terra rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                          />
                        </div>
                      </div>
                    )}
                    <CTAButton to={`/donate/checkout?product=${p._id}`}>
                      Donate
                    </CTAButton>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
