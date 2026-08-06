import { useEffect, useState } from "react"
import {
  Plus,
  Copy,
  Check,
  Mail,
  Trash2,
  Pencil,
  Link2,
  ScanLine,
  AlertTriangle,
  Building2,
  Phone,
  MapPin,
  CalendarOff,
  UserCheck,
} from "lucide-react"
import { adminApi } from "../auth"
import Drawer from "../components/Drawer"
import Button from "../components/Button"
import EmptyState from "../components/EmptyState"
import { Field, TextInput, TextArea, Checkbox } from "../components/Field"
import Dropdown from "../../components/ui/Dropdown"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  address: "",
  organization: "",
  notes: "",
  sendEmail: true,
}

const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : ""

// Manage the volunteers who can work the door for one event. Each gets a
// private check-in link that stops working at the end of the event date.
export default function EventVolunteersDrawer({ event, open, onClose }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState(null) // null = list view, else the add/edit form
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [copiedId, setCopiedId] = useState("")
  // Approved volunteer applicants, offered as a pick-list when adding so admins
  // don't have to re-type someone who already applied.
  const [applicants, setApplicants] = useState([])
  const [pickedApplicantId, setPickedApplicantId] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  // Computed server-side from the event date (null date, e.g. "TBA", is treated
  // as still to come).
  const hasEnded = !!event?.hasEnded

  const load = () => {
    if (!event?._id) return Promise.resolve()
    setLoading(true)
    return adminApi
      .listEventVolunteers({ event: event._id })
      .then((data) => {
        setRows(data)
        setError("")
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!open || !event?._id) return
    let active = true
    const init = async () => {
      setForm(null)
      setEditingId(null)
      setRows([])
      setError("")
      setPickedApplicantId("")
      setLoading(true)
      try {
        const data = await adminApi.listEventVolunteers({ event: event._id })
        if (active) setRows(data)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
      // Approved applicants for the pick-list — best-effort, never blocks the list.
      adminApi
        .listVolunteerApplications({ status: "approved" })
        .then((a) => {
          if (active) setApplicants(Array.isArray(a) ? a : [])
        })
        .catch(() => {})
    }
    init()
    return () => {
      active = false
    }
  }, [open, event?._id])

  const startAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY })
    setPickedApplicantId("")
    setError("")
  }

  // Prefill the add form from an approved applicant. Their name/email/phone come
  // across; their interests + availability seed the notes as helpful context.
  // Everything stays editable so the admin can add more before saving.
  const pickApplicant = (id) => {
    setPickedApplicantId(id)
    const a = applicants.find((x) => x._id === id)
    if (!a) return
    const context = []
    if (a.areasOfInterest?.length) context.push(`Interests: ${a.areasOfInterest.join(", ")}`)
    if (a.availability) context.push(`Availability: ${a.availability}`)
    setForm((f) => ({
      ...(f || EMPTY),
      name: a.fullName || "",
      email: a.email || "",
      phone: a.phone || "",
      notes: context.join(" · "),
    }))
  }

  const startEdit = (v) => {
    setEditingId(v._id)
    setPickedApplicantId("")
    setForm({
      name: v.name || "",
      email: v.email || "",
      phone: v.phone || "",
      address: v.address || "",
      organization: v.organization || "",
      notes: v.notes || "",
      sendEmail: false,
    })
    setError("")
  }

  const save = async () => {
    if (!form.name.trim()) return setError("Volunteer name is required")
    if (!form.phone.trim()) return setError("Phone number is required")
    setBusy(true)
    setError("")
    try {
      if (editingId) {
        await adminApi.updateEventVolunteer(editingId, form)
        notify("Volunteer updated")
      } else {
        const created = await adminApi.createEventVolunteer({
          ...form,
          eventId: event._id,
        })
        notify(
          created.emailed
            ? `Check-in link sent to ${created.email}`
            : "Volunteer added — copy their link to share it"
        )
      }
      setForm(null)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const copyLink = async (v) => {
    try {
      await navigator.clipboard.writeText(v.checkinUrl)
      setCopiedId(v._id)
      setTimeout(() => setCopiedId(""), 2000)
    } catch {
      notify("Couldn't copy — select the link and copy it manually", "error")
    }
  }

  const resend = async (v) => {
    try {
      await adminApi.sendVolunteerLink(v._id)
      notify(`Check-in link sent to ${v.email}`)
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const toggleActive = async (v) => {
    try {
      await adminApi.updateEventVolunteer(v._id, { active: !v.active })
      notify(v.active ? "Link turned off" : "Link turned back on")
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const remove = async (v) => {
    if (
      !(await confirm({
        title: `Remove ${v.name}?`,
        message:
          "Their check-in link stops working immediately. Attendees they already checked in stay checked in.",
        confirmLabel: "Remove",
        danger: true,
      }))
    )
      return
    try {
      await adminApi.deleteEventVolunteer(v._id)
      notify("Volunteer removed")
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Event Volunteers"
      subtitle={event?.title || ""}
      footer={
        form ? (
          <>
            <Button variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save} disabled={busy} withArrow>
              {busy ? "Saving…" : editingId ? "Save changes" : "Add volunteer"}
            </Button>
          </>
        ) : hasEnded ? null : (
          <Button variant="primary" onClick={startAdd}>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} /> Add volunteer
          </Button>
        )
      }
    >
      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm mb-4">{error}</p>
      )}

      {/* Once the event date has passed every link is dead, so there's nothing
          useful to add — the roster stays for the record. */}
      {hasEnded && !form && (
        <div className="flex items-start gap-2.5 mb-4 px-3 py-2.5 rounded-sm bg-accent-cream/70 border border-primary/10">
          <CalendarOff className="w-3.5 h-3.5 text-primary/45 mt-0.5 flex-shrink-0" />
          <p className="text-[0.6875rem] text-primary/65 leading-relaxed">
            This event finished on {event?.date}. Volunteers can no longer be added and
            their check-in links have expired — the list below is kept for the record.
          </p>
        </div>
      )}

      {form ? (
        <div className="flex flex-col gap-4">
          {/* Pick an already-approved applicant to prefill the form. Only shown
              when adding (not editing) and when approved applicants exist. */}
          {!editingId && applicants.length > 0 && (
            <div className="rounded-sm border border-primary/10 bg-accent-cream/40 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <UserCheck className="w-3.5 h-3.5 text-secondary-terra" />
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/60">
                  Prefill from an approved applicant
                </p>
              </div>
              <Dropdown
                value={pickedApplicantId}
                onChange={pickApplicant}
                fullWidth
                placeholder="Select an approved applicant…"
                options={applicants.map((a) => ({
                  value: a._id,
                  label: `${a.fullName}${a.email ? ` — ${a.email}` : ""}`,
                }))}
              />
              <p className="text-[0.625rem] text-primary/45 mt-2">
                Fills in their details below — you can edit or add more before saving.
              </p>
            </div>
          )}
          <Field label="Name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aisha Rahman"
            />
          </Field>
          <Field label="Organization" hint="Optional">
            <TextInput
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="MIAA Youth Committee"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone">
              <TextInput
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+61 400 000 000"
              />
            </Field>
            <Field label="Email" hint="Optional — needed to email them the link">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="volunteer@example.com"
              />
            </Field>
          </div>
          <Field label="Address" hint="Optional">
            <TextArea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              placeholder="12 Example St, Parramatta NSW"
            />
          </Field>
          <Field label="Notes" hint="Optional — internal only">
            <TextArea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="On the door 5–7pm"
            />
          </Field>
          {!editingId && (
            <Checkbox
              label="Email them their check-in link now"
              checked={form.sendEmail}
              onChange={(v) => setForm({ ...form, sendEmail: v })}
            />
          )}
        </div>
      ) : loading ? (
        <p className="text-sm text-primary/50">Loading volunteers…</p>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No volunteers"
          hint={
            hasEnded
              ? "No volunteers were added to this event."
              : "Add a volunteer to give them a door check-in link for this event."
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((v) => (
            <div
              key={v._id}
              className="border border-primary/10 rounded-sm bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{v.name}</p>
                  <div className="mt-1 flex flex-col gap-0.5 text-[0.6875rem] text-primary/55">
                    {v.organization && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Building2 className="w-3 h-3 flex-shrink-0" /> {v.organization}
                      </span>
                    )}
                    {v.phone && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 flex-shrink-0" /> {v.phone}
                      </span>
                    )}
                    {v.email && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" /> {v.email}
                      </span>
                    )}
                    {v.address && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" /> {v.address}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase px-2 py-1 rounded-sm bg-accent-cream text-primary/70">
                    <ScanLine className="w-3 h-3" /> {v.checkIns ?? v.checkInCount ?? 0}{" "}
                    checked in
                  </span>
                  {!v.active ? (
                    <span className="text-[0.5625rem] tracking-[0.15em] uppercase text-primary/45">
                      Link off
                    </span>
                  ) : v.expired ? (
                    <span className="inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.15em] uppercase text-amber-600">
                      <AlertTriangle className="w-3 h-3" /> Expired
                    </span>
                  ) : (
                    <span className="text-[0.5625rem] tracking-[0.15em] uppercase text-emerald-600">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Link + expiry — a dead link is just noise, so it's dropped */}
              {!hasEnded && (
              <div className="mt-3 pt-3 border-t border-primary/8">
                <div className="flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" />
                  <input
                    readOnly
                    value={v.checkinUrl}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 min-w-0 text-[0.6875rem] text-primary/70 bg-accent-cream/60 border border-primary/10 rounded-sm px-2 py-1.5"
                  />
                  <button
                    onClick={() => copyLink(v)}
                    title="Copy link"
                    className="p-1.5 rounded-sm text-primary/60 hover:text-secondary-terra hover:bg-accent-cream flex-shrink-0"
                  >
                    {copiedId === v._id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[0.625rem] text-primary/45 mt-1.5">
                  {v.expiryUnknown
                    ? "No expiry — this event's date can't be read (e.g. “TBA”), so the link stays open."
                    : `Works until ${fmtDateTime(v.expiresAt)}`}
                  {v.linkSentAt ? ` · emailed ${fmtDateTime(v.linkSentAt)}` : ""}
                </p>
              </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-primary/8">
                {!hasEnded && (
                  <>
                    <button
                      onClick={() => startEdit(v)}
                      className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary hover:text-secondary-terra"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    {v.email && (
                      <button
                        onClick={() => resend(v)}
                        className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary hover:text-secondary-terra"
                      >
                        <Mail className="w-3 h-3" />{" "}
                        {v.linkSentAt ? "Resend link" : "Email link"}
                      </button>
                    )}
                    <button
                      onClick={() => toggleActive(v)}
                      className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/70 hover:text-primary"
                    >
                      {v.active ? "Turn link off" : "Turn link on"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => remove(v)}
                  className="ml-auto inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
