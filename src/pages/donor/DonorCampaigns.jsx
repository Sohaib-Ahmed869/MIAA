import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Megaphone, Plus, Target, LayoutGrid, LayoutList } from "lucide-react"
import { donorApi } from "../../lib/donorAuth"
import { StatusBadge, LiveCampaignLink } from "../../components/campaign/campaignStatus"
import DonorEmptyState from "../../components/donor/DonorEmptyState"

// Filter tabs → which campaign statuses each includes
const TABS = [
  { key: "all", label: "All", statuses: null },
  { key: "draft", label: "Pending", statuses: ["draft"] },
  { key: "active", label: "Live", statuses: ["active"] },
  { key: "completed", label: "Completed", statuses: ["completed"] },
  { key: "rejected", label: "Not Approved", statuses: ["rejected"] },
  { key: "closed", label: "Paused / Closed", statuses: ["paused", "cancelled"] },
]

const VIEW_KEY = "miaa_donor_campaign_view"

function CampaignCard({ c, view }) {
  const goal = c.goalAmount || 0
  const raised = c.raisedAmount || 0
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
  const showProgress = goal > 0 && (c.status === "active" || c.status === "completed")
  const grid = view === "grid"

  const image = c.imageUrl ? (
    <img
      src={c.imageUrl}
      alt={c.title}
      className={grid ? "w-full aspect-[16/10] object-cover" : "w-24 h-20 object-cover rounded-lg flex-shrink-0"}
    />
  ) : (
    <div
      className={`bg-accent-cream grid place-items-center flex-shrink-0 ${
        grid ? "w-full aspect-[16/10]" : "w-24 h-20 rounded-lg"
      }`}
    >
      <Megaphone className={grid ? "w-7 h-7 text-primary/20" : "w-5 h-5 text-primary/20"} />
    </div>
  )

  const body = (
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-primary truncate">{c.title}</p>
        {!grid && <StatusBadge status={c.status} />}
      </div>
      <p className="text-[0.8125rem] text-primary/55 line-clamp-2 mt-1">{c.description}</p>

      {showProgress && (
        <div className="mt-2.5">
          <div className="h-1.5 rounded-full bg-primary/8 overflow-hidden">
            <div className="h-full rounded-full bg-secondary-terra" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1 text-[0.6875rem] text-primary/50">
            <span className="font-medium text-primary/70">${(raised / 100).toLocaleString()} raised</span>
            <span>{pct}% of ${(goal / 100).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-1.5 text-[0.6875rem] text-primary/40">
        {goal > 0 && !showProgress && (
          <span className="inline-flex items-center gap-1">
            <Target className="w-3 h-3" /> Goal ${(goal / 100).toLocaleString()}
          </span>
        )}
        <span>Requested {new Date(c.createdAt).toLocaleDateString("en-AU")}</span>
      </div>

      {c.status === "rejected" && c.reviewNote && (
        <p className="mt-2 text-[0.75rem] text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1.5">
          <span className="font-semibold">Team note:</span> {c.reviewNote}
        </p>
      )}
      {c.status === "active" && <LiveCampaignLink campaign={c} />}
    </div>
  )

  const cardCls =
    "group bg-white border border-primary/10 hover:border-secondary-terra/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 overflow-hidden"

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
      className={grid ? `${cardCls} rounded-2xl flex flex-col` : `${cardCls} rounded-xl flex gap-4 items-start p-4`}
    >
      {grid ? (
        <>
          <div className="relative">
            {image}
            <div className="absolute top-2.5 right-2.5">
              <StatusBadge status={c.status} />
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">{body}</div>
        </>
      ) : (
        <>
          {image}
          {body}
        </>
      )}
    </motion.div>
  )
}

export default function DonorCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("all")
  const [view, setView] = useState(() => localStorage.getItem(VIEW_KEY) || "grid")

  const changeView = (v) => {
    setView(v)
    localStorage.setItem(VIEW_KEY, v)
  }

  useEffect(() => {
    let active = true
    donorApi
      .myCampaignRequests()
      .then((data) => {
        if (active) setCampaigns(Array.isArray(data) ? data : [])
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Count per tab for the pill badges
  const counts = useMemo(() => {
    const c = {}
    for (const t of TABS) {
      c[t.key] = t.statuses
        ? campaigns.filter((x) => t.statuses.includes(x.status)).length
        : campaigns.length
    }
    return c
  }, [campaigns])

  const activeTab = TABS.find((t) => t.key === tab) || TABS[0]
  const filtered = activeTab.statuses
    ? campaigns.filter((c) => activeTab.statuses.includes(c.status))
    : campaigns

  return (
    <div>
      {/* Header row with CTA */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-sm text-primary/55">
          Track every campaign you've proposed and its review status.
        </p>
        <Link
          to="/donor/campaign-request"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary-terra hover:bg-secondary-rust text-white text-[0.625rem] tracking-[0.18em] uppercase font-semibold shadow-sm shadow-secondary-terra/30 transition-colors flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} /> New Campaign
        </Link>
      </div>

      {/* Filter tabs + view toggle */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="inline-flex items-center gap-0.5 flex-wrap bg-white border border-primary/10 rounded-full p-1 shadow-sm shadow-primary/5">
          {TABS.map((t) => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[0.625rem] tracking-[0.18em] uppercase rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "text-primary/55 hover:bg-primary/[0.06] hover:text-primary"
                }`}
              >
                {t.label}
                <span
                  className={`min-w-[1.1rem] px-1 text-center rounded-full text-[0.5625rem] leading-[1.05rem] ${
                    isActive ? "bg-white/20 text-white" : "bg-primary/8 text-primary/50"
                  }`}
                >
                  {counts[t.key] || 0}
                </span>
              </button>
            )
          })}
        </div>

        {/* View toggle */}
        <div className="inline-flex items-center gap-0.5 bg-white border border-primary/10 rounded-full p-1 shadow-sm shadow-primary/5">
          {[
            { key: "list", icon: LayoutList, label: "List view" },
            { key: "grid", icon: LayoutGrid, label: "Grid view" },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => changeView(v.key)}
              aria-label={v.label}
              aria-pressed={view === v.key}
              className={`grid place-items-center w-8 h-8 rounded-full transition-colors duration-200 ${
                view === v.key
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "text-primary/45 hover:bg-primary/[0.06] hover:text-primary"
              }`}
            >
              <v.icon className="w-4 h-4" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-4 3xl:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-primary/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-primary/5 animate-pulse" />
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-primary/15 rounded-2xl">
          <DonorEmptyState
            art="campaign"
            title={tab === "all" ? "No campaigns yet" : "Nothing here"}
            description={
              tab === "all"
                ? "Propose a cause you care about and our team will review it for you."
                : "You have no campaigns with this status right now."
            }
            action={
              tab === "all"
                ? { label: "Request a Campaign", to: "/donor/campaign-request", icon: Plus }
                : undefined
            }
          />
        </div>
      ) : (
        <motion.div
          key={view}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-4 3xl:gap-6"
              : "flex flex-col gap-3"
          }
        >
          {filtered.map((c) => (
            <CampaignCard key={c._id} c={c} view={view} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
