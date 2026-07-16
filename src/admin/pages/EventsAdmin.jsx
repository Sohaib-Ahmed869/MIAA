import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, NumberInput, TextArea, Select, Checkbox } from "../components/Field"
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
  imageKey: "",
  order: 0,
  published: true,
  acceptDonations: false,
  goalAmount: 0,
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

  const save = async () => {
    setBusy(true)
    setError("")
    try {
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
      }
      // raisedAmount / donationCount are computed by the donation pipeline —
      // never send them back or a concurrent donation could be clobbered.
      delete payload.raisedAmount
      delete payload.donationCount
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
              className="group bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-secondary-terra/60 hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[16/10] bg-accent-cream relative overflow-hidden">
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
              <div className="p-4">
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra mb-1">
                  {it.date}
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
                <div className="flex gap-2 mt-4 pt-4 border-t border-primary/8">
                  <button
                    onClick={() => open(it)}
                    className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary hover:text-secondary-terra transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(it._id)}
                    className="ml-auto inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="homepage">Homepage</option>
                <option value="offsite">Offsite Events page</option>
              </Select>
            </Field>
            <Field label="Order" hint="Lower numbers appear first">
              <NumberInput
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-3 mb-3">
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
    </div>
  )
}
