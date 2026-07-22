import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

// A small, theme-aware custom dropdown to replace native <select>.
// options: [{ value, label, dot? }]   dot = tailwind bg-* class for a status pill.
export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  theme = "light", // "light" (admin) | "dark" (public checkout)
  fullWidth = false,
  className = "",
  buttonClassName = "",
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)
  const dark = theme === "dark"

  const btnCls = dark
    ? "bg-white/[0.06] text-accent-cream border-white/10 hover:border-white/25 focus:border-secondary-terra focus:ring-secondary-terra/25"
    : "bg-white text-primary border-primary/15 hover:border-primary/30 focus:border-secondary-terra/70 focus:ring-secondary-terra/30"

  const menuCls = dark
    ? "bg-[#214952] border-white/10"
    : "bg-white border-primary/12"

  const placeholderCls = dark ? "text-accent-cream/40" : "text-primary/40"
  const chevronCls = dark ? "text-accent-cream/50" : "text-primary/40"

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : "inline-block"} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm rounded-sm border transition-colors focus:outline-none focus:ring-1 ${btnCls} ${buttonClassName}`}
      >
        <span className={`flex items-center gap-2 truncate ${!selected ? placeholderCls : ""}`}>
          {selected?.dot && (
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected.dot}`} />
          )}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${chevronCls}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={`absolute z-40 mt-1.5 w-full max-h-64 overflow-auto rounded-sm border shadow-lg py-1 ${menuCls}`}
          >
            {options.map((o) => {
              const active = o.value === value
              return (
                <li key={o.value ?? o.label} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      dark ? "hover:bg-white/10" : "hover:bg-accent-cream/60"
                    } ${
                      active
                        ? "text-secondary-terra font-medium"
                        : dark
                          ? "text-accent-cream/85"
                          : "text-primary"
                    }`}
                  >
                    {o.dot && (
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${o.dot}`} />
                    )}
                    <span className="flex-1 truncate">{o.label}</span>
                    {active && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                </li>
              )
            })}
            {options.length === 0 && (
              <li
                className={`px-3 py-2 text-sm ${dark ? "text-accent-cream/40" : "text-primary/40"}`}
              >
                No options
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
