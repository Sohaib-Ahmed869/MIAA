import { Link } from "react-router-dom"
import { motion } from "framer-motion"

/*
  Modern, on-brand empty states for the donor portal.
  Each illustration is a hand-built SVG using the MIAA palette:
    primary #214952 · terra #C15C45 · wheat #D7B893 · cream #F3EFEB · teal #38717A
*/

const float = (delay = 0) => ({
  animate: { y: [0, -6, 0] },
  transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay },
})

// Shared soft backdrop: cream disc + dashed terra ring
function Backdrop() {
  return (
    <>
      <circle cx="100" cy="92" r="70" fill="#F3EFEB" />
      <circle
        cx="100"
        cy="92"
        r="78"
        fill="none"
        stroke="#C15C45"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        strokeDasharray="3 7"
      />
    </>
  )
}

function Sparkle({ x, y, s = 6, color = "#D7B893" }) {
  // Coerced, because every call site writes x="150" as an attribute string and
  // `"150" + 1.5` is "1501.5" — the subtractions stayed numeric, so the shape
  // kept only its left half and the control points shot off the canvas as a
  // slab of colour instead of a four-point star.
  const cx = Number(x)
  const cy = Number(y)
  const arm = s * 0.25
  return (
    <path
      d={`M ${cx} ${cy - s} C ${cx + arm} ${cy - arm}, ${cx + arm} ${cy - arm}, ${cx + s} ${cy} C ${cx + arm} ${cy + arm}, ${cx + arm} ${cy + arm}, ${cx} ${cy + s} C ${cx - arm} ${cy + arm}, ${cx - arm} ${cy + arm}, ${cx - s} ${cy} C ${cx - arm} ${cy - arm}, ${cx - arm} ${cy - arm}, ${cx} ${cy - s} Z`}
      fill={color}
    />
  )
}

// `className` sizes the art. The portal's own empty states all sit inside cards
// at one size; the public donate page shows it at page scale, so the size is a
// prop rather than baked in.
function Illustration({ children, className = "w-44 h-40" }) {
  return (
    <svg viewBox="0 0 200 180" className={className} role="img" aria-hidden="true">
      <Backdrop />
      {children}
    </svg>
  )
}

export function ReceiptArt() {
  return (
    <Illustration>
      <motion.g {...float(0)}>
        {/* document */}
        <rect x="68" y="46" width="64" height="86" rx="7" fill="#FFFFFF" stroke="#214952" strokeOpacity="0.15" strokeWidth="1.5" />
        {/* folded corner */}
        <path d="M118 46 L132 60 L118 60 Z" fill="#E7E0D8" />
        {/* text lines */}
        <rect x="78" y="62" width="34" height="4.5" rx="2.25" fill="#214952" fillOpacity="0.55" />
        <rect x="78" y="74" width="44" height="3.5" rx="1.75" fill="#214952" fillOpacity="0.18" />
        <rect x="78" y="83" width="44" height="3.5" rx="1.75" fill="#214952" fillOpacity="0.18" />
        <rect x="78" y="92" width="30" height="3.5" rx="1.75" fill="#214952" fillOpacity="0.18" />
        {/* terra $ seal */}
        <circle cx="112" cy="116" r="13" fill="#C15C45" />
        <text x="112" y="121" textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFFFF" fontFamily="serif">$</text>
      </motion.g>
      <motion.g {...float(0.6)}>
        <circle cx="54" cy="70" r="7" fill="#D7B893" />
        <Sparkle x="150" y="58" s={7} color="#C15C45" />
      </motion.g>
      <Sparkle x="48" y="112" s={5} color="#38717A" />
    </Illustration>
  )
}

export function DonationArt({ className }) {
  return (
    <Illustration className={className}>
      {/* radiating rays */}
      <g stroke="#C15C45" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round">
        <line x1="100" y1="40" x2="100" y2="30" />
        <line x1="128" y1="48" x2="134" y2="40" />
        <line x1="72" y1="48" x2="66" y2="40" />
      </g>
      <motion.g {...float(0)}>
        {/* heart */}
        <path
          d="M100 128 C 68 104, 60 82, 74 70 C 84 61, 97 65, 100 76 C 103 65, 116 61, 126 70 C 140 82, 132 104, 100 128 Z"
          fill="#C15C45"
        />
        <path
          d="M88 80 C 90 74, 96 73, 99 78"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.5"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>
      {/* coins */}
      <motion.g {...float(0.7)}>
        <circle cx="54" cy="104" r="9" fill="#D7B893" />
        <text x="54" y="108" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7A3A42" fontFamily="serif">$</text>
      </motion.g>
      <Sparkle x="150" y="96" s={6} color="#38717A" />
      <Sparkle x="142" y="66" s={5} color="#D7B893" />
    </Illustration>
  )
}

export function RecurringArt() {
  return (
    <Illustration>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "100px 92px" }}>
        {/* circular arrows */}
        <path
          d="M100 54 A 38 38 0 1 1 62 92"
          fill="none"
          stroke="#38717A"
          strokeOpacity="0.35"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="4 10"
        />
        <path d="M100 46 l9 8 l-9 8 Z" fill="#38717A" fillOpacity="0.55" />
      </motion.g>
      <motion.g {...float(0)}>
        {/* inner heart */}
        <path
          d="M100 116 C 80 100, 75 86, 84 79 C 91 74, 98 77, 100 83 C 102 77, 109 74, 116 79 C 125 86, 120 100, 100 116 Z"
          fill="#C15C45"
        />
      </motion.g>
      {/* calendar dots */}
      <motion.g {...float(0.8)}>
        <circle cx="150" cy="66" r="6" fill="#D7B893" />
        <circle cx="52" cy="118" r="5" fill="#C15C45" fillOpacity="0.5" />
      </motion.g>
    </Illustration>
  )
}

export function CampaignArt() {
  return (
    <Illustration>
      <motion.g {...float(0)}>
        {/* flag pole */}
        <rect x="72" y="56" width="4.5" height="74" rx="2.25" fill="#214952" fillOpacity="0.6" />
        {/* flag */}
        <path d="M76 58 L128 58 C 132 58, 132 62, 128 64 L118 72 L128 80 C 132 82, 132 86, 128 86 L76 86 Z" fill="#C15C45" />
        <rect x="84" y="68" width="30" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.6" />
        {/* base progress bar */}
        <rect x="62" y="120" width="76" height="8" rx="4" fill="#214952" fillOpacity="0.12" />
        <rect x="62" y="120" width="40" height="8" rx="4" fill="#C15C45" />
      </motion.g>
      <motion.g {...float(0.6)}>
        <Sparkle x="146" y="70" s={7} color="#D7B893" />
        <circle cx="52" cy="88" r="6" fill="#38717A" fillOpacity="0.5" />
      </motion.g>
      <Sparkle x="150" y="104" s={5} color="#C15C45" />
    </Illustration>
  )
}

const ART = {
  receipt: ReceiptArt,
  donation: DonationArt,
  recurring: RecurringArt,
  campaign: CampaignArt,
}

/**
 * DonorEmptyState — a modern, illustrated empty state.
 *
 * props:
 *  - art: "receipt" | "donation" | "recurring" | "campaign"  (or pass `illustration` node)
 *  - title, description
 *  - action: { label, to?, href?, icon: LucideIcon }
 *  - compact: tighter vertical padding
 */
export default function DonorEmptyState({
  art,
  illustration,
  title,
  description,
  action,
  compact = false,
}) {
  const Art = art ? ART[art] : null
  const ActionIcon = action?.icon

  const btnCls =
    "inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary-terra hover:bg-secondary-rust text-white text-[0.625rem] tracking-[0.18em] uppercase font-semibold shadow-sm shadow-secondary-terra/30 transition-colors"

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`flex flex-col items-center text-center px-6 ${
        compact ? "py-10" : "py-14 md:py-20"
      }`}
    >
      <div className="mb-5">{illustration || (Art && <Art />)}</div>
      <h3
        className="text-xl md:text-2xl text-primary tracking-tight mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-primary/50 max-w-sm mb-7">{description}</p>
      {action &&
        (action.to ? (
          <Link to={action.to} className={btnCls}>
            {ActionIcon && <ActionIcon className="w-3.5 h-3.5" strokeWidth={2.25} />}
            {action.label}
          </Link>
        ) : (
          <a href={action.href} className={btnCls}>
            {ActionIcon && <ActionIcon className="w-3.5 h-3.5" strokeWidth={2.25} />}
            {action.label}
          </a>
        ))}
    </motion.div>
  )
}
