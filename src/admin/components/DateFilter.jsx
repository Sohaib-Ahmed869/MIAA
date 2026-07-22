import { useState } from "react"
import { CalendarDays } from "lucide-react"

const PRESETS = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "15 Days", value: "15d" },
  { label: "30 Days", value: "30d" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
]

function getDateRange(preset) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (preset) {
    case "today":
      return { startDate: startOfDay.toISOString(), endDate: now.toISOString() }
    case "7d":
      return {
        startDate: new Date(startOfDay - 7 * 86400000).toISOString(),
        endDate: now.toISOString(),
      }
    case "15d":
      return {
        startDate: new Date(startOfDay - 15 * 86400000).toISOString(),
        endDate: now.toISOString(),
      }
    case "30d":
      return {
        startDate: new Date(startOfDay - 30 * 86400000).toISOString(),
        endDate: now.toISOString(),
      }
    case "week": {
      const day = startOfDay.getDay()
      const monday = new Date(startOfDay - ((day === 0 ? 6 : day - 1) * 86400000))
      return { startDate: monday.toISOString(), endDate: now.toISOString() }
    }
    case "month": {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return { startDate: firstOfMonth.toISOString(), endDate: now.toISOString() }
    }
    default:
      return { startDate: "", endDate: "" }
  }
}

export default function DateFilter({ value, onChange }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const handlePreset = (preset) => {
    if (preset === "custom") {
      setShowCustom(true)
      return
    }
    setShowCustom(false)
    const range = preset === "all" ? { startDate: "", endDate: "" } : getDateRange(preset)
    onChange({ preset, ...range })
  }

  const handleCustomApply = () => {
    onChange({
      preset: "custom",
      startDate: customStart ? new Date(customStart).toISOString() : "",
      endDate: customEnd ? new Date(customEnd + "T23:59:59").toISOString() : "",
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-0.5 flex-nowrap overflow-x-auto no-scrollbar max-w-full bg-white border border-primary/10 rounded-full p-1 shadow-sm shadow-primary/5">
        <span className="grid place-items-center w-7 h-7 rounded-full text-primary/40 flex-shrink-0">
          <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className={`flex-shrink-0 whitespace-nowrap px-3.5 py-1.5 text-[0.5625rem] tracking-[0.18em] uppercase rounded-full transition-all duration-200 ${
              value.preset === p.value
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-primary/55 hover:bg-primary/[0.06] hover:text-primary"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex flex-wrap items-end gap-3 pl-2">
          <div>
            <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-primary/40 mb-1">
              From
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="py-1.5 px-3 bg-white border border-primary/12 text-xs text-primary rounded-sm focus:border-secondary-terra focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-primary/40 mb-1">
              To
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="py-1.5 px-3 bg-white border border-primary/12 text-xs text-primary rounded-sm focus:border-secondary-terra focus:outline-none"
            />
          </div>
          <button
            onClick={handleCustomApply}
            className="px-4 py-1.5 bg-primary text-white text-[0.5625rem] tracking-[0.18em] uppercase rounded-sm hover:bg-bg-deep transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
