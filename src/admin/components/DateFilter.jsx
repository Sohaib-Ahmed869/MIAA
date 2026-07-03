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
      <div className="flex items-center gap-2 flex-wrap">
        <CalendarDays className="w-3.5 h-3.5 text-primary/35" strokeWidth={1.75} />
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className={`px-3 py-1.5 text-[0.5625rem] tracking-[0.18em] uppercase rounded-sm border transition-colors ${
              value.preset === p.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary/60 border-primary/12 hover:border-primary/30"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-end gap-3 pl-6">
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
