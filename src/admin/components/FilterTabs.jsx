/**
 * FilterTabs — the standard admin segmented-pill filter.
 *
 * A white rounded-full container holding pill options; the active option is
 * filled teal. Matches the DateFilter styling for a consistent admin look.
 *
 * props:
 *  - options: Array<{ value, label, count?, dot? }>  (dot = a tailwind bg class)
 *  - value: currently-selected value
 *  - onChange: (value) => void
 *  - className: extra classes on the container
 */
export default function FilterTabs({ options, value, onChange, className = "" }) {
  return (
    <div
      className={`flex items-center gap-0.5 flex-nowrap overflow-x-auto no-scrollbar max-w-full bg-white border border-primary/10 rounded-full p-1 shadow-sm shadow-primary/5 ${className}`}
    >
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`inline-flex flex-shrink-0 whitespace-nowrap items-center gap-1.5 px-4 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase rounded-full transition-all duration-200 ${
              isActive
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-primary/55 hover:bg-primary/[0.06] hover:text-primary"
            }`}
          >
            {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
            {opt.label}
            {opt.count != null && (
              <span
                className={`min-w-[1.1rem] px-1 text-center rounded-full text-[0.5625rem] leading-[1.05rem] ${
                  isActive ? "bg-white/20 text-white" : "bg-primary/8 text-primary/50"
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * PillToggle — a single standalone pill button matching FilterTabs, for
 * on/off toggles (e.g. "Show archived").
 */
export function PillToggle({ active, onClick, children, activeClass = "bg-primary text-white shadow-sm shadow-primary/20" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase rounded-full border transition-all duration-200 ${
        active
          ? `${activeClass} border-transparent`
          : "bg-white text-primary/55 border-primary/10 hover:bg-primary/[0.06] hover:text-primary"
      }`}
    >
      {children}
    </button>
  )
}
