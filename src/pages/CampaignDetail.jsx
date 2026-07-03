import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "../lib/api"
import { fadeInUp } from "../lib/motion"
import CTAButton from "../components/ui/Button"
import SectionDivider from "../components/ui/SectionDivider"

export default function CampaignDetail() {
  const { slug } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    api
      .campaign(slug)
      .then((data) => {
        if (!controller.signal.aborted) setCampaign(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [slug])

  if (loading) {
    return (
      <section className="bg-bg-deep min-h-screen pt-32 text-center">
        <p className="text-accent-cream/50 text-sm">Loading campaign…</p>
      </section>
    )
  }

  if (!campaign) {
    return (
      <section className="bg-bg-deep min-h-screen pt-32 text-center">
        <h1 className="text-2xl text-accent-cream mb-4">Campaign Not Found</h1>
        <CTAButton to="/donate">View All Donations</CTAButton>
      </section>
    )
  }

  const progressPct = campaign.goalAmount
    ? Math.min(100, ((campaign.raisedAmount || 0) / campaign.goalAmount) * 100)
    : 0

  return (
    <>
      {/* Hero */}
      <section className="relative bg-bg-deep overflow-hidden">
        <div className="w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-28 md:pt-32 pb-10 text-center">
          <motion.p
            {...fadeInUp}
            className="text-[0.6875rem] tracking-[0.25em] uppercase text-accent-wheat font-semibold mb-2"
          >
            Campaign
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-[4.5rem] font-medium text-accent-cream tracking-tight leading-tight"
          >
            {campaign.title}
          </motion.h1>
          {campaign.description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-accent-cream/65 mt-5 max-w-2xl mx-auto"
            >
              {campaign.description}
            </motion.p>
          )}
        </div>

        {campaign.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="w-full h-[50vh] md:h-[26rem] lg:h-[30rem] overflow-hidden"
          >
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        )}
      </section>

      {/* Progress + CTA */}
      <section className="py-12 md:py-16 bg-accent-cream">
        <div className="max-w-[700px] mx-auto px-6 md:px-10 text-center">
          {campaign.goalAmount > 0 && (
            <motion.div {...fadeInUp} className="mb-8">
              <div className="flex justify-between text-sm text-primary/60 mb-2">
                <span>${((campaign.raisedAmount || 0) / 100).toLocaleString()} raised</span>
                <span>${(campaign.goalAmount / 100).toLocaleString()} goal</span>
              </div>
              <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-secondary-terra rounded-full"
                />
              </div>
              <p className="text-sm text-primary/50 mt-2">
                {campaign.donationCount || 0} donation{campaign.donationCount !== 1 ? "s" : ""}
              </p>
            </motion.div>
          )}

          {campaign.endDate && (
            <p className="text-[0.6875rem] tracking-[0.15em] uppercase text-primary/50 mb-4">
              Campaign ends {new Date(campaign.endDate).toLocaleDateString("en-AU")}
            </p>
          )}

          <CTAButton to={`/donate/checkout?campaign=${campaign._id}`}>
            Support this Campaign
          </CTAButton>
        </div>
      </section>

      {/* Long description */}
      {campaign.longDescription && (
        <>
          <SectionDivider label="About this Campaign" bg="bg-bg" variant="light" />
          <section className="py-16 md:py-24 bg-bg">
            <div className="max-w-[800px] mx-auto px-6 md:px-10">
              <motion.div {...fadeInUp} className="prose prose-lg text-primary/80">
                {campaign.longDescription.split("\n\n").map((para, i) => (
                  <p key={i} className="text-[0.9375rem] leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </motion.div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
