import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

export default function DonationProductsGrid({ products = [] }) {
  if (products.length === 0) return null

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-bg">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.p
          {...fadeInUp}
          className="text-[0.6875rem] md:text-xs tracking-[0.25em] uppercase text-secondary-terra font-semibold mb-2"
        >
          Choose a Cause
        </motion.p>
        <motion.h2
          {...fadeInUp}
          className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-primary tracking-tight leading-tight mb-10"
        >
          Where Your Donation Goes
        </motion.h2>

        <motion.div
          {...staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 3xl:gap-10"
        >
          {products.map((p) => (
            <motion.div
              key={p._id || p.slug}
              {...staggerItem}
              className="group bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-secondary-terra/40 hover:shadow-lg transition-all duration-300"
            >
              {p.imageUrl && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 3xl:p-8">
                <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-secondary-terra font-semibold">
                  {p.category}
                </span>
                <h3 className="text-lg 3xl:text-xl font-medium text-primary mt-1 mb-2">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="text-[0.8125rem] 3xl:text-sm text-primary/70 leading-relaxed mb-4 line-clamp-3">
                    {p.description}
                  </p>
                )}
                {p.goalAmount > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[0.625rem] tracking-[0.15em] uppercase text-primary/55 mb-1">
                      <span>
                        ${((p.raisedAmount || 0) / 100).toLocaleString()} raised
                      </span>
                      <span>${(p.goalAmount / 100).toLocaleString()} goal</span>
                    </div>
                    <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary-terra rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, ((p.raisedAmount || 0) / p.goalAmount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <CTAButton to={`/donate/checkout?product=${p._id}`}>
                  Donate
                </CTAButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
