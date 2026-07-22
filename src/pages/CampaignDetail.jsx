import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "../lib/api"
import { fadeInUp } from "../lib/motion"
import { ShieldCheck } from "lucide-react"
import CTAButton from "../components/ui/Button"
import CampaignContent from "../components/campaign/CampaignContent"

export default function CampaignDetail() {
  const { slug } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [supporters, setSupporters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
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

  useEffect(() => {
    const controller = new AbortController()
    api
      .campaignDonations(slug)
      .then((data) => {
        if (!controller.signal.aborted) setSupporters(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
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
      {/* Content + sticky donation widget */}
      <section className="relative pt-44 md:pt-48 3xl:pt-56 pb-14 md:pb-20 3xl:pb-28 bg-bg overflow-hidden">
        {/* Dark gradient band so the cream logo stays legible over the top of the page */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-44 md:h-48 3xl:h-56 bg-gradient-to-b from-bg-deep via-bg-deep/70 to-bg"
        />
        <div className="relative max-w-[1180px] 3xl:max-w-[1480px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
          <div className="grid lg:grid-cols-[1fr_340px] 3xl:grid-cols-[1fr_400px] gap-10 lg:gap-14 3xl:gap-20 items-start">
            {/* Main column — image, title, content, then donors at the end */}
            <div className="min-w-0">
              {/* Contained campaign image — shown at natural aspect, never cropped or full-bleed */}
              {campaign.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mb-8 md:mb-10 rounded-2xl overflow-hidden border border-primary/10 bg-white shadow-[0_20px_50px_-30px_rgba(33,73,82,0.4)]"
                >
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-auto object-contain"
                  />
                </motion.div>
              )}

              {/* Title block */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="mb-8 md:mb-10"
              >
                <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-secondary-terra font-semibold mb-2">
                  Campaign
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] 3xl:text-6xl font-medium text-primary tracking-tight leading-[1.1]">
                  {campaign.title}
                </h1>
                {campaign.description && (
                  <p className="text-base md:text-lg 3xl:text-xl text-primary/65 mt-4 max-w-2xl">
                    {campaign.description}
                  </p>
                )}
              </motion.div>

              {/* Only show a fixed title for the plain-text fallback — rich
                  content defines its own headings via blocks. */}
              {!campaign.contentBlocks?.length && campaign.longDescription && (
                <h2 className="text-2xl md:text-3xl 3xl:text-4xl font-medium text-primary tracking-tight mb-6 md:mb-8">
                  About the campaign
                </h2>
              )}

              {campaign.contentBlocks?.length > 0 ? (
                <CampaignContent blocks={campaign.contentBlocks} />
              ) : campaign.longDescription ? (
                <div className="space-y-4">
                  {campaign.longDescription.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className="text-[0.9375rem] md:text-base leading-relaxed text-primary/75"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ) : null}

              {/* Recent supporters — at the end of the content */}
              {supporters.length > 0 && (
                <div className="mt-14 md:mt-16 pt-10 border-t border-primary/10">
                  <p className="text-[0.6875rem] tracking-[0.25em] uppercase text-secondary-terra font-semibold mb-1">
                    Recent Supporters
                  </p>
                  <h3 className="text-xl md:text-2xl font-medium text-primary tracking-tight mb-6">
                    Thank You to Our Donors
                  </h3>
                  <ul className="space-y-3">
                    {supporters.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                        className="flex items-start gap-4 bg-white border border-primary/10 rounded-sm p-4"
                      >
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-terra/12 text-secondary-terra flex items-center justify-center text-sm font-semibold">
                          {(s.name?.[0] || "?").toUpperCase()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-sm font-medium text-primary truncate">
                              {s.name}
                              <span className="font-normal text-primary/50">
                                {" "}
                                donated ${((s.amount || 0) / 100).toLocaleString()}
                              </span>
                            </p>
                            <time className="text-[0.6875rem] text-primary/40 flex-shrink-0">
                              {new Date(s.createdAt).toLocaleDateString("en-AU")}
                            </time>
                          </div>
                          {s.message && (
                            <p className="text-[0.8125rem] text-primary/65 mt-1 leading-relaxed">
                              “{s.message}”
                            </p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Donation widget (sticky on desktop) */}
            <aside className="lg:sticky lg:top-28 order-first lg:order-none">
              <motion.div
                {...fadeInUp}
                className="rounded-2xl border border-primary/10 bg-white p-6 3xl:p-7 shadow-[0_20px_50px_-30px_rgba(33,73,82,0.4)]"
              >
                {campaign.goalAmount > 0 ? (
                  <>
                    <p className="text-3xl 3xl:text-4xl font-semibold text-primary leading-none">
                      ${((campaign.raisedAmount || 0) / 100).toLocaleString()}
                    </p>
                    <p className="text-sm text-primary/50 mt-1.5">
                      raised of ${(campaign.goalAmount / 100).toLocaleString()} goal
                    </p>
                    <div className="h-2.5 bg-primary/10 rounded-full overflow-hidden mt-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="h-full bg-secondary-terra rounded-full"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[0.8125rem] text-primary/55">
                      <span>
                        <strong className="text-primary font-semibold">
                          {campaign.donationCount || 0}
                        </strong>{" "}
                        donation{campaign.donationCount !== 1 ? "s" : ""}
                      </span>
                      <span>{Math.round(progressPct)}% funded</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-2xl 3xl:text-3xl font-semibold text-primary leading-tight">
                      ${((campaign.raisedAmount || 0) / 100).toLocaleString()} raised
                    </p>
                    <p className="text-sm text-primary/50 mt-1.5">
                      {campaign.donationCount || 0} donation
                      {campaign.donationCount !== 1 ? "s" : ""}
                    </p>
                  </>
                )}

                <div className="mt-6">
                  <CTAButton
                    to={`/donate/checkout?campaign=${campaign._id}`}
                    className="!w-full !justify-center"
                  >
                    Support this Campaign
                  </CTAButton>
                </div>

                {campaign.endDate && (
                  <p className="text-[0.6875rem] tracking-[0.15em] uppercase text-primary/45 mt-4 text-center">
                    Ends {new Date(campaign.endDate).toLocaleDateString("en-AU")}
                  </p>
                )}
                <p className="flex items-center justify-center gap-1.5 text-[0.75rem] text-primary/45 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure donation via Stripe
                </p>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
