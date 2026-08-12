import { motion } from "framer-motion"
import { useMediaResolver } from "../../../content/context"
import { Quote } from "lucide-react"
import { fadeInUp, staggerContainer, staggerItem } from "../../../lib/motion"

import SMWFBehindTheMarkSection from "./SMWFBehindTheMarkSection"


const TESTIMONIALS = [
  {
    name: "Nadia Serhan Faour",
    role: "Author and Attendee",
    quote:
      "What attracted me to the festival was the children's library — Muslim books from all around the world and the chance to explore the range of books on display.",
  },
  {
    name: "George Green",
    role: "Motivational speaker and children's author",
    quote:
      "What I loved most about the Sydney Muslim Writers Festival was the clear effort to hear voices from many communities. It felt inclusive, intentional, and true to the diversity of Muslim stories.",
  },
  {
    name: "Annie McCann",
    role: "Indonesian-Australian emcee and author",
    quote:
      "I found great comfort in a space where joy and solace could naturally coexist. It was a safe haven for expressing collective grief — such spaces are crucial right now.",
  },
  {
    name: "Mostofa Alam",
    role: "Founder, Date Palm Tree Publishing House",
    quote:
      "SMWF is a distinguished program that enriches Australia's multicultural landscape — a professional platform that nurtures creative excellence.",
  },
  {
    name: "Lamisse Hamouda",
    role: "Author and Attendee",
    quote:
      "An opportunity to connect and learn from other writers and authors in the Muslim community, and to connect with people who are passionate about literature.",
  },
]

const PARTNER_LOGOS = [
  { name: "NSW Government",       mediaKey: "smwf.partners.logo1" },
  { name: "Canterbury Bankstown", mediaKey: "smwf.partners.logo2" },
  { name: "Think Studio",         mediaKey: "smwf.partners.logo3" },
  { name: "ISRA",                 mediaKey: "smwf.partners.logo4" },
  { name: "City of Parramatta",   mediaKey: "smwf.partners.logo5" },
  { name: "Barakah Brew",         mediaKey: "smwf.partners.logo6" },
]

export default function SMWFCommunitySection() {
  const media = useMediaResolver()
  return (
    <>
      {/* Testimonials — moving carousel */}
      <section
        className="py-20 md:py-24 lg:py-28 desktop:py-32 3xl:py-40 4xl:py-56 overflow-hidden"
        style={{ backgroundColor: "#F3EFEB" }}
      >
        <div className="max-w-[1500px] desktop:max-w-[1700px] 3xl:max-w-[3200px] 4xl:max-w-[4000px] mx-auto px-6 md:px-10 lg:px-14 desktop:px-20 3xl:px-20 4xl:px-32">
          <motion.div
            {...fadeInUp}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 desktop:gap-8 4xl:gap-12 mb-12 md:mb-16 desktop:mb-20 3xl:mb-20 4xl:mb-28"
          >
            <div className="max-w-2xl desktop:max-w-3xl 4xl:max-w-5xl">
              <h2
                className="font-aeonik text-3xl md:text-4xl lg:text-5xl desktop:text-6xl 3xl:text-7xl 4xl:text-[6.5rem] font-medium tracking-tight leading-tight"
                style={{ color: "#124039" }}
              >
                What Our Community Says
              </h2>
              <p
                className="mt-3 md:mt-4 desktop:mt-5 3xl:mt-6 4xl:mt-9 font-barlow text-base md:text-lg desktop:text-[1.1875rem] 3xl:text-xl 4xl:text-3xl"
                style={{ color: "rgba(18,64,57,0.7)" }}
              >
                Hear from the writers, readers, and attendees who&apos;ve been
                part of the SMWF journey.
              </p>
            </div>
            <motion.a
              href="https://www.miaaustralia.org/smwf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="self-start inline-flex items-center justify-center px-8 md:px-10 desktop:px-12 3xl:px-14 4xl:px-20 py-3.5 md:py-4 desktop:py-5 3xl:py-6 4xl:py-9 font-aeonik text-xs md:text-sm desktop:text-base 3xl:text-lg 4xl:text-2xl font-semibold tracking-[0.18em] uppercase rounded-none"
              style={{ backgroundColor: "#CBCE58", color: "#124039" }}
            >
              Get Tickets
            </motion.a>
          </motion.div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-5 md:gap-6 desktop:gap-7 3xl:gap-9 4xl:gap-14 w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 180, ease: "linear", repeat: Infinity }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="shrink-0 w-[20rem] md:w-[26.25rem] lg:w-[30rem] desktop:w-[35rem] 3xl:w-[40rem] 4xl:w-[57.5rem] bg-white rounded-lg p-7 md:p-8 desktop:p-10 3xl:p-12 4xl:p-16 flex flex-col min-h-[20rem] desktop:min-h-[22.5rem] 3xl:min-h-[25rem] 4xl:min-h-[35rem]"
              >
                <Quote
                  className="w-8 h-8 md:w-10 md:h-10 desktop:w-11 desktop:h-11 3xl:w-12 3xl:h-12 4xl:w-16 4xl:h-16 mb-5 md:mb-6 desktop:mb-8 3xl:mb-9 4xl:mb-12 shrink-0 text-[#4656CD]"
                  fill="currentColor"
                  strokeWidth={0}
                />
                <p
                  className="font-barlow text-base md:text-lg desktop:text-[1.1875rem] 3xl:text-xl 4xl:text-3xl leading-relaxed flex-1"
                  style={{ color: "rgba(18,64,57,0.85)" }}
                >
                  {t.quote}
                </p>
                <div className="mt-6 md:mt-8 desktop:mt-10 3xl:mt-12 4xl:mt-16">
                  <p
                    className="font-aeonik text-base md:text-lg desktop:text-xl 3xl:text-2xl 4xl:text-4xl font-semibold tracking-tight"
                    style={{ color: "#124039" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="font-barlow text-sm md:text-base desktop:text-[1.0625rem] 3xl:text-lg 4xl:text-2xl mt-1 4xl:mt-2"
                    style={{ color: "rgba(18,64,57,0.6)" }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Behind the Mark */}
      <SMWFBehindTheMarkSection />

      {/* Partners & Sponsors */}
      <section
        className="py-16 md:py-20 lg:py-24 desktop:py-28 3xl:py-32 4xl:py-44"
        style={{ backgroundColor: "#F3EFEB" }}
      >
        <div className="max-w-[1300px] desktop:max-w-[1500px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-14 desktop:px-16 3xl:px-20 4xl:px-32">
          <motion.h2
            {...fadeInUp}
            className="font-aeonik text-center text-3xl md:text-4xl lg:text-5xl desktop:text-6xl 3xl:text-7xl 4xl:text-[6.5rem] font-medium tracking-tight mb-10 md:mb-12 desktop:mb-14 3xl:mb-16 4xl:mb-24"
            style={{ color: "#124039" }}
          >
            Partners &amp; Sponsors
          </motion.h2>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 desktop:gap-6 3xl:gap-8 4xl:gap-12"
          >
            {PARTNER_LOGOS.map((p) => (
              <motion.div
                key={p.name}
                {...staggerItem}
                className="h-40 md:h-48 lg:h-56 desktop:h-64 3xl:h-72 4xl:h-[28rem] bg-white flex items-center justify-center p-8 md:p-10 lg:p-12 desktop:p-14 3xl:p-16 4xl:p-24"
              >
                <img
                  src={media(p.mediaKey)}
                  alt={p.name}
                  className="max-h-[70%] max-w-[80%] w-auto h-auto object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
