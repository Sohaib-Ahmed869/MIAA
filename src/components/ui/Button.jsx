import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import clsx from "clsx"

const MotionLink = motion.create(Link)

const springTransition = { type: "spring", stiffness: 400, damping: 20 }

export default function CTAButton({
  children,
  to,
  href,
  icon: Icon = ArrowUpRight,
  showArrow = true,
  className,
  scaleY = 1.15,
  ...props
}) {
  const base = clsx(
    "group relative inline-flex items-center gap-1.5 px-5 py-2.5",
    "bg-secondary-terra text-white font-barlow text-[0.6875rem] 3xl:text-sm font-semibold",
    "tracking-[0.15em] uppercase rounded-sm overflow-hidden 3xl:px-7 3xl:py-3.5 3xl:gap-2",
    "transition-colors duration-200",
    className,
  )

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: springTransition,
  }

  const content = (
    <>
      <span
        className="relative z-10 inline-block"
        style={{ transform: `scaleY(${scaleY})`, transformOrigin: "center" }}
      >
        {children}
      </span>
      {showArrow && (
        <span className="pointer-events-none relative z-10 inline-flex overflow-hidden w-[13px] h-[13px] 3xl:w-4 3xl:h-4">
          {/* Default arrow — slides out top-right on hover */}
          <Icon
            className="w-3.5 h-3.5"
            strokeWidth={2.5}
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full"
          />
          {/* Clone arrow — slides in from bottom-left on hover */}
          <Icon
            className="w-3.5 h-3.5"
            strokeWidth={2.5}
            className="absolute inset-0 w-full h-full -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
      )}
      {/* Background sweep on hover */}
      <span className="pointer-events-none absolute inset-0 bg-secondary-rust origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
    </>
  )

  if (to) {
    return (
      <MotionLink to={to} className={base} {...motionProps} {...props}>
        {content}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <motion.a href={href} className={base} {...motionProps} {...props}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button className={base} {...motionProps} {...props}>
      {content}
    </motion.button>
  )
}
