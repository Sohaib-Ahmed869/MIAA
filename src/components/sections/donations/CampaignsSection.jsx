import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

export default function CampaignsSection({ campaigns = [] }) {
  if (campaigns.length === 0) return null

  return (
    <section className="py-16 md:py-24 3xl:py-32 bg-primary">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.p
          {...fadeInUp}
          className="text-[0.6875rem] md:text-xs tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-2"
        >
          Active Campaigns
        </motion.p>
        <motion.h2
          {...fadeInUp}
          className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-accent-cream tracking-tight leading-tight mb-10"
        >
          Current Appeals
        </motion.h2>

        <motion.div
          {...staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 3xl:gap-10"
        >
          {campaigns.map((c) => (
            <motion.div
              key={c._id || c.slug}
              {...staggerItem}
              className="group bg-white/5 border border-accent-cream/15 rounded-sm overflow-hidden hover:border-secondary-terra/40 transition-all duration-300"
            >
              {c.imageUrl && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 3xl:p-8">
                <h3 className="text-lg 3xl:text-xl font-medium text-accent-cream mb-2">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="text-[0.8125rem] 3xl:text-sm text-accent-cream/65 leading-relaxed mb-4 line-clamp-3">
                    {c.description}
                  </p>
                )}
                {c.goalAmount > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[0.625rem] tracking-[0.15em] uppercase text-accent-cream/50 mb-1">
                      <span>
                        ${((c.raisedAmount || 0) / 100).toLocaleString()} raised
                      </span>
                      <span>${(c.goalAmount / 100).toLocaleString()} goal</span>
                    </div>
                    <div className="h-1.5 bg-accent-cream/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary-terra rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, ((c.raisedAmount || 0) / c.goalAmount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {c.endDate && (
                  <p className="text-[0.625rem] tracking-[0.15em] uppercase text-accent-wheat/60 mb-4">
                    Ends {new Date(c.endDate).toLocaleDateString("en-AU")}
                  </p>
                )}
                <CTAButton to={`/campaign/${c.slug || c._id}`}>
                  Support this Campaign
                </CTAButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
