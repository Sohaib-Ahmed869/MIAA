import { useState } from "react"
import { useMediaResolver } from "../../../content/context"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { staggerContainer, staggerItem } from "../../../lib/motion"
import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import Text from "../../../content/Text"

const FALLBACK_PEOPLE = [
  { name: "Prof Mehmet Ozalp", role: "Director", description: "", imgKey: "about.people.fallback1" },
  { name: "Orhan Kaba", role: "Design Consultant", description: "", imgKey: "about.people.fallback2" },
  { name: "Dr Nur Shkembi OAM", role: "Artistic Director & Curator", description: "", imgKey: "about.people.fallback3" },
  { name: "Zeliha Baydogan", role: "Project Manager", description: "", imgKey: "about.people.fallback1" },
  { name: "Dr Derya Iner", role: "Research & Education Advisor", description: "", imgKey: "about.people.fallback2" },
  { name: "Raaza Bashir", role: "Project Control Group", description: "", imgKey: "about.people.fallback3" },
]

function QuatrefoilMarker({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="#C15C45"
      className="flex-shrink-0"
    >
      <circle cx="50" cy="22" r="25" />
      <circle cx="50" cy="78" r="25" />
      <circle cx="22" cy="50" r="25" />
      <circle cx="78" cy="50" r="25" />
      <rect x="22" y="22" width="56" height="56" rx="4" />
    </svg>
  )
}

function QuatrefoilPortrait({ src, alt, hovered }) {
  const id = `qf-${alt.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <div className="relative w-44 h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 3xl:w-72 3xl:h-72">
      <svg
        viewBox="-10 -10 120 120"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={id}>
            <circle cx="50" cy="18" r="28" />
            <circle cx="50" cy="82" r="28" />
            <circle cx="18" cy="50" r="28" />
            <circle cx="82" cy="50" r="28" />
            <rect x="18" y="18" width="64" height="64" rx="8" />
          </clipPath>
        </defs>

        {/* Single clip for everything — no gap */}
        <g clipPath={`url(#${id})`}>
          {/* Background fill — always visible behind image as safety */}
          <rect x="-10" y="-10" width="120" height="120" fill={hovered ? "#214952" : "#c0c0c0"} style={{ transition: "fill 0.6s ease" }} />

          {/* Portrait image */}
          <g style={{ filter: hovered ? "none" : "grayscale(100%)", transition: "filter 0.6s ease" }}>
            <image
              href={src}
              x="-10" y="-10"
              width="120"
              height="120"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>

          {/* Teal color overlay */}
          <rect x="-10" y="-10" width="120" height="120"
            fill="#214952"
            style={{ opacity: hovered ? 0.45 : 0, transition: "opacity 0.6s ease" }}
          />
        </g>
      </svg>
    </div>
  )
}

function PersonCard({ person, onSelect }) {
  const media = useMediaResolver()
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      {...staggerItem}
      className="flex flex-col items-center text-center md:px-6 cursor-pointer"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="transition-transform duration-300 overflow-visible p-3" style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}>
        <QuatrefoilPortrait
          src={person.photoUrl || media(person.imgKey) || media("about.people.fallback3")}
          alt={person.name}
          hovered={hovered}
        />
      </div>
      <p className="text-primary text-base md:text-[1.0625rem] 3xl:text-xl font-semibold leading-tight mt-5">
        {person.name}
      </p>
      <p className="text-primary/60 text-[0.8125rem] md:text-sm 3xl:text-base mt-1.5 leading-snug max-w-[12.5rem] 3xl:max-w-[16rem]">
        {person.role}
      </p>
    </motion.div>
  )
}

export default function PeopleSection() {
  const media = useMediaResolver()
  const { data: people } = useCMS(() => api.team(), FALLBACK_PEOPLE)
  const [selected, setSelected] = useState(null)

  return (
    <section className="bg-accent-cream pt-12 md:pt-16 pb-12 md:pb-16">
      {/* Section label + dotted divider */}
      <div className="px-6 md:px-10 lg:px-16 3xl:px-24 mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-2">
          <QuatrefoilMarker />
          <span className="text-[0.625rem] 3xl:text-sm font-normal tracking-[0.2em] uppercase text-secondary-terra">
            <Text k="about.people.label" />
          </span>
        </div>
        <div
          className="h-[0.125rem] w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56,113,122,0.4) 0.09375rem, transparent 0.09375rem)",
            backgroundSize: "0.5rem 0.1875rem",
          }}
        />
      </div>

      <div className="max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-[2.625rem] 3xl:text-[3.2rem] font-medium text-primary tracking-tight leading-[1.1] mb-12 md:mb-16"
        >
          <Text k="about.people.heading" />
        </motion.h2>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-primary/15 gap-y-10 md:gap-y-16 overflow-visible"
        >
          {people.map((person, i) => (
            <PersonCard
              key={person._id || `${person.name}-${i}`}
              person={person}
              onSelect={() => setSelected(person)}
            />
          ))}
        </motion.div>
      </div>

      {/* Profile detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl max-h-[90vh] overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-primary text-white hover:bg-primary/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row lg:items-start p-8 md:p-10 lg:p-12 gap-8 lg:gap-10 overflow-y-auto max-h-[90vh]">
                {/* Portrait — left column with floating ornaments */}
                <div className="flex-shrink-0 lg:w-[35%] relative">
                  <img
                    src={selected.photoUrl || media(selected.imgKey) || media("about.people.fallback3")}
                    alt={selected.name}
                    className="w-full h-64 sm:h-80 lg:h-auto object-cover object-top rounded-xl relative z-10"
                  />
                  {/* Float ornament — top-left, half behind image */}
                  {/* <motion.img
                    src={float2}
                    alt=""
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute -top-22 -left-22 w-28 md:w-36 lg:w-44 h-auto pointer-events-none z-0 "
                  /> */}
                  {/* Float ornament — bottom-right, half behind image */}
                  {/* <motion.img
                    src={float2}
                    alt=""
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    className="absolute -bottom-22 -right-18 w-28 md:w-36 lg:w-44 h-auto pointer-events-none z-0 "
                  /> */}
                </div>

                {/* Details — right column, scrollable */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-primary tracking-tight leading-tight">
                    {selected.name}
                  </h3>
                  <p className="text-base md:text-lg text-secondary-terra font-medium mt-2">
                    {selected.role}
                  </p>

                  {selected.description && (
                    <div className="mt-8 text-sm md:text-base text-primary/80 leading-[1.8] whitespace-pre-line">
                      {selected.description}
                    </div>
                  )}

                  {!selected.description && (
                    <p className="mt-8 text-base text-primary/40 italic">
                      <Text k="about.people.emptyBio" />
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
