import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, BarChart3, UsersRound, Archive } from "lucide-react"
import { adminApi } from "../auth"
import EventAnalyticsDrawer from "./EventAnalyticsDrawer"
import EventVolunteersDrawer from "./EventVolunteersDrawer"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, NumberInput, TextArea, Checkbox } from "../components/Field"
import Dropdown from "../../components/ui/Dropdown"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonCardGrid } from "../components/Skeleton"
import FilterTabs from "../components/FilterTabs"

const EMPTY = {
  category: "offsite",
  slug: "",
  date: "",
  time: "",
  location: "",
  title: "",
  subtitle: "",
  description: "",
  longDescription: "",
  format: "",
  admission: "",
  rsvpUrl: "",
  rsvpLabel: "",
  redirectUrl: "",
  highlights: [
    { tag: "", title: "", body: "" },
    { tag: "", title: "", body: "" },
    { tag: "", title: "", body: "" },
  ],
  // Ticket Tailor → Brevo list routing (optional; blank = no mapping)
  ttEventId: "",
  brevoListId: "",
  imageKey: "",
  order: 0,
  published: true,
  acceptDonations: false,
  goalAmount: 0,
  // Registration & ticketing
  registrationEnabled: false,
  paymentRequired: false,
  pricingMode: "fixed",
  ticketTypes: [{ name: "General Admission", price: 0, description: "", capacity: 0 }],
  maxQuantity: 10,
  capacity: 0,
  customQuestions: [],
  currency: "AUD",
}

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function EventsAdmin() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("all")
  const [editing, setEditing] = useState(null)
  const [analyticsFor, setAnalyticsFor] = useState(null)
  const [volunteersFor, setVolunteersFor] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  const filtered = filter === "all" ? items : items.filter((it) => it.category === filter)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listEvents()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    let active = true
    adminApi
      .listEvents()
      .then((data) => {
        if (active) {
          setItems(data)
          setError("")
        }
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
  }, [])

  const open = (item) => {
    if (item) {
      const next = { ...EMPTY, ...item }
      // Ensure highlights always has 3 slots so the form renders the editor consistently.
      const existing = Array.isArray(item.highlights) ? item.highlights : []
      next.highlights = [0, 1, 2].map(
        (i) => existing[i] || { tag: "", title: "", body: "" }
      )
      // Always keep at least one ticket-type row so the editor renders.
      next.ticketTypes =
        Array.isArray(item.ticketTypes) && item.ticketTypes.length
          ? item.ticketTypes.map((t) => ({
              name: t.name || "",
              price: t.price || 0,
              description: t.description || "",
              capacity: t.capacity || 0,
            }))
          : [{ name: "General Admission", price: 0, description: "", capacity: 0 }]
      // Stored as a number (or null) — the input needs "" for an empty field.
      next.ttEventId = item.ttEventId || ""
      next.brevoListId = item.brevoListId ?? ""
      next.customQuestions = Array.isArray(item.customQuestions)
        ? item.customQuestions.map((q) => ({
            id: q.id || "",
            label: q.label || "",
            type: q.type || "text",
            required: !!q.required,
            options: Array.isArray(q.options) ? q.options : [],
          }))
        : []
      setEditing(item._id)
      setForm(next)
    } else {
      setEditing("new")
      setForm({
        ...EMPTY,
        highlights: EMPTY.highlights.map((h) => ({ ...h })),
      })
    }
    setError("")
  }
  const close = () => {
    setEditing(null)
    setForm(EMPTY)
    setError("")
  }

  // ── Ticket type + custom question editors ──────────────────
  const updateTicket = (i, key, value) => {
    const next = [...form.ticketTypes]
    next[i] = { ...next[i], [key]: value }
    setForm({ ...form, ticketTypes: next })
  }
  const addTicket = () =>
    setForm({
      ...form,
      ticketTypes: [
        ...form.ticketTypes,
        { name: "", price: 0, description: "", capacity: 0 },
      ],
    })
  const removeTicket = (i) =>
    setForm({ ...form, ticketTypes: form.ticketTypes.filter((_, idx) => idx !== i) })

  const updateQuestion = (i, key, value) => {
    const next = [...form.customQuestions]
    next[i] = { ...next[i], [key]: value }
    setForm({ ...form, customQuestions: next })
  }
  const addQuestion = () =>
    setForm({
      ...form,
      customQuestions: [
        ...form.customQuestions,
        {
          id: `q_${Math.random().toString(36).slice(2, 9)}`,
          label: "",
          type: "text",
          required: false,
          options: [],
        },
      ],
    })
  const removeQuestion = (i) =>
    setForm({
      ...form,
      customQuestions: form.customQuestions.filter((_, idx) => idx !== i),
    })

  const save = async () => {
    setBusy(true)
    setError("")
    try {
      const cleanTicketTypes = (
        form.pricingMode === "tiers" ? form.ticketTypes : form.ticketTypes.slice(0, 1)
      )
        .map((t) => ({
          name: (t.name || "General Admission").trim(),
          price: Math.max(0, Math.round(Number(t.price) || 0)),
          description: (t.description || "").trim(),
          capacity: Math.max(0, Math.round(Number(t.capacity) || 0)),
        }))
        .filter((t) => t.name)

      const cleanQuestions = (form.customQuestions || [])
        .filter((q) => (q.label || "").trim())
        .map((q) => ({
          id: q.id || `q_${Math.random().toString(36).slice(2, 9)}`,
          label: q.label.trim(),
          type: q.type || "text",
          required: !!q.required,
          options:
            q.type === "select"
              ? (q.options || []).map((o) => (o || "").trim()).filter(Boolean)
              : [],
        }))

      // Brevo list ids are plain numbers; anything unparseable is treated as
      // "no list" rather than silently sending 0.
      const brevoListIdRaw = Number(form.brevoListId)
      const brevoListIdValue =
        String(form.brevoListId ?? "").trim() === "" || !Number.isFinite(brevoListIdRaw)
          ? null
          : Math.round(brevoListIdRaw)

      const payload = {
        ...form,
        slug: slugify(form.slug || form.title),
        goalAmount: Math.max(0, Math.round(Number(form.goalAmount) || 0)),
        highlights: (form.highlights || [])
          .map((h) => ({
            tag: (h.tag || "").trim(),
            title: (h.title || "").trim(),
            body: (h.body || "").trim(),
          }))
          .filter((h) => h.tag || h.title || h.body),
        registrationEnabled: !!form.registrationEnabled,
        paymentRequired: !!form.paymentRequired,
        pricingMode: form.pricingMode || "fixed",
        ticketTypes: cleanTicketTypes,
        maxQuantity: Math.max(1, Math.round(Number(form.maxQuantity) || 1)),
        capacity: Math.max(0, Math.round(Number(form.capacity) || 0)),
        order: Math.max(0, Math.round(Number(form.order) || 0)),
        customQuestions: cleanQuestions,
        // Both blank leaves the event unmapped; the pair is what routes Ticket
        // Tailor orders into a Brevo list (see the Event Lists screen).
        ttEventId: (form.ttEventId || "").trim(),
        brevoListId: brevoListIdValue,
      }
      // raisedAmount / donationCount / registeredCount are computed by the
      // payment pipeline — never send them back or a concurrent charge could be
      // clobbered.
      delete payload.raisedAmount
      delete payload.donationCount
      delete payload.registeredCount
      // Derived from the event date on read — not columns to write back.
      delete payload.endsAt
      delete payload.hasEnded
      if (editing === "new") {
        await adminApi.createEvent(payload)
        notify("Event created")
      } else {
        await adminApi.updateEvent(editing, payload)
        notify("Event saved")
      }
      close()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!(await confirm({ title: "Delete this event?", confirmLabel: "Delete", danger: true }))) return
    await adminApi.deleteEvent(id)
    notify("Event deleted")
    load()
  }

  // Events move into Previous Events on their own once their date passes, so
  // this is only needed to archive one early, or to give it a write-up of its
  // own that can be edited separately from the event page.
  const archive = async (it) => {
    const ok = await confirm({
      title: "Move to Previous Events?",
      message: it.hasEnded
        ? `"${it.title}" already shows in the archive because its date has passed. Moving it creates an archive entry you can edit separately, and unpublishes the event.`
        : `"${it.title}" hasn't happened yet. Moving it now unpublishes the event and adds it to the archive straight away.`,
      confirmLabel: "Move to archive",
    })
    if (!ok) return
    try {
      const { alreadyArchived } = await adminApi.archiveEvent(it._id)
      notify(alreadyArchived ? "Already in Previous Events" : "Moved to Previous Events")
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  return (
    <div>
      <PageHeader
        label="Events"
        title="Upcoming Events"
        subtitle="Manage events shown on the Homepage and the Offsite Events page."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Event
          </Button>
        }
      />

      {/* Category filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "homepage", label: "Homepage" },
            { value: "offsite", label: "Offsite" },
          ]}
        />
        <span className="text-[0.625rem] text-primary/40">
          {filtered.length} of {items.length} events
        </span>
      </div>

      {loading ? (
        <SkeletonCardGrid count={6} withImage />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No events yet"
          hint="Add your first event so the homepage and offsite pages have something to show."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4"
        >
          {filtered.map((it) => (
            <motion.div
              key={it._id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="group h-full flex flex-col bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-secondary-terra/60 hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[16/10] bg-accent-cream relative overflow-hidden flex-shrink-0">
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 text-[0.625rem] tracking-[0.2em] uppercase">
                    No Image
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm ${
                    it.published
                      ? "bg-emerald-500/90 text-white"
                      : "bg-white/85 text-primary/70"
                  }`}
                >
                  {it.published ? "Published" : "Draft"}
                </span>
                <span className="absolute top-3 right-3 text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm bg-primary/85 text-accent-cream">
                  {it.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra mb-1 flex items-center gap-2">
                  {it.date}
                  {/* Past events drop off the public "Upcoming" sections and
                      show in the archive instead — flagged here so that isn't
                      a surprise. */}
                  {it.hasEnded && (
                    <span className="text-primary/45 tracking-[0.15em]">· Past</span>
                  )}
                </p>
                <p className="text-base font-medium text-primary leading-tight mb-1">
                  {it.title}
                </p>
                {it.location && (
                  <p className="text-xs text-primary/55 italic">{it.location}</p>
                )}
                {it.description && (
                  <p className="text-[0.8125rem] text-primary/75 mt-3 line-clamp-2">
                    {it.description}
                  </p>
                )}
                {it.acceptDonations && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[0.625rem] tracking-[0.15em] uppercase text-primary/55 mb-1">
                      <span className="text-secondary-terra font-medium">
                        ${((it.raisedAmount || 0) / 100).toLocaleString()} raised
                      </span>
                      {it.goalAmount > 0 && (
                        <span>${(it.goalAmount / 100).toLocaleString()} goal</span>
                      )}
                    </div>
                    {it.goalAmount > 0 && (
                      <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary-terra rounded-full"
                          style={{
                            width: `${Math.min(100, ((it.raisedAmount || 0) / it.goalAmount) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {/* Actions — pinned to the card bottom so every card lines up */}
                <div className="grid grid-cols-5 gap-0.5 mt-auto pt-3 border-t border-primary/8">
                  {[
                    { label: "Edit", icon: Pencil, onClick: () => open(it) },
                    { label: "Analytics", icon: BarChart3, onClick: () => setAnalyticsFor(it) },
                    { label: "Volunteers", icon: UsersRound, onClick: () => setVolunteersFor(it) },
                    { label: "Archive", icon: Archive, onClick: () => archive(it) },
                    {
                      label: "Delete",
                      icon: Trash2,
                      onClick: () => remove(it._id),
                      danger: true,
                    },
                  ].map((a) => (
                    <button
                      key={a.label}
                      onClick={a.onClick}
                      title={a.label}
                      className={`flex flex-col items-center justify-center gap-1.5 min-w-0 py-2 rounded-sm text-[0.5rem] font-semibold tracking-[0.04em] uppercase transition-colors ${
                        a.danger
                          ? "text-primary/50 hover:text-rose-600 hover:bg-rose-500/8"
                          : "text-primary/80 hover:text-secondary-terra hover:bg-accent-cream/70"
                      }`}
                    >
                      <a.icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
                      <span className="whitespace-nowrap leading-none">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? "New Event" : "Edit Event"}
        subtitle="Events appear on the homepage Offsite Programs row or the dedicated Events page."
        footer={
          <>
            <Button onClick={close} variant="ghost">Cancel</Button>
            <Button onClick={save} variant="primary" disabled={busy} withArrow>
              {busy ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm">{error}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Dropdown
                fullWidth
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={[
                  { value: "homepage", label: "Homepage" },
                  { value: "offsite", label: "Offsite Events page" },
                ]}
              />
            </Field>
            <Field label="Order" hint="Lower numbers appear first">
              <NumberInput
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date" hint="e.g. 07.02.26 or TBA">
              <TextInput
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="07.02.26"
              />
            </Field>
            <Field label="Location">
              <TextInput
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="At Gallery A, MIAA"
              />
            </Field>
          </div>
          <Field label="Title">
            <TextInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Islamic Art Showcase"
            />
          </Field>
          <Field
            label="URL Slug"
            hint="Public URL will be /event/<slug>. Leave blank to auto-generate from the title."
          >
            <TextInput
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              onBlur={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder={slugify(form.title || "")}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Time" hint="Optional — shown in the detail page hero">
              <TextInput
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="6:00 PM – 9:00 PM"
              />
            </Field>
            <Field label="Format" hint="e.g. In-person, Virtual, Hybrid">
              <TextInput
                value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
                placeholder="In-person"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Admission" hint="e.g. Free / RSVP, $25, Members Only">
              <TextInput
                value={form.admission}
                onChange={(e) => setForm({ ...form, admission: e.target.value })}
                placeholder="Free / RSVP"
              />
            </Field>
            <Field label="RSVP Button Label" hint="Defaults to “RSVP for Event”">
              <TextInput
                value={form.rsvpLabel}
                onChange={(e) => setForm({ ...form, rsvpLabel: e.target.value })}
                placeholder="RSVP for Event"
              />
            </Field>
          </div>
          <Field
            label="RSVP Link"
            hint="External URL or internal path. Leave blank to point at /contact."
          >
            <TextInput
              value={form.rsvpUrl}
              onChange={(e) => setForm({ ...form, rsvpUrl: e.target.value })}
              placeholder="https://example.com/rsvp or /contact"
            />
          </Field>
          <Field
            label="Redirect URL"
            hint="Override the detail page. Clicking the event card goes here instead of /event/<slug>. e.g. /gala-dinner"
          >
            <TextInput
              value={form.redirectUrl}
              onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
              placeholder="/gala-dinner"
            />
          </Field>
          <Field
            label="Subtitle"
            hint="Big tagline shown above the long description on the detail page."
          >
            <TextInput
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="A gathering of stories, art, and community."
            />
          </Field>
          <Field label="Short Description" hint="Shown on event cards.">
            <TextArea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Short blurb shown beneath the event title…"
            />
          </Field>
          <Field
            label="Long Description"
            hint="Full body for the detail page. Separate paragraphs with a blank line."
          >
            <TextArea
              value={form.longDescription}
              onChange={(e) =>
                setForm({ ...form, longDescription: e.target.value })
              }
              rows={8}
              placeholder="The full story of the event…"
            />
          </Field>

          <div className="border-t border-primary/10 pt-5">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1">
              What to Expect
            </p>
            <p className="text-[0.6875rem] text-primary/50 mb-4">
              Three cards rendered on the detail page. Leave a row blank to hide it.
            </p>
            <div className="flex flex-col gap-5">
              {form.highlights.map((h, i) => (
                <div
                  key={i}
                  className="border border-primary/10 rounded-sm p-4 bg-white"
                >
                  <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45 mb-3">
                    Card {i + 1}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <Field label="Tag">
                      <TextInput
                        value={h.tag}
                        onChange={(e) => {
                          const next = [...form.highlights]
                          next[i] = { ...next[i], tag: e.target.value }
                          setForm({ ...form, highlights: next })
                        }}
                        placeholder="Welcome"
                      />
                    </Field>
                    <Field label="Title">
                      <TextInput
                        value={h.title}
                        onChange={(e) => {
                          const next = [...form.highlights]
                          next[i] = { ...next[i], title: e.target.value }
                          setForm({ ...form, highlights: next })
                        }}
                        placeholder="Arrival & Refreshments"
                      />
                    </Field>
                  </div>
                  <Field label="Body">
                    <TextArea
                      value={h.body}
                      onChange={(e) => {
                        const next = [...form.highlights]
                        next[i] = { ...next[i], body: e.target.value }
                        setForm({ ...form, highlights: next })
                      }}
                      rows={3}
                      placeholder="Describe this part of the program…"
                    />
                  </Field>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-primary/10 pt-5">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1">
              Donations
            </p>
            <p className="text-[0.6875rem] text-primary/50 mb-4">
              When enabled, a “Donate to this Event” button appears on the event
              detail page and contributions are tracked against this event.
            </p>
            <Checkbox
              label="Accept donations for this event"
              checked={form.acceptDonations}
              onChange={(v) => setForm({ ...form, acceptDonations: v })}
            />
            {form.acceptDonations && (
              <div className="mt-4">
                <Field
                  label="Fundraising Goal (AUD)"
                  hint="Optional. Set a target to show a progress bar. Leave 0 to just track total raised."
                >
                  <NumberInput
                    value={form.goalAmount ? form.goalAmount / 100 : ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        goalAmount: Math.round((Number(e.target.value) || 0) * 100),
                      })
                    }
                    placeholder="0"
                  />
                </Field>
                {editing !== "new" && (
                  <p className="text-[0.6875rem] text-primary/55 mt-3">
                    Raised so far:{" "}
                    <span className="text-primary font-medium">
                      ${((form.raisedAmount || 0) / 100).toLocaleString()}
                    </span>{" "}
                    · {form.donationCount || 0} donation
                    {(form.donationCount || 0) === 1 ? "" : "s"}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-primary/10 pt-5">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1">
              Registration & Ticketing
            </p>
            <p className="text-[0.6875rem] text-primary/50 mb-4">
              When enabled, a “Register” button appears on the event detail page and
              attendee registrations are collected under the Registrations tab.
            </p>
            <Checkbox
              label="Enable registration for this event"
              checked={form.registrationEnabled}
              onChange={(v) => setForm({ ...form, registrationEnabled: v })}
            />

            {form.registrationEnabled && (
              <div className="mt-4 flex flex-col gap-5">
                <Checkbox
                  label="Require payment to register"
                  checked={form.paymentRequired}
                  onChange={(v) => setForm({ ...form, paymentRequired: v })}
                />

                {form.paymentRequired && (
                  <>
                    <Field label="Pricing Mode">
                      <Dropdown
                        fullWidth
                        value={form.pricingMode}
                        onChange={(v) => setForm({ ...form, pricingMode: v })}
                        options={[
                          { value: "fixed", label: "Single fixed price" },
                          { value: "quantity", label: "Price × quantity" },
                          { value: "tiers", label: "Multiple ticket types" },
                        ]}
                      />
                    </Field>

                    {form.pricingMode !== "tiers" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Ticket Name">
                          <TextInput
                            value={form.ticketTypes[0]?.name || ""}
                            onChange={(e) => updateTicket(0, "name", e.target.value)}
                            placeholder="General Admission"
                          />
                        </Field>
                        <Field label="Price (AUD)">
                          <NumberInput
                            value={
                              form.ticketTypes[0]?.price
                                ? form.ticketTypes[0].price / 100
                                : ""
                            }
                            onChange={(e) =>
                              updateTicket(
                                0,
                                "price",
                                Math.round((Number(e.target.value) || 0) * 100)
                              )
                            }
                            placeholder="50"
                          />
                        </Field>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {form.ticketTypes.map((t, i) => (
                          <div
                            key={i}
                            className="border border-primary/10 rounded-sm p-4 bg-white"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45">
                                Ticket {i + 1}
                              </p>
                              {form.ticketTypes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTicket(i)}
                                  className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/50 hover:text-rose-600"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Field label="Name">
                                <TextInput
                                  value={t.name}
                                  onChange={(e) => updateTicket(i, "name", e.target.value)}
                                  placeholder="VIP"
                                />
                              </Field>
                              <Field label="Price (AUD)">
                                <NumberInput
                                  value={t.price ? t.price / 100 : ""}
                                  onChange={(e) =>
                                    updateTicket(
                                      i,
                                      "price",
                                      Math.round((Number(e.target.value) || 0) * 100)
                                    )
                                  }
                                  placeholder="120"
                                />
                              </Field>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addTicket}
                          className="self-start inline-flex items-center gap-1 text-[0.6875rem] tracking-[0.15em] uppercase text-secondary-terra hover:text-secondary-rust"
                        >
                          <Plus className="w-3 h-3" /> Add ticket type
                        </button>
                      </div>
                    )}

                    {form.pricingMode === "quantity" && (
                      <Field label="Max tickets per registration">
                        <NumberInput
                          min={1}
                          value={form.maxQuantity}
                          onChange={(e) =>
                            setForm({ ...form, maxQuantity: Number(e.target.value) })
                          }
                          placeholder="10"
                        />
                      </Field>
                    )}
                  </>
                )}

                {/* Free events have no pricing to configure, but families still
                    need to book several places on one RSVP. */}
                {!form.paymentRequired && (
                  <>
                    <div>
                      <Checkbox
                        label="Let people register more than one person"
                        checked={form.pricingMode !== "fixed"}
                        onChange={(v) =>
                          setForm({ ...form, pricingMode: v ? "quantity" : "fixed" })
                        }
                      />
                      <p className="text-[0.6875rem] text-primary/50 mt-1.5">
                        Adds a “how many are coming” counter to the registration
                        form, so a parent can book their children in one go. Every
                        place counts towards capacity and the door head count.
                      </p>
                    </div>

                    {form.pricingMode !== "fixed" && (
                      <Field
                        label="Max people per registration"
                        hint="Including the person registering."
                      >
                        <NumberInput
                          min={1}
                          value={form.maxQuantity}
                          onChange={(e) =>
                            setForm({ ...form, maxQuantity: Number(e.target.value) })
                          }
                          placeholder="10"
                        />
                      </Field>
                    )}
                  </>
                )}

                <Field
                  label="Capacity"
                  hint="Total seats available. Leave 0 for unlimited."
                >
                  <NumberInput
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    placeholder="0"
                  />
                </Field>

                {editing !== "new" && (
                  <p className="text-[0.6875rem] text-primary/55 -mt-2">
                    Registered so far:{" "}
                    <span className="text-primary font-medium">
                      {form.registeredCount || 0}
                    </span>
                    {form.capacity > 0 ? ` / ${form.capacity}` : ""}
                  </p>
                )}

                {/* Custom questions */}
                <div>
                  <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1">
                    Custom Questions
                  </p>
                  <p className="text-[0.6875rem] text-primary/50 mb-3">
                    Extra questions asked during registration (e.g. dietary needs).
                  </p>
                  <div className="flex flex-col gap-4">
                    {form.customQuestions.map((q, i) => (
                      <div
                        key={q.id || i}
                        className="border border-primary/10 rounded-sm p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45">
                            Question {i + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeQuestion(i)}
                            className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/50 hover:text-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <Field label="Question">
                            <TextInput
                              value={q.label}
                              onChange={(e) => updateQuestion(i, "label", e.target.value)}
                              placeholder="Dietary requirements"
                            />
                          </Field>
                          <Field label="Type">
                            <Dropdown
                              fullWidth
                              value={q.type}
                              onChange={(v) => updateQuestion(i, "type", v)}
                              options={[
                                { value: "text", label: "Short text" },
                                { value: "textarea", label: "Long text" },
                                { value: "number", label: "Number" },
                                { value: "select", label: "Dropdown" },
                                { value: "checkbox", label: "Checkbox" },
                              ]}
                            />
                          </Field>
                        </div>
                        {q.type === "select" && (
                          <Field label="Options" hint="Comma-separated choices">
                            <TextInput
                              value={(q.options || []).join(", ")}
                              onChange={(e) =>
                                updateQuestion(
                                  i,
                                  "options",
                                  e.target.value.split(",").map((o) => o.trim())
                                )
                              }
                              placeholder="Vegetarian, Halal, Vegan"
                            />
                          </Field>
                        )}
                        <div className="mt-3">
                          <Checkbox
                            label="Required"
                            checked={q.required}
                            onChange={(v) => updateQuestion(i, "required", v)}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="self-start inline-flex items-center gap-1 text-[0.6875rem] tracking-[0.15em] uppercase text-secondary-terra hover:text-secondary-rust"
                    >
                      <Plus className="w-3 h-3" /> Add question
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-primary/10 pt-5">
            <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1">
              Ticket Tailor → Brevo
            </p>
            <p className="text-[0.6875rem] text-primary/50 mb-4">
              Optional. Fill in both to route this event's Ticket Tailor buyers into a
              Brevo list — the mapping appears under Event Lists and can be managed there
              too. Leave blank if this event isn't sold through Ticket Tailor.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Ticket Tailor Event ID"
                hint="In the event's URL in your Ticket Tailor dashboard."
              >
                <TextInput
                  value={form.ttEventId}
                  onChange={(e) => setForm({ ...form, ttEventId: e.target.value })}
                  placeholder="ev_1234…"
                />
              </Field>
              <Field
                label="Brevo List ID"
                hint="The number in the URL at Brevo → Contacts → Lists → your list."
              >
                {/* Plain text input, not NumberInput: this field has to be able
                    to sit empty (no mapping), and NumberInput settles a blank
                    back to its floor of 0 on blur. */}
                <TextInput
                  inputMode="numeric"
                  value={form.brevoListId}
                  onChange={(e) =>
                    setForm({ ...form, brevoListId: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="e.g. 12"
                />
              </Field>
            </div>
            {!!(form.ttEventId || "").trim() !==
              !!String(form.brevoListId ?? "").trim() && (
              <p className="text-[0.6875rem] text-amber-700 bg-amber-50 px-3 py-2 rounded-sm mt-3">
                Both IDs are needed to route registrations — with only one filled in, no
                list mapping is created.
              </p>
            )}
          </div>

          <ImageUpload
            folder="events"
            currentKey={form.imageKey}
            onUploaded={(key) => setForm({ ...form, imageKey: key })}
          />
          <div className="pt-2">
            <Checkbox
              label="Published"
              checked={form.published}
              onChange={(v) => setForm({ ...form, published: v })}
            />
          </div>
        </div>
      </Drawer>

      <EventAnalyticsDrawer
        event={analyticsFor}
        open={analyticsFor !== null}
        onClose={() => setAnalyticsFor(null)}
      />

      <EventVolunteersDrawer
        event={volunteersFor}
        open={volunteersFor !== null}
        onClose={() => setVolunteersFor(null)}
      />
    </div>
  )
}
