import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Users, Ticket, DollarSign, CheckCircle2, Download } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import { SkeletonCardGrid } from "../components/Skeleton"
import FilterTabs from "../components/FilterTabs"
import Dropdown from "../../components/ui/Dropdown"
import RegistrationDetail from "../components/RegistrationDetail"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"

const STATUS_COLORS = {
  succeeded: "bg-emerald-500/90 text-white",
  free: "bg-sky-500/90 text-white",
  pending: "bg-amber-500/90 text-white",
  failed: "bg-rose-500/90 text-white",
  refunded: "bg-primary/60 text-white",
}

const money = (cents) => `$${((cents || 0) / 100).toFixed(2)}`

// Soft avatar tints for the mobile registration cards.
const AVATAR_TINTS = [
  "bg-secondary-terra/12 text-secondary-terra",
  "bg-primary/10 text-primary",
  "bg-secondary-amber/15 text-secondary-amber",
  "bg-accent-sage/30 text-primary",
]

// Who scanned the pass at the door. Older check-ins predate attribution.
const checkedInByLabel = (r) => {
  const by = r.checkedInBy
  if (!by) return "—"
  if (by.name) return by.name
  return by.role === "volunteer" ? "Volunteer" : "MIAA staff"
}

const initials = (name) =>
  (name || "Guest")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?"

export default function EventRegistrationsAdmin() {
  const [rows, setRows] = useState([])
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState("all")
  const [eventId, setEventId] = useState("")
  const [checkin, setCheckin] = useState("all")
  const [viewing, setViewing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  // Build the query params from the active filters — shared by the list fetch
  // and the CSV export so the download always matches what's on screen.
  const filterParams = () => {
    const params = {}
    if (status !== "all") params.status = status
    if (eventId) params.event = eventId
    if (checkin !== "all") params.checkedIn = checkin === "in" ? "true" : "false"
    return params
  }

  const exportCsv = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const { blob, filename } = await adminApi.exportEventRegistrations(filterParams())
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      notify("Registrations exported")
    } catch (err) {
      notify(err.message || "Export failed", "error")
    } finally {
      setExporting(false)
    }
  }

  const load = () => {
    const params = filterParams()
    return adminApi
      .listEventRegistrations(params)
      .then((data) => {
        setRows(data)
        setError("")
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    const params = {}
    if (status !== "all") params.status = status
    if (eventId) params.event = eventId
    if (checkin !== "all") params.checkedIn = checkin === "in" ? "true" : "false"
    Promise.all([
      adminApi.listEventRegistrations(params),
      adminApi.listEvents(),
    ])
      .then(([regs, evs]) => {
        if (!active) return
        setRows(regs)
        setEvents(evs)
        setError("")
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [status, eventId, checkin])

  const stats = useMemo(() => {
    const confirmed = rows.filter(
      (r) => r.paymentStatus === "succeeded" || r.paymentStatus === "free"
    )
    const seats = confirmed.reduce((s, r) => s + (r.quantity || 0), 0)
    const collected = rows
      .filter((r) => r.paymentStatus === "succeeded")
      .reduce((s, r) => s + (r.amount || 0), 0)
    return { registrations: rows.length, seats, collected }
  }, [rows])

  const markRefunded = async (reg) => {
    if (
      !(await confirm({
        title: "Mark this registration refunded?",
        message: "This updates the record only. Issue the actual refund in Stripe.",
        confirmLabel: "Mark refunded",
        danger: true,
      }))
    )
      return
    try {
      await adminApi.updateEventRegistration(reg._id, { paymentStatus: "refunded" })
      notify("Registration marked refunded")
      setViewing(null)
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  // Deleting returns the seats to the event, so spell out how many are coming
  // back — on a group booking that's more than the one row being removed.
  const deleteRegistration = async (reg) => {
    const counted = ["free", "succeeded", "refunded"].includes(reg.paymentStatus)
    const seats = counted ? reg.quantity || 1 : 0
    if (
      !(await confirm({
        title: "Delete this registration?",
        message: `${reg.name || "This attendee"} will be removed permanently and this can't be undone.${
          seats > 0
            ? ` ${seats} place${seats === 1 ? "" : "s"} will be returned to the event.`
            : ""
        }${
          reg.paymentStatus === "succeeded"
            ? " This does not refund the payment — issue that in Stripe."
            : ""
        }`,
        confirmLabel: "Delete",
        danger: true,
      }))
    )
      return
    try {
      await adminApi.deleteEventRegistration(reg._id)
      notify("Registration deleted")
      setViewing(null)
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const statCards = [
    { label: "Registrations", value: stats.registrations, icon: Users },
    { label: "Seats", value: stats.seats, icon: Ticket },
    { label: "Collected", value: money(stats.collected), icon: DollarSign },
  ]

  return (
    <div>
      <PageHeader
        label="Registrations"
        title="Event Registrations"
        subtitle="Attendees who registered for events — free RSVPs and paid tickets."
        actions={
          <Button
            onClick={exportCsv}
            variant="dark"
            disabled={exporting || rows.length === 0}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        }
      />

      {/* Stats — full-width rows on phones, 3-up tiles on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-primary/10 rounded-sm px-4 py-3.5 sm:p-5 flex items-center justify-between gap-3 sm:block"
          >
            <div className="flex items-center gap-2 sm:mb-2">
              <s.icon
                className="w-4 h-4 text-secondary-terra flex-shrink-0"
                strokeWidth={1.75}
              />
              <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                {s.label}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-medium text-primary tabular-nums whitespace-nowrap">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-500/8 ring-1 ring-inset ring-rose-500/20 rounded-lg px-4 py-2.5 mb-4">
          {error}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between mb-6">
        <FilterTabs
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "succeeded", label: "Paid", dot: "bg-emerald-500" },
            { value: "free", label: "Free", dot: "bg-sky-500" },
            { value: "pending", label: "Pending", dot: "bg-amber-500" },
            { value: "refunded", label: "Refunded", dot: "bg-slate-400" },
          ]}
        />
        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Dropdown
            value={checkin}
            onChange={setCheckin}
            className="w-full sm:w-44"
            options={[
              { value: "all", label: "All check-in" },
              { value: "in", label: "Checked in", dot: "bg-emerald-500" },
              { value: "out", label: "Not checked in", dot: "bg-slate-300" },
            ]}
          />
          <Dropdown
            value={eventId}
            onChange={setEventId}
            placeholder="All events"
            className="w-full sm:w-56"
            options={[
              { value: "", label: "All events" },
              ...events.map((ev) => ({ value: ev._id, label: ev.title })),
            ]}
          />
        </div>
      </div>

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          hint="Registrations appear here once attendees sign up for an event."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="flex flex-col gap-2"
        >
          <div className="hidden lg:grid grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)_4rem_5.5rem_6rem_7.5rem_5.5rem] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
            <span>Attendee</span>
            <span>Event</span>
            <span className="text-center">Tickets</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Status</span>
            <span className="text-center">Checked in by</span>
            <span className="text-right">Date</span>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r._id}
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => setViewing(r)}
              className="grid grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)_4rem_5.5rem_6rem_7.5rem_5.5rem] gap-x-3 gap-y-0 lg:gap-4 items-start lg:items-center px-4 py-3.5 lg:py-3 bg-white border border-primary/8 rounded-lg lg:rounded-sm hover:border-secondary-terra/40 hover:shadow-sm hover:shadow-primary/5 transition-all cursor-pointer"
            >
              {/* Attendee — always visible (avatar shows on mobile only) */}
              <div className="min-w-0 flex items-center gap-3">
                <span
                  className={`lg:hidden grid place-items-center w-9 h-9 rounded-full text-[0.6875rem] font-semibold flex-shrink-0 ${
                    AVATAR_TINTS[i % AVATAR_TINTS.length]
                  }`}
                >
                  {initials(r.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold lg:font-medium text-primary truncate">
                    {r.name || "Guest"}
                  </p>
                  <p className="text-[0.6875rem] text-primary/50 truncate">
                    {r.email || "—"}
                  </p>
                </div>
              </div>

              {/* Event — desktop column */}
              <p className="hidden lg:block text-sm text-primary truncate">
                {r.event?.title || "—"}
              </p>

              {/* Tickets — desktop column */}
              <p className="hidden lg:block text-sm text-primary text-center">
                {r.quantity || 1}
              </p>

              {/* Amount — top-right on mobile, column 4 on desktop */}
              <p className="text-[0.9375rem] lg:text-sm font-semibold lg:font-medium text-primary text-right whitespace-nowrap">
                {r.amount ? money(r.amount) : <span className="text-primary/45">Free</span>}
              </p>

              {/* Status — desktop column */}
              <span
                className={`hidden lg:block justify-self-center text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm text-center ${
                  STATUS_COLORS[r.paymentStatus] || "bg-primary/20 text-primary"
                }`}
              >
                {r.paymentStatus}
              </span>

              {/* Check-in + who did it — desktop column */}
              <span
                className="hidden lg:block justify-self-center text-center min-w-0"
                title={
                  r.checkedIn
                    ? `Checked in${
                        r.checkedInAt
                          ? ` ${new Date(r.checkedInAt).toLocaleString("en-AU")}`
                          : ""
                      }${r.checkedInBy?.name ? ` by ${r.checkedInBy.name}` : ""}`
                    : "Not checked in"
                }
              >
                {r.checkedIn ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In
                    </span>
                    <span className="block text-[0.625rem] text-primary/50 truncate">
                      {checkedInByLabel(r)}
                    </span>
                  </>
                ) : (
                  <span className="text-primary/25">—</span>
                )}
              </span>

              {/* Date — desktop column */}
              <span className="hidden lg:block text-[0.6875rem] text-primary/50 text-right">
                {new Date(r.createdAt).toLocaleDateString("en-AU")}
              </span>

              {/* Mobile meta — event + status/tickets/check-in/date */}
              <div className="col-span-2 flex lg:hidden flex-col gap-2.5 mt-3 pt-3 border-t border-primary/[0.07]">
                <p className="text-[0.8125rem] text-primary/75 font-medium truncate">
                  {r.event?.title || "—"}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex text-[0.5625rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full ${
                      STATUS_COLORS[r.paymentStatus] || "bg-primary/20 text-primary"
                    }`}
                  >
                    {r.paymentStatus}
                  </span>
                  <span className="inline-flex text-[0.5625rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-accent-cream text-primary/70">
                    {r.quantity || 1} {(r.quantity || 1) === 1 ? "ticket" : "tickets"}
                  </span>
                  {r.checkedIn && (
                    <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold ring-1 ring-inset ring-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> In
                      {r.checkedInBy?.name ? ` · ${r.checkedInBy.name}` : ""}
                    </span>
                  )}
                  <span className="text-[0.6875rem] text-primary/45 ml-auto whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("en-AU")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail drawer */}
      <Drawer
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title="Registration Detail"
        subtitle={viewing?.registrationNumber || ""}
        footer={
          viewing ? (
            <div className="flex items-center gap-2">
              {viewing.paymentStatus === "succeeded" && (
                <Button variant="ghost" onClick={() => markRefunded(viewing)}>
                  Mark refunded
                </Button>
              )}
              <Button variant="danger" onClick={() => deleteRegistration(viewing)}>
                Delete
              </Button>
            </div>
          ) : null
        }
      >
        {viewing && <RegistrationDetail registration={viewing} />}
      </Drawer>
    </div>
  )
}
