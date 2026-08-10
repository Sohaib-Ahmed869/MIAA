// Event dates are stored as free text ("07.02.26", "TBA"), so display is
// best-effort: anything we can't read is shown exactly as it was entered.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/** "07.02.26" → "7 February 2026". Unreadable input comes back untouched. */
export function formatEventDate(dateStr) {
  if (!dateStr || dateStr === "TBA") return dateStr
  const parts = String(dateStr).split(".")
  if (parts.length !== 3) return dateStr
  const [day, month, year] = parts
  const monthName = MONTHS[parseInt(month, 10) - 1]
  if (!monthName) return dateStr
  return `${parseInt(day, 10)} ${monthName} ${year.length === 2 ? `20${year}` : year}`
}
