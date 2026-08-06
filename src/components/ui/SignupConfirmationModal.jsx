import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

/**
 * Confirmation modal shown after a successful sign-up / registration.
 * Copy is fixed to the wording the client asked for, but can be overridden.
 */
export default function SignupConfirmationModal({
  open,
  onClose,
  title = "Thank you for registering!",
  lines = [
    "Please check your email for a confirmation message.",
    "As part of signing up, we’ve added you to our contact list, you can unsubscribe anytime.",
  ],
  closeLabel = "Done",
}) {
  // Close on Escape while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={() => onClose?.()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border border-primary/10 overflow-hidden"
          >
            <div className="p-6 md:p-7">
              <div className="flex items-start gap-3.5">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3
                    className="text-base font-medium text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <div className="mt-2 space-y-2.5">
                    {lines.map((line, i) => (
                      <p key={i} className="text-sm text-primary/65 leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 bg-accent-cream/50 border-t border-primary/8">
              <button
                autoFocus
                onClick={() => onClose?.()}
                className="px-5 py-2 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-white rounded-sm bg-secondary-terra hover:bg-secondary-rust transition-colors"
              >
                {closeLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
