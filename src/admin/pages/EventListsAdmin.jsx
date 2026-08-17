import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Star, Plus, X, Pencil, ExternalLink, Power } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import EmptyState from "../components/EmptyState"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonList } from "../components/Skeleton"

const EMPTY = { ttEventId: "", eventName: "", brevoListId: "", isDefault: false }

const inputCls =
  "w-full px-3 py-2.5 text-sm bg-white border border-primary/15 rounded-sm focus:outline-none focus:border-secondary-terra/70 focus:ring-1 focus:ring-secondary-terra/30 transition-colors"

const labelCls =
  "block text-[0.625rem] tracking-[0.2em] uppercase text-primary/45 mb-1.5"

export default function EventListsAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const { notify } = useToast()
  const confirm = useConfirm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listEventLists()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm(EMPTY)
    setEditingId(null)
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setForm({
      ttEventId: item.ttEventId || "",
      eventName: item.eventName || "",
      brevoListId: item.brevoListId ?? "",
      isDefault: !!item.isDefault,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.ttEventId.trim() || form.brevoListId === "") {
      notify("Ticket Tailor event ID and Brevo list ID are required", "error")
      return
    }
    setSaving(true)
    try {
      const payload = {
        ttEventId: form.ttEventId.trim(),
        eventName: form.eventName.trim(),
        brevoListId: Number(form.brevoListId),
        isDefault: form.isDefault,
      }
      if (editingId) {
        await adminApi.updateEventList(editingId, payload)
        notify("Mapping updated")
      } else {
        await adminApi.createEventList(payload)
        notify("Mapping added")
      }
      resetForm()
      load()
    } catch (err) {
      notify(err.message, "error")
    } finally {
      setSaving(false)
    }
  }

  const makeDefault = async (item) => {
    try {
      await adminApi.updateEventList(item._id, { isDefault: true })
      notify(`"${item.eventName || item.ttEventId}" is now the default list`)
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const toggleActive = async (item) => {
    try {
      await adminApi.updateEventList(item._id, { active: !item.active })
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const remove = async (item) => {
    const ok = await confirm({
      title: "Delete this mapping?",
      message: `Remove the mapping for "${item.eventName || item.ttEventId}"?`,
      confirmLabel: "Delete",
      danger: true,
    })
    if (!ok) return
    try {
      await adminApi.deleteEventList(item._id)
      notify("Mapping deleted")
      if (editingId === item._id) resetForm()
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  return (
    <div>
      <PageHeader
        label="Ticket Tailor → Brevo"
        title="Event Lists"
        subtitle="Route each Ticket Tailor event's registrations into a specific Brevo list. Create the list in Brevo, then paste its ID here against the event."
      />

      {/* How-to hint */}
      <div className="mb-6 text-[0.75rem] leading-relaxed text-primary/55 bg-accent-cream/60 border border-primary/10 rounded-sm px-4 py-3">
        <p className="mb-1">
          <span className="font-medium text-primary/70">Where to find the IDs:</span> the{" "}
          <span className="font-medium">Brevo list ID</span> is the number in the URL at Brevo →
          Contacts → Lists → your list. The{" "}
          <span className="font-medium">Ticket Tailor event ID</span> (looks like{" "}
          <code className="text-secondary-terra">ev_1234…</code>) is in the event's URL in your
          Ticket Tailor dashboard.
        </p>
        <p>
          Mark one mapping as <span className="font-medium">Default</span> — registrations for any
          event without its own mapping go there.
        </p>
      </div>

      {/* Add / edit form */}
      <form
        onSubmit={submit}
        className="bg-white border border-primary/10 rounded-sm p-4 sm:p-5 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-primary">
            {editingId ? "Edit mapping" : "Add a mapping"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary/45 hover:text-primary transition-colors"
            >
              <X className="w-3 h-3" /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Event name</label>
            <input
              className={inputCls}
              value={form.eventName}
              onChange={(e) => setForm({ ...form, eventName: e.target.value })}
              placeholder="e.g. Writers' Festival 2026"
            />
          </div>
          <div>
            <label className={labelCls}>Ticket Tailor event ID</label>
            <input
              className={inputCls}
              value={form.ttEventId}
              onChange={(e) => setForm({ ...form, ttEventId: e.target.value })}
              placeholder="ev_1234…"
            />
          </div>
          <div>
            <label className={labelCls}>Brevo list ID</label>
            <input
              className={inputCls}
              type="number"
              value={form.brevoListId}
              onChange={(e) => setForm({ ...form, brevoListId: e.target.value })}
              placeholder="e.g. 12"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
          <label className="inline-flex items-center gap-2 text-xs text-primary/65 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="accent-secondary-terra flex-shrink-0"
            />
            Use as the default (catch-all) list
          </label>
          <Button type="submit" variant="primary" disabled={saving}>
            {editingId ? (
              <>
                <Pencil className="w-3.5 h-3.5" /> Save changes
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add mapping
              </>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm mb-4">{error}</p>
      )}

      {loading ? (
        <SkeletonList count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No event lists yet"
          hint="Add your first event → Brevo list mapping above."
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="bg-white border border-primary/10 rounded-sm divide-y divide-primary/8 overflow-hidden"
        >
          {items.map((item) => (
            <motion.li
              key={item._id}
              variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 transition-colors ${
                item.active ? "hover:bg-accent-cream/60" : "bg-primary/[0.02] opacity-70"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-primary text-sm truncate font-medium">
                    {item.eventName || <span className="text-primary/40">Unnamed event</span>}
                  </p>
                  {item.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase text-secondary-terra bg-secondary-terra/10 px-2 py-0.5 rounded-sm">
                      <Star className="w-2.5 h-2.5 fill-current" /> Default
                    </span>
                  )}
                  {item.eventId && (
                    <span
                      title="These IDs are set on the event itself under Events — editing them there updates this mapping."
                      className="text-[0.5625rem] tracking-[0.15em] uppercase text-primary/50 bg-primary/8 px-2 py-0.5 rounded-sm"
                    >
                      From event
                    </span>
                  )}
                  {!item.active && (
                    <span className="text-[0.5625rem] tracking-[0.15em] uppercase text-primary/45 bg-primary/8 px-2 py-0.5 rounded-sm">
                      Disabled
                    </span>
                  )}
                </div>
                <p className="text-[0.6875rem] text-primary/45 mt-0.5 break-all sm:truncate">
                  <code className="text-primary/55">{item.ttEventId}</code>
                  <span className="mx-2 text-primary/25">→</span>
                  Brevo list <span className="text-primary/70">#{item.brevoListId}</span>
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 sm:gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-primary/8">
                {!item.isDefault && (
                  <button
                    onClick={() => makeDefault(item)}
                    title="Make this the default list"
                    className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary/45 hover:text-secondary-terra transition-colors"
                  >
                    <Star className="w-3 h-3" /> Default
                  </button>
                )}
                <button
                  onClick={() => toggleActive(item)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary/45 hover:text-primary transition-colors"
                >
                  <Power className="w-3 h-3" /> {item.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary/45 hover:text-primary transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => remove(item)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary/45 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <p className="text-[0.6875rem] text-primary/45 mt-4 flex items-center gap-1.5">
        <ExternalLink className="w-3 h-3" />
        Lists are created in Brevo; this page only routes events to them.
      </p>
    </div>
  )
}
