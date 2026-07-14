import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import ConfirmDialog from "../components/ConfirmDialog"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, NumberInput, Checkbox } from "../components/Field"
import { useToast } from "../components/Toast"
import { SkeletonCardGrid } from "../components/Skeleton"

const EMPTY = { name: "", url: "", tier: "", logoKey: "", order: 0, surface: "gala", published: true }

export default function SponsorsAdmin() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [confirming, setConfirming] = useState(null) // sponsor pending deletion
  const [deleting, setDeleting] = useState(false)
  const { notify } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listSponsors()
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

  const open = (item) => {
    if (item) {
      setEditing(item._id)
      setForm({ ...EMPTY, ...item })
    } else {
      setEditing("new")
      setForm(EMPTY)
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
      if (editing === "new") {
        await adminApi.createSponsor(form)
        notify("Sponsor added")
      } else {
        await adminApi.updateSponsor(editing, form)
        notify("Sponsor saved")
      }
      close()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const remove = async () => {
    if (!confirming) return
    setDeleting(true)
    try {
      await adminApi.deleteSponsor(confirming._id)
      notify("Deleted")
      setConfirming(null)
      load()
    } catch (err) {
      notify(err.message || "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        label="Sponsors"
        title="Gala Dinner Sponsors"
        subtitle="Logos shown in the sponsors marquee on the Gala Dinner page."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Sponsor
          </Button>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={6} columns="md:grid-cols-2 xl:grid-cols-3" />
      ) : items.length === 0 ? (
        <EmptyState title="No sponsors yet" hint="Add a sponsor to populate the Gala Dinner marquee." />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {items.map((s) => (
            <motion.div
              key={s._id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="group bg-white border border-primary/10 rounded-sm p-5 flex flex-col items-center text-center hover:border-secondary-terra/60 hover:shadow-md transition-all duration-300"
            >
              <div className="w-full h-24 rounded-sm bg-accent-cream/60 overflow-hidden mb-3 flex items-center justify-center p-3">
                {s.logoUrl ? (
                  <img src={s.logoUrl} alt={s.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/30">
                    No Logo
                  </div>
                )}
              </div>
              <p className="text-primary text-sm font-semibold leading-tight">{s.name}</p>
              <p className="text-primary/55 text-[0.6875rem] mt-1 leading-snug">
                {s.tier || "—"}
                {!s.published && " · Hidden"}
              </p>
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[0.625rem] text-primary/45 hover:text-secondary-terra transition-colors mt-1 max-w-full truncate"
                >
                  <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="truncate">{s.url.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
              <div className="flex gap-2 mt-4 pt-3 border-t border-primary/8 w-full justify-center">
                <button
                  onClick={() => open(s)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary hover:text-secondary-terra transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setConfirming(s)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? "New Sponsor" : "Edit Sponsor"}
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
          <Field label="Name">
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Website URL" hint="Optional — clicking the logo opens this in a new tab">
            <TextInput
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com"
            />
          </Field>
          <Field label="Tier" hint="Optional label, e.g. Gold, Silver, Partner">
            <TextInput value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })} />
          </Field>
          <Field label="Order">
            <NumberInput
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </Field>
          <ImageUpload
            folder="sponsors"
            currentKey={form.logoKey}
            onUploaded={(key) => setForm({ ...form, logoKey: key })}
            label="Logo"
          />
          <Checkbox
            label="Published"
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete sponsor?"
        message={
          confirming
            ? `"${confirming.name}" will be removed from the Gala Dinner marquee. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  )
}
