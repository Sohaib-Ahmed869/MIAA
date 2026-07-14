import { motion } from "framer-motion"
import { fadeInUp } from "../../../lib/motion"
import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import SectionDivider from "../../ui/SectionDivider"
import hikmaLegal from "../../../assets/images/Sponsor Logos/Hikma Legal - Silver (1).png"
import metroStrata from "../../../assets/images/Sponsor Logos/Metro Strata Levy Header.png"
import taxFactor from "../../../assets/images/Sponsor Logos/The Tax Factor.svg"
import thinkStudio from "../../../assets/images/Sponsor Logos/think-studio.svg"
import tcLogo from "../../../assets/images/Sponsor Logos/TC-LogoRGB-Horizontal-FullColour.png"
import universalFederation from "../../../assets/images/Sponsor Logos/Universal Federation logo stg5_blue (1).png"

// Static fallback — rendered if the CMS is unreachable or has no sponsors yet.
// Sponsors managed in the admin CMS return a presigned `logoUrl` instead of a
// bundled `logo` asset; the card reads whichever is present.
const FALLBACK_SPONSORS = [
  { name: "Hikma Legal", logo: hikmaLegal, url: "https://www.hikma.legal/" },
  { name: "Metro Strata Levy", logo: metroStrata, url: "https://www.metro-strata.com/" },
  { name: "The Tax Factor", logo: taxFactor, url: "https://thetaxfactor.com.au/" },
  { name: "Think Studio", logo: thinkStudio, url: "https://www.thinkstudio.com.au/" },
  { name: "Theorem Consulting", logo: tcLogo, url: "https://www.theoremconsulting.com.au/" },
  { name: "Australian Universal Federation", logo: universalFederation, url: "https://auf.net.au/" },
]

// How many times to repeat the sponsors within a single set. With only a few
// sponsors, one set must be wider than the viewport or the -50% loop leaves a
// gap on the right. Repeating fills the widest screens seamlessly.
const REPEAT = 4

// One set of glass logo cards. The track renders two of these back-to-back so
// the CSS marquee (translateX 0 → -50%) loops seamlessly.
function SponsorSet({ sponsors, ariaHidden = false }) {
  const cards = Array.from({ length: REPEAT }, () => sponsors).flat()
  const cardClass =
    "group mx-4 md:mx-6 3xl:mx-8 shrink-0 flex items-center justify-center " +
    "w-56 md:w-72 3xl:w-96 h-32 md:h-40 3xl:h-52 px-8 rounded-2xl " +
    "border border-white/30 bg-white/20 backdrop-blur-md " +
    "shadow-[0_8px_28px_-10px_rgba(33,73,82,0.18)] " +
    "transition-all duration-300 hover:bg-white/35 hover:-translate-y-1"
  return (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden || undefined}>
      {cards.map((sponsor, i) => {
        const logo = (
          <img
            src={sponsor.logoUrl || sponsor.logo}
            alt={sponsor.name}
            className="max-h-20 md:max-h-24 3xl:max-h-32 w-auto max-w-full object-contain
                       transition-transform duration-300 group-hover:scale-105"
          />
        )
        // Sponsors without a URL render as a plain card, not a link.
        return sponsor.url ? (
          <a
            key={`${sponsor.name}-${i}`}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={sponsor.name}
            tabIndex={ariaHidden ? -1 : undefined}
            className={cardClass}
          >
            {logo}
          </a>
        ) : (
          <div key={`${sponsor.name}-${i}`} className={cardClass}>
            {logo}
          </div>
        )
      })}
    </div>
  )
}

export default function GalaSponsorsSection() {
  const { data: sponsors } = useCMS(
    () => api.sponsors({ surface: "gala" }),
    FALLBACK_SPONSORS
  )

  // Nothing to show and no fallback — render nothing rather than an empty band.
  if (!sponsors || sponsors.length === 0) return null

  return (
    <section className="bg-accent-cream">
      {/* Full-width glassmorphic slider band — light glass-on-cream.
          Divider + heading live inside so the whole block reads as one unit. */}
      <motion.div
        {...fadeInUp}
        className="relative w-full overflow-hidden bg-accent-cream pt-8 pb-16 md:pt-10 md:pb-24 3xl:pt-14 3xl:pb-32"
      >
        {/* Soft tinted glows so the frosted-glass cards have something to blur */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 120% at 15% 30%, rgba(56,113,122,0.18) 0%, transparent 60%), radial-gradient(55% 120% at 85% 70%, rgba(215,184,147,0.28) 0%, transparent 60%)",
          }}
        />

        {/* Section divider — sits on top of the band */}
        <div className="relative z-20 max-w-[1400px] 3xl:max-w-[3200px] mx-auto">
          <SectionDivider label="Our Sponsors" bg="bg-transparent" variant="light" />
        </div>

        {/* Heading — sits on top of the band */}
        <h2 className="relative z-20 font-display text-3xl md:text-[2.625rem] 3xl:text-[3.2rem] font-medium leading-none tracking-tight mt-8 md:mt-10 mb-8 md:mb-12 3xl:mb-16 uppercase text-center gala-heading">
          Sponsored By
        </h2>

        {/* Edge fades so cards slide in/out softly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-accent-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-accent-cream to-transparent" />

        {/* Scrolling track — two identical sets = seamless loop; pauses on hover */}
        <div className="relative flex w-max sponsor-marquee">
          <SponsorSet sponsors={sponsors} />
          <SponsorSet sponsors={sponsors} ariaHidden />
        </div>
      </motion.div>
    </section>
  )
}
