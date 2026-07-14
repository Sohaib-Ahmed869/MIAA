import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import Button from "./Button"

/**
 * Branded confirmation modal — a styled replacement for window.confirm().
 * Controlled via `open`; calls `onConfirm` / `onClose`. Esc and backdrop click cancel.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  variant = "danger",
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, busy, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !busy && onClose()}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60]"
          />
          {/* Dialog */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="pointer-events-auto w-full max-w-[26rem] bg-white rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="px-6 pt-6 pb-5 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-lg text-primary tracking-tight leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </p>
                  {message && (
                    <p className="text-sm text-primary/60 mt-1.5 leading-relaxed">{message}</p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-primary/10 bg-accent-cream/60 flex items-center justify-end gap-3">
                <Button onClick={onClose} variant="ghost" disabled={busy}>
                  {cancelLabel}
                </Button>
                <Button onClick={onConfirm} variant={variant} disabled={busy}>
                  {busy ? "Deleting…" : confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
