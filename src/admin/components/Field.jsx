import { useState } from "react"
import { toNumericText } from "./numeric"

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[0.6875rem] text-primary/50 mt-1">{hint}</span>}
    </label>
  )
}

// Radius is a separate prop rather than part of the base string so a screen can
// opt into a softer corner without two competing `rounded-*` classes, whose
// winner would depend on Tailwind's stylesheet order rather than this file.
const baseInput =
  "block w-full px-3 py-2.5 text-sm text-primary bg-white border border-primary/15 placeholder:text-primary/35 focus:outline-none focus:border-secondary-terra/70 focus:ring-1 focus:ring-secondary-terra/30 transition-colors"

export function TextInput({ radius = "rounded-sm", ...props }) {
  return <input className={`${baseInput} ${radius}`} {...props} />
}

// Typed numeric field. Every number in the admin is a price, count, capacity or
// sort order, so a negative is never a valid value — the floor is 0 unless a
// caller raises it with `min`. Deliberately not `type="number"`: its spinner
// arrows made it far too easy to walk a capacity below zero by accident, and
// these are values you type rather than nudge one at a time.
//
// While the field has focus it keeps exactly what you typed — including empty —
// instead of snapping back to 0 on every keystroke, which made clearing a value
// to type a new one almost impossible.
export function NumberInput({
  min = 0,
  max,
  value,
  onChange,
  onFocus,
  onBlur,
  radius = "rounded-sm",
  className = "",
  ...props
}) {
  const [draft, setDraft] = useState("")
  const [editing, setEditing] = useState(false)

  const asText = (v) => (v === undefined || v === null ? "" : String(v))

  const clamp = (n) => {
    let v = n
    if (typeof min === "number" && v < min) v = min
    if (typeof max === "number" && v > max) v = max
    return v
  }

  const handleChange = (e) => {
    const text = toNumericText(e.target.value, { min, max })
    if (text === null) return
    setDraft(text)
    onChange?.({ target: { value: text } })
  }

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      className={`${baseInput} ${radius} ${className}`}
      value={editing ? draft : asText(value)}
      onChange={handleChange}
      onFocus={(e) => {
        setDraft(asText(value))
        setEditing(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setEditing(false)
        // Settle anything left below the floor — clearing a "max people" field
        // and tabbing away would otherwise leave a 0 sitting where 1 is the
        // smallest legal value.
        const n = Number(value)
        const settled = clamp(Number.isNaN(n) ? min : n)
        if (settled !== n) onChange?.({ target: { value: String(settled) } })
        onBlur?.(e)
      }}
    />
  )
}

export function TextArea({ radius = "rounded-sm", ...props }) {
  return <textarea className={`${baseInput} ${radius} resize-none`} {...props} />
}

export function Select({ children, radius = "rounded-sm", ...props }) {
  return (
    <select
      className={`${baseInput} ${radius} appearance-none cursor-pointer pr-8`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
      <span
        className={`w-4 h-4 rounded-sm border transition-colors ${
          checked ? "bg-secondary-terra border-secondary-terra" : "bg-white border-primary/30"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="w-full h-full text-white">
            <path d="M3 8l3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {label}
    </label>
  )
}
