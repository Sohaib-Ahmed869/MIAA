import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "../../../lib/motion"
import { ArrowUpRight } from "lucide-react"
import { useMediaResolver } from "../../../content/context"


const SECTION_BG = "#F3EFEB"
const INK         = "#124039"
const LIME        = "#CBCE58"
const ICON_COLOR  = "#4656CD"
const REGISTER_URL = "https://www.miaaustralia.org/smwf"

function CalendarIcon({ color = ICON_COLOR, className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M26 4H23V3C23 2.73478 22.8946 2.48043 22.7071 2.29289C22.5196 2.10536 22.2652 2 22 2C21.7348 2 21.4804 2.10536 21.2929 2.29289C21.1054 2.48043 21 2.73478 21 3V4H11V3C11 2.73478 10.8946 2.48043 10.7071 2.29289C10.5196 2.10536 10.2652 2 10 2C9.73478 2 9.48043 2.10536 9.29289 2.29289C9.10536 2.48043 9 2.73478 9 3V4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V26C4 26.5304 4.21071 27.0391 4.58579 27.4142C4.96086 27.7893 5.46957 28 6 28H26C26.5304 28 27.0391 27.7893 27.4142 27.4142C27.7893 27.0391 28 26.5304 28 26V6C28 5.46957 27.7893 4.96086 27.4142 4.58579C27.0391 4.21071 26.5304 4 26 4ZM9 6V7C9 7.26522 9.10536 7.51957 9.29289 7.70711C9.48043 7.89464 9.73478 8 10 8C10.2652 8 10.5196 7.89464 10.7071 7.70711C10.8946 7.51957 11 7.26522 11 7V6H21V7C21 7.26522 21.1054 7.51957 21.2929 7.70711C21.4804 7.89464 21.7348 8 22 8C22.2652 8 22.5196 7.89464 22.7071 7.70711C22.8946 7.51957 23 7.26522 23 7V6H26V10H6V6H9ZM26 26H6V12H26V26ZM17.5 16.5C17.5 16.7967 17.412 17.0867 17.2472 17.3334C17.0824 17.58 16.8481 17.7723 16.574 17.8858C16.2999 17.9993 15.9983 18.0291 15.7074 17.9712C15.4164 17.9133 15.1491 17.7704 14.9393 17.5607C14.7296 17.3509 14.5867 17.0836 14.5288 16.7926C14.4709 16.5017 14.5006 16.2001 14.6142 15.926C14.7277 15.6519 14.92 15.4176 15.1666 15.2528C15.4133 15.088 15.7033 15 16 15C16.3978 15 16.7794 15.158 17.0607 15.4393C17.342 15.7206 17.5 16.1022 17.5 16.5ZM23 16.5C23 16.7967 22.912 17.0867 22.7472 17.3334C22.5824 17.58 22.3481 17.7723 22.074 17.8858C21.7999 17.9993 21.4983 18.0291 21.2074 17.9712C20.9164 17.9133 20.6491 17.7704 20.4393 17.5607C20.2296 17.3509 20.0867 17.0836 20.0288 16.7926C19.9709 16.5017 20.0007 16.2001 20.1142 15.926C20.2277 15.6519 20.42 15.4176 20.6666 15.2528C20.9133 15.088 21.2033 15 21.5 15C21.8978 15 22.2794 15.158 22.5607 15.4393C22.842 15.7206 23 16.1022 23 16.5ZM12 21.5C12 21.7967 11.912 22.0867 11.7472 22.3334C11.5824 22.58 11.3481 22.7723 11.074 22.8858C10.7999 22.9993 10.4983 23.0291 10.2074 22.9712C9.91639 22.9133 9.64912 22.7704 9.43934 22.5607C9.22956 22.3509 9.0867 22.0836 9.02882 21.7926C8.97094 21.5017 9.00065 21.2001 9.11418 20.926C9.22771 20.6519 9.41997 20.4176 9.66665 20.2528C9.91332 20.088 10.2033 20 10.5 20C10.8978 20 11.2794 20.158 11.5607 20.4393C11.842 20.7206 12 21.1022 12 21.5ZM17.5 21.5C17.5 21.7967 17.412 22.0867 17.2472 22.3334C17.0824 22.58 16.8481 22.7723 16.574 22.8858C16.2999 22.9993 15.9983 23.0291 15.7074 22.9712C15.4164 22.9133 15.1491 22.7704 14.9393 22.5607C14.7296 22.3509 14.5867 22.0836 14.5288 21.7926C14.4709 21.5017 14.5006 21.2001 14.6142 20.926C14.7277 20.6519 14.92 20.4176 15.1666 20.2528C15.4133 20.088 15.7033 20 16 20C16.3978 20 16.7794 20.158 17.0607 20.4393C17.342 20.7206 17.5 21.1022 17.5 21.5ZM23 21.5C23 21.7967 22.912 22.0867 22.7472 22.3334C22.5824 22.58 22.3481 22.7723 22.074 22.8858C21.7999 22.9993 21.4983 23.0291 21.2074 22.9712C20.9164 22.9133 20.6491 22.7704 20.4393 22.5607C20.2296 22.3509 20.0867 22.0836 20.0288 21.7926C19.9709 21.5017 20.0007 21.2001 20.1142 20.926C20.2277 20.6519 20.42 20.4176 20.6666 20.2528C20.9133 20.088 21.2033 20 21.5 20C21.8978 20 22.2794 20.158 22.5607 20.4393C22.842 20.7206 23 21.1022 23 21.5Z" fill={color}/>
    </svg>
  )
}

function ClockIcon({ color = ICON_COLOR, className }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM16 27C13.8244 27 11.6977 26.3549 9.88873 25.1462C8.07979 23.9375 6.66989 22.2195 5.83733 20.2095C5.00477 18.1995 4.78693 15.9878 5.21137 13.854C5.63581 11.7202 6.68345 9.7602 8.22183 8.22183C9.76021 6.68345 11.7202 5.6358 13.854 5.21136C15.9878 4.78692 18.1995 5.00476 20.2095 5.83733C22.2195 6.66989 23.9375 8.07979 25.1462 9.88873C26.3549 11.6977 27 13.8244 27 16C26.9967 18.9164 25.8367 21.7123 23.7745 23.7745C21.7123 25.8367 18.9164 26.9967 16 27ZM24 16C24 16.2652 23.8946 16.5196 23.7071 16.7071C23.5196 16.8946 23.2652 17 23 17H16C15.7348 17 15.4804 16.8946 15.2929 16.7071C15.1054 16.5196 15 16.2652 15 16V9C15 8.73478 15.1054 8.48043 15.2929 8.29289C15.4804 8.10536 15.7348 8 16 8C16.2652 8 16.5196 8.10536 16.7071 8.29289C16.8946 8.48043 17 8.73478 17 9V15H23C23.2652 15 23.5196 15.1054 23.7071 15.2929C23.8946 15.4804 24 15.7348 24 16Z" fill={color}/>
    </svg>
  )
}

function LocationIcon({ color = ICON_COLOR, className }) {
  return (
    <svg viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M11 6C10.0111 6 9.0444 6.29325 8.2221 6.84265C7.3999 7.39206 6.759 8.173 6.3806 9.0866C6.0022 10.0002 5.9031 11.0055 6.0961 11.9755C6.289 12.9454 6.7652 13.8363 7.4645 14.5355C8.1637 15.2348 9.0546 15.711 10.0245 15.9039C10.9945 16.0969 11.9998 15.9978 12.9134 15.6194C13.827 15.241 14.6079 14.6001 15.1573 13.7779C15.7068 12.9556 16 11.9889 16 11C16 9.6739 15.4732 8.4021 14.5355 7.46447C13.5979 6.52678 12.3261 6 11 6ZM11 14C10.4067 14 9.8266 13.8241 9.3333 13.4944C8.8399 13.1648 8.4554 12.6962 8.2284 12.1481C8.0013 11.5999 7.9419 10.9967 8.0576 10.4147C8.1734 9.8328 8.4591 9.2982 8.8787 8.8787C9.2982 8.4591 9.8328 8.1734 10.4147 8.0576C10.9967 7.94189 11.5999 8.0013 12.1481 8.2284C12.6962 8.4554 13.1648 8.8399 13.4944 9.3333C13.8241 9.8266 14 10.4067 14 11C14 11.7956 13.6839 12.5587 13.1213 13.1213C12.5587 13.6839 11.7956 14 11 14ZM11 0C8.0836 0.00331 5.2877 1.1633 3.22548 3.22548C1.1633 5.28766 0.00331 8.0836 0 11C0 14.925 1.81375 19.085 5.25 23.0312C6.794 24.8145 8.5318 26.4202 10.4312 27.8188C10.5994 27.9365 10.7997 27.9997 11.005 27.9997C11.2103 27.9997 11.4106 27.9365 11.5788 27.8188C13.4747 26.4196 15.2091 24.8139 16.75 23.0312C20.1813 19.085 22 14.925 22 11C21.9967 8.0836 20.8367 5.28766 18.7745 3.22548C16.7123 1.1633 13.9164 0.00331 11 0ZM11 25.75C8.9337 24.125 2 18.1562 2 11C2 8.6131 2.94821 6.32387 4.63604 4.63604C6.3239 2.94821 8.6131 2 11 2C13.3869 2 15.6761 2.94821 17.364 4.63604C19.0518 6.32387 20 8.6131 20 11C20 18.1537 13.0663 24.125 11 25.75Z" fill={color}/>
    </svg>
  )
}

const SIDE_EVENTS = [
  {
    title: "Opening Night",
    date: "10th April 2026",
    time: "7pm – 9pm",
    venue: "Parramatta Town Hall",
    venueMap: "Parramatta Town Hall, 182 Church St, Parramatta NSW 2150",
    price: "$10",
    photoKeys: ["smwf.side.image1", "smwf.side.image2"],
  },
  {
    title: "Workshop Day",
    date: "19 April 2026",
    time: "10am – 1:30pm",
    venue: "ISRA Centre Sydney",
    venueMap: "ISRA Centre Sydney, 9 Cary St, Lidcombe NSW 2141",
    price: "$45",
    photoKeys: ["smwf.side.image3", "smwf.side.image4"],
  },
]

function InfoRow({ Icon, text, underline = false, map = null }) {
  const textClasses = `font-barlow text-sm md:text-base 2xl:text-lg 3xl:text-xl ${
    underline ? "underline underline-offset-4 decoration-1" : ""
  }`
  return (
    <li className="flex items-center gap-3 md:gap-4 2xl:gap-5">
      <Icon
        color={ICON_COLOR}
        className="w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7 flex-shrink-0"
      />
      {map ? (
        <div className="relative group">
          <span
            className={`${textClasses} cursor-pointer`}
            style={{ color: INK }}
          >
            {text}
          </span>
          <div className="absolute left-0 bottom-full mb-3 z-50 w-[300px] md:w-[360px] 3xl:w-[440px] opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10 bg-white">
              <iframe
                title={`Map — ${text}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(map)}&output=embed`}
                className="block w-full h-[220px] md:h-[260px] 3xl:h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      ) : (
        <span className={textClasses} style={{ color: INK }}>
          {text}
        </span>
      )}
    </li>
  )
}

function DottedVerticalLine() {
  return (
    <div
      aria-hidden
      className="absolute top-16 bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="block w-6 h-6 md:w-7 md:h-7 2xl:w-8 2xl:h-8 3xl:w-10 3xl:h-10 rounded-full"
          style={{ backgroundColor: SECTION_BG }}
        />
      ))}
    </div>
  )
}

function TicketCard({ event }) {
  const media = useMediaResolver()
  return (
    <motion.div
      {...staggerItem}
      className="relative bg-white overflow-visible"
    >
      <div className="flex flex-col lg:flex-row items-stretch min-h-[8rem] md:min-h-[9rem] lg:min-h-[10rem] 2xl:min-h-[11rem] 3xl:min-h-[13rem]">
        {/* LEFT — event info + photos */}
        <div className="flex-[3] p-7 md:p-10 2xl:p-12 3xl:p-14 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 2xl:gap-12 3xl:gap-16">
          {/* Info column */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-aeonik text-2xl md:text-3xl lg:text-[2.25rem] 2xl:text-[2.75rem] 3xl:text-5xl font-medium tracking-tight mb-5 md:mb-6 2xl:mb-7 3xl:mb-8"
              style={{ color: INK }}
            >
              {event.title}
            </h3>
            <ul className="space-y-2.5 md:space-y-3 2xl:space-y-3.5 3xl:space-y-4 mb-6 md:mb-8 2xl:mb-10 3xl:mb-12">
              <InfoRow Icon={CalendarIcon} text={event.date} />
              <InfoRow Icon={ClockIcon}    text={event.time} />
              <InfoRow Icon={LocationIcon} text={event.venue} underline map={event.venueMap} />
            </ul>
            <motion.a
              href={REGISTER_URL}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 2xl:gap-2.5 px-6 md:px-7 2xl:px-9 3xl:px-10 py-3 md:py-3.5 2xl:py-4 3xl:py-5 font-aeonik text-[0.6875rem] md:text-xs 2xl:text-sm 3xl:text-base font-semibold tracking-[0.18em] uppercase rounded-none"
              style={{ backgroundColor: LIME, color: INK }}
            >
              Download Full Programme
            </motion.a>
          </div>

          {/* Circular photos — separated, no overlap */}
          <div className="flex items-center justify-center gap-3 md:gap-5 2xl:gap-6 3xl:gap-8 flex-shrink-0">
            {event.photoKeys.map((photoKey, i) => (
              <div
                key={i}
                className="aspect-square w-24 md:w-32 lg:w-40 2xl:w-48 3xl:w-56 rounded-full overflow-hidden shrink-0"
              >
                <img
                  src={media(photoKey)}
                  alt=""
                  aria-hidden="true"
                  className="block w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE — perforated divider with triangular notches at top and bottom */}
        <div className="relative hidden lg:block w-px self-stretch flex-shrink-0">
          <DottedVerticalLine />
          {/* Top notch — rounded diamond cutout (rotated square with soft corners) */}
          <span
            aria-hidden
            className="absolute top-0 left-1/2 z-20"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: SECTION_BG,
              borderRadius: "10px",
              transform: "translate(-50%, -50%) rotate(45deg)",
            }}
          />
          {/* Bottom notch — rounded diamond cutout */}
          <span
            aria-hidden
            className="absolute bottom-0 left-1/2 z-20"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: SECTION_BG,
              borderRadius: "10px",
              transform: "translate(-50%, 50%) rotate(45deg)",
            }}
          />
        </div>

        {/* RIGHT — price + register */}
        <div className="flex-1 p-7 md:p-10 2xl:p-12 3xl:p-14 flex flex-col justify-between gap-5 md:gap-6 2xl:gap-7 3xl:gap-9 border-t lg:border-t-0 border-[#1240391a]">
          <div className="text-right">
            <p
              className="font-aeonik text-4xl md:text-5xl lg:text-6xl 2xl:text-[4rem] 3xl:text-7xl font-medium leading-none"
              style={{ color: INK }}
            >
              {event.price}
            </p>
            <p
              className="font-barlow text-xs md:text-sm 2xl:text-[0.9375rem] 3xl:text-base mt-2"
              style={{ color: "rgba(18,64,57,0.65)" }}
            >
              per person
            </p>
          </div>

          <div className="flex items-stretch gap-2 md:gap-2.5 3xl:gap-3">
            <motion.a
              href={REGISTER_URL}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex-1 inline-flex items-center justify-center px-7 md:px-8 2xl:px-10 3xl:px-12 py-3 md:py-3.5 2xl:py-4 3xl:py-5 font-aeonik text-xs md:text-sm 2xl:text-base 3xl:text-lg font-semibold tracking-[0.18em] uppercase rounded-none"
              style={{ backgroundColor: LIME, color: INK }}
            >
              Register
            </motion.a>
            <motion.a
              href={REGISTER_URL}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label="Register"
              className="inline-flex items-center justify-center aspect-square px-3 md:px-3.5 2xl:px-4 3xl:px-5 rounded-none"
              style={{ backgroundColor: "rgba(18,64,57,0.06)", color: INK }}
            >
              <ArrowUpRight
                className="w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7"
                strokeWidth={2}
              />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SMWFSideEventsSection() {
  return (
    <section
      id="smwf-side-events"
      className="pt-4 md:pt-5 lg:pt-6 2xl:pt-8 3xl:pt-10 pb-20 md:pb-24 lg:pb-28 2xl:pb-32 3xl:pb-40"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 2xl:px-20 3xl:px-24">
        <motion.div
          {...staggerContainer}
          className="space-y-1 md:space-y-1.5 2xl:space-y-2 3xl:space-y-2.5"
        >
          {SIDE_EVENTS.map((e) => (
            <TicketCard key={e.title} event={e} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
