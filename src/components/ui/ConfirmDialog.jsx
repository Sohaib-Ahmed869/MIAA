import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

// Promise-based confirmation modal, replacing native window.confirm().
// Usage:
//   const confirm = useConfirm()
//   if (!(await confirm({ title, message, danger: true }))) return
const ConfirmContext = createContext(() => Promise.resolve(false))

export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback(
    (opts = {}) =>
      new Promise((resolve) => {
        resolver.current = resolve
        setOptions(opts)
      }),
    [],
  )

  const settle = (result) => {
    if (resolver.current) resolver.current(result)
    resolver.current = null
    setOptions(null)
  }

  // Close on Escape while open.
  useEffect(() => {
    if (!options) return
    const onKey = (e) => {
      if (e.key === "Escape") settle(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [options])

  const o = options || {}

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {options && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
              onClick={() => settle(false)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border border-primary/10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-3.5">
                  <span
                    className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full ${
                      o.danger
                        ? "bg-rose-50 text-rose-600"
                        : "bg-secondary-terra/10 text-secondary-terra"
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3
                      className="text-base font-medium text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {o.title || "Are you sure?"}
                    </h3>
                    {o.message && (
                      <p className="text-sm text-primary/60 mt-1.5 leading-relaxed">
                        {o.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 px-6 py-4 bg-accent-cream/50 border-t border-primary/8">
                <button
                  onClick={() => settle(false)}
                  className="px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-primary/60 hover:text-primary rounded-sm transition-colors"
                >
                  {o.cancelLabel || "Cancel"}
                </button>
                <button
                  autoFocus
                  onClick={() => settle(true)}
                  className={`px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-white rounded-sm transition-colors ${
                    o.danger
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-secondary-terra hover:bg-secondary-rust"
                  }`}
                >
                  {o.confirmLabel || "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  return useContext(ConfirmContext)
}
