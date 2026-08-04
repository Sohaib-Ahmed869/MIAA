// Shared numeric-input sanitising, kept out of Field.jsx so that file only
// exports components (Fast Refresh requires it) and so this can be tested alone.

/**
 * Reduce typed text to the value a numeric field should hold.
 * Returns "" for an empty/unusable-but-clearable field, or null when the input
 * can't be used at all and the previous value should stand.
 */
export function toNumericText(raw, { min = 0, max } = {}) {
  // Digits and a single decimal point only. A stray "-" is exactly what let
  // prices and capacities go negative, so it never reaches the value at all.
  let cleaned = String(raw).replace(/[^0-9.]/g, "")
  const dot = cleaned.indexOf(".")
  if (dot !== -1) {
    cleaned = cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, "")
  }
  if (cleaned === "") return ""

  const n = Number(cleaned)
  if (Number.isNaN(n)) return null

  let clamped = n
  if (typeof min === "number" && clamped < min) clamped = min
  if (typeof max === "number" && clamped > max) clamped = max

  // Keep the raw text while it's already in range so "10." and "0.50" survive
  // mid-edit instead of being rewritten under the cursor.
  return clamped === n ? cleaned : String(clamped)
}
