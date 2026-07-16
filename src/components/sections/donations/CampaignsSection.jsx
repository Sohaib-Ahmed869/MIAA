import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"

export default function CampaignsSection({ campaigns = [] }) {
  if (campaigns.length === 0) return null

  return (
    <section className="bg-bg py-16 md:py-24 3xl:py-32 overflow-hidden">
      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <motion.p
            {...fadeInUp}
            className="text-[0.6875rem] md:text-xs tracking-[0.25em] uppercase text-secondary-terra font-semibold mb-2"
          >
            Active Campaigns
          </motion.p>
          <motion.h2
            {...fadeInUp}
            className="text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl font-medium text-primary tracking-tight leading-tight"
          >
            Current Appeals
          </motion.h2>
        </div>

        {/* Rounded card carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            loop={campaigns.length > 1}
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{ prevEl: ".campaign-prev", nextEl: ".campaign-next" }}
            className="campaign-swiper !pb-12"
          >
            {campaigns.map((c) => {
              const pct =
                c.goalAmount > 0
                  ? Math.min(100, ((c.raisedAmount || 0) / c.goalAmount) * 100)
                  : 0
              return (
                <SwiperSlide key={c._id || c.slug}>
                  <div className="relative rounded-2xl 3xl:rounded-3xl overflow-hidden h-[58vh] min-h-[400px] max-h-[600px] 3xl:max-h-[760px] bg-bg-deep shadow-[0_20px_50px_-24px_rgba(33,73,82,0.45)]">
                    {/* Image — shown in full (contain) over a blurred fill */}
                    {c.imageUrl ? (
                      <>
                        <img
                          src={c.imageUrl}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
                        />
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="absolute inset-0 w-full h-full object-contain object-center"
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-bg-deep" />
                    )}
                    {/* Legibility overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />

                    {/* Content */}
                    <div className="relative h-full flex items-end">
                      <div className="w-full px-6 md:px-10 lg:px-14 3xl:px-20 pb-12 md:pb-14 3xl:pb-20">
                        <motion.div
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                          className="max-w-xl 3xl:max-w-3xl"
                        >
                          <p className="text-[0.625rem] md:text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-3">
                            Campaign
                          </p>
                          <h3 className="text-2xl md:text-4xl lg:text-5xl 3xl:text-6xl font-medium text-white tracking-tight leading-[1.05] mb-3">
                            {c.title}
                          </h3>
                          {c.description && (
                            <p className="text-sm md:text-base 3xl:text-lg text-white/75 leading-relaxed mb-5 line-clamp-2">
                              {c.description}
                            </p>
                          )}

                          {c.goalAmount > 0 && (
                            <div className="mb-5 max-w-md 3xl:max-w-xl">
                              <div className="flex justify-between text-[0.625rem] md:text-[0.6875rem] tracking-[0.15em] uppercase text-white/70 mb-1.5">
                                <span className="text-accent-wheat font-semibold">
                                  ${((c.raisedAmount || 0) / 100).toLocaleString()} raised
                                </span>
                                <span>${(c.goalAmount / 100).toLocaleString()} goal</span>
                              </div>
                              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-secondary-terra rounded-full"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${pct}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                                />
                              </div>
                            </div>
                          )}

                          <CTAButton to={`/campaign/${c.slug || c._id}`}>
                            Support this Campaign
                          </CTAButton>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          {/* Prev / next arrows (desktop, only when multiple) */}
          {campaigns.length > 1 && (
            <>
              <button
                aria-label="Previous campaign"
                className="campaign-prev hidden md:flex absolute -left-4 lg:-left-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-primary/10 text-primary shadow-md hover:bg-secondary-terra hover:text-white hover:border-secondary-terra transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next campaign"
                className="campaign-next hidden md:flex absolute -right-4 lg:-right-5 top-[calc(50%-1.5rem)] -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-primary/10 text-primary shadow-md hover:bg-secondary-terra hover:text-white hover:border-secondary-terra transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
