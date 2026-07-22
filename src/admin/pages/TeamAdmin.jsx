import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, TextArea, NumberInput, Checkbox } from "../components/Field"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonPortraitGrid } from "../components/Skeleton"

const EMPTY = { name: "", role: "", description: "", photoKey: "", order: 0, surface: "about", published: true }

export default function TeamAdmin() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listTeam()
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
        await adminApi.createTeam(form)
        notify("Member added")
      } else {
        await adminApi.updateTeam(editing, form)
        notify("Member saved")
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
    if (!(await confirm({ title: "Delete this member?", confirmLabel: "Delete", danger: true }))) return
    await adminApi.deleteTeam(id)
    notify("Deleted")
    load()
  }

  return (
    <div>
      <PageHeader
        label="Teams"
        title="People Behind MIAA"
        subtitle="The team displayed on the About page."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Member
          </Button>
        }
      />

      {loading ? (
        <SkeletonPortraitGrid count={8} />
      ) : items.length === 0 ? (
        <EmptyState title="No team members yet" hint="Add a member to populate the About page grid." />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 gap-3 sm:gap-5"
        >
          {items.map((p) => (
            <motion.div
              key={p._id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="group bg-white border border-primary/10 rounded-sm p-3 sm:p-5 flex flex-col items-center text-center hover:border-secondary-terra/60 hover:shadow-md transition-all duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-cream overflow-hidden mb-2.5 sm:mb-3">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[0.625rem] tracking-[0.15em] uppercase text-primary/30">
                    No Photo
                  </div>
                )}
              </div>
              <p className="text-primary text-sm font-semibold leading-tight">{p.name}</p>
              <p className="text-primary/55 text-[0.6875rem] mt-1 leading-snug">{p.role}</p>
              <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-primary/8 w-full justify-center">
                <button
                  onClick={() => open(p)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary hover:text-secondary-terra transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => remove(p._id)}
                  className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
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
        title={editing === "new" ? "New Team Member" : "Edit Team Member"}
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
          <Field label="Role">
            <TextInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </Field>
          <Field label="Description" hint="Bio or background shown in the public profile modal">
            <TextArea
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief biography or professional background..."
            />
          </Field>
          <Field label="Order">
            <NumberInput
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </Field>
          <ImageUpload
            folder="team"
            currentKey={form.photoKey}
            onUploaded={(key) => setForm({ ...form, photoKey: key })}
            label="Portrait"
          />
          <Checkbox
            label="Published"
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
        </div>
      </Drawer>
    </div>
  )
}
