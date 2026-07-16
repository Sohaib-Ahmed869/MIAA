import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, LayoutGrid, List } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, NumberInput, Select, Checkbox } from "../components/Field"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonList } from "../components/Skeleton"
import FilterTabs from "../components/FilterTabs"

const EMPTY = { title: "", subtitle: "", imageKey: "", date: "", surface: "homepage", order: 0, published: true }

const SURFACE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "homepage", label: "Homepage" },
  { value: "offsite", label: "Offsite" },
]

export default function PreviousEventsAdmin() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState("list")
  const { notify } = useToast()
  const confirm = useConfirm()

  const filtered = useMemo(
    () => filter === "all" ? items : items.filter((it) => it.surface === filter),
    [items, filter]
  )

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listPreviousEvents()
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
      .listPreviousEvents()
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
        await adminApi.createPreviousEvent(form)
        notify("Created")
      } else {
        await adminApi.updatePreviousEvent(editing, form)
        notify("Saved")
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
    if (!(await confirm({ title: "Delete this entry?", confirmLabel: "Delete", danger: true }))) return
    await adminApi.deletePreviousEvent(id)
    notify("Deleted")
    load()
  }

  return (
    <div>
      <PageHeader
        label="Archive"
        title="Previous Events"
        subtitle="Past events listed in the &lsquo;Previous Events&rsquo; row on the homepage or the dedicated Offsite Events page."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Entry
          </Button>
        }
      />

      {/* Toolbar — filter + view toggle */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <FilterTabs value={filter} onChange={setFilter} options={SURFACE_OPTIONS} />
        <div className="inline-flex items-center gap-0.5 bg-white border border-primary/10 rounded-full p-1 shadow-sm shadow-primary/5">
          <button
            onClick={() => setView("list")}
            className={`grid place-items-center w-8 h-8 rounded-full transition-colors ${view === "list" ? "bg-primary text-white shadow-sm shadow-primary/20" : "text-primary/45 hover:bg-primary/[0.06] hover:text-primary"}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`grid place-items-center w-8 h-8 rounded-full transition-colors ${view === "grid" ? "bg-primary text-white shadow-sm shadow-primary/20" : "text-primary/45 hover:bg-primary/[0.06] hover:text-primary"}`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonList count={5} withThumb />
      ) : filtered.length === 0 ? (
        <EmptyState title="No previous events" hint="They&apos;ll appear in the public lists once added." />
      ) : view === "list" ? (
        /* ── List view ── */
        <motion.ul
          key="list"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="bg-white border border-primary/10 rounded-sm divide-y divide-primary/8 overflow-hidden"
        >
          {filtered.map((it) => (
            <motion.li
              key={it._id}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-4 px-5 py-3 hover:bg-accent-cream/60 transition-colors"
            >
              <div className="w-16 h-12 bg-accent-cream rounded-sm overflow-hidden flex-shrink-0">
                {it.imageUrl && (
                  <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-primary text-sm font-medium truncate">{it.title}</p>
                <p className="text-[0.6875rem] text-primary/55 tracking-wide uppercase">
                  {it.surface} {it.subtitle && `· ${it.subtitle}`} {it.date && `· ${it.date}`}
                </p>
              </div>
              <button
                onClick={() => open(it)}
                className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary hover:text-secondary-terra transition-colors"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => remove(it._id)}
                className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        /* ── Grid view ── */
        <motion.div
          key="grid"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 gap-4"
        >
          {filtered.map((it) => (
            <motion.div
              key={it._id}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-primary/10 rounded-sm overflow-hidden group"
            >
              <div className="aspect-[4/3] bg-accent-cream overflow-hidden">
                {it.imageUrl && (
                  <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="px-3 py-3">
                <p className="text-primary text-sm font-medium truncate">{it.title}</p>
                {it.subtitle && (
                  <p className="text-[0.6875rem] text-primary/50 truncate">{it.subtitle}</p>
                )}
                <p className="text-[0.625rem] text-primary/45 tracking-wide uppercase mt-1">
                  {it.surface} {it.date && `· ${it.date}`}
                </p>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-primary/8">
                  <button
                    onClick={() => open(it)}
                    className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary hover:text-secondary-terra transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(it._id)}
                    className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.15em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
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
        title={editing === "new" ? "New Previous Event" : "Edit Previous Event"}
        subtitle="Title + image is enough; the public list uses the hover-image effect."
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
          <Field label="Title">
            <TextInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Subtitle" hint="Optional — e.g. 'ISRA Academy'">
            <TextInput
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. ISRA Academy"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Surface">
              <Select
                value={form.surface}
                onChange={(e) => setForm({ ...form, surface: e.target.value })}
              >
                <option value="homepage">Homepage</option>
                <option value="offsite">Offsite Events page</option>
              </Select>
            </Field>
            <Field label="Order">
              <NumberInput
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Date (display)">
            <TextInput
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
          <ImageUpload
            folder="previous-events"
            currentKey={form.imageKey}
            onUploaded={(key) => setForm({ ...form, imageKey: key })}
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
