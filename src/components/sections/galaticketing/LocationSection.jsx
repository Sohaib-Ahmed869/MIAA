import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, fadeInUp } from "../../../lib/motion"
import CTAButton from "../../ui/Button"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import venueImg from "../../../assets/images/Ticketing/agnsw-exterior.jpg"
import bgPattern from "../../../assets/images/Ticketing/bgpatternticket.png"

function QuatrefoilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="#DD613E">
      <circle cx="50" cy="22" r="25" />
      <circle cx="50" cy="78" r="25" />
      <circle cx="22" cy="50" r="25" />
      <circle cx="78" cy="50" r="25" />
      <rect x="22" y="22" width="56" height="56" rx="4" fill="#DD613E" />
    </svg>
  )
}

export default function LocationSection() {
  const t = useText()
  return (
    <section className="relative bg-accent-cream overflow-hidden rounded-t-3xl">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={bgPattern}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      {/* Cream overlay */}
      <div className="absolute inset-0 bg-accent-cream/90 pointer-events-none" />

      <div className="relative z-10">
        {/* Section divider inside the component */}
        <div className="w-full px-6 md:px-10 lg:px-16 3xl:px-24 pt-8 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex-shrink-0">
              <QuatrefoilIcon />
            </span>
            <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase" style={{ color: "#7A3A42" }}>
              <Text k="gala.location.label" />
            </span>
          </div>
          <div
            className="h-[2px] w-full"
            style={{
              backgroundImage: "radial-gradient(circle, #38717A50 0.09375rem, transparent 0.09375rem)",
              backgroundSize: "0.5rem 0.1875rem",
              height: "2px",
            }}
          />
        </div>

        <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24 py-16 md:py-24 3xl:py-32">
          {/* Top — How to Get Here */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-8 lg:gap-12 items-start">
            {/* Left — venue photo */}
            <motion.div {...fadeInLeft}>
              <div className="overflow-hidden">
                <img
                  src={venueImg}
                  alt="Art Gallery of New South Wales — exterior columns"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            {/* Vertical divider */}
            <div className="hidden lg:block bg-primary/15 self-stretch" />

            {/* Right — directions */}
            <motion.div {...fadeInRight}>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] 3xl:text-[3.2rem] font-normal text-primary tracking-tight leading-snug mb-6 uppercase">
                <Text k="gala.location.heading" />
              </h2>
              <p className="text-base sm:text-lg md:text-xl 3xl:text-2xl text-primary leading-relaxed mb-6">
                Travel information via the{" "}
                <a href="https://www.artgallery.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-secondary-terra underline hover:text-secondary-rust transition-colors font-semibold">
                  Art Gallery of New South Wales
                </a>{" "}
                website.
              </p>

              <p className="text-base 3xl:text-lg text-primary leading-relaxed mb-4">
                The Art Gallery of NSW has two art museum buildings in the Domain in Sydney on Gadigal Country. These have been given Sydney Aboriginal language names:
              </p>

              <ul className="flex flex-col gap-3 list-disc list-inside text-primary marker:text-primary">
                <li className="text-base 3xl:text-lg text-primary leading-relaxed">
                  <strong className="text-primary">Naala Nura,</strong> which means &lsquo;seeing Country&rsquo;, is our historic building on the south part of the site, facing the Domain parklands.
                </li>
                <li className="text-base 3xl:text-lg text-primary leading-relaxed">
                  <strong className="text-primary">Naala Badu,</strong> which means &lsquo;seeing waters&rsquo;, is our new building on the north part of the site, overlooking Sydney Harbour.
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom — Where to Find Us */}
          <motion.div
            {...fadeInUp}
            className="mt-16 md:mt-24 bg-white rounded-2xl p-6 md:p-8 3xl:p-10 grid grid-cols-1 lg:grid-cols-[15.625rem_1fr_auto] items-start"
            style={{ columnGap: "1rem", rowGap: "1.5rem" }}
          >
            <h3 className="font-display text-lg md:text-xl 3xl:text-2xl font-normal text-primary tracking-tight uppercase whitespace-nowrap">
              <Text k="gala.location.findHeading" />
            </h3>

            <div className="max-w-xl">
              <p className="text-base sm:text-lg md:text-xl 3xl:text-2xl font-medium text-primary leading-snug mb-2">
                <Text k="gala.location.address" />
              </p>
              <p className="text-sm sm:text-base 3xl:text-lg text-primary leading-relaxed">
                <Text k="gala.location.addressBody" />
              </p>
            </div>

            <CTAButton href="https://maps.google.com/?q=Art+Gallery+of+New+South+Wales" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap self-start">{t("gala.location.mapsCta")}</CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
