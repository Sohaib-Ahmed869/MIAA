import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Archive, RotateCcw } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, NumberInput, TextArea, Select, Checkbox } from "../components/Field"
import { useToast } from "../components/Toast"
import { SkeletonCardGrid } from "../components/Skeleton"
import FilterTabs, { PillToggle } from "../components/FilterTabs"
import { useConfirm } from "../../components/ui/ConfirmDialog"

const CATEGORIES = [
  { value: "education", label: "Education" },
  { value: "zakat", label: "Zakat" },
  { value: "sadaqah", label: "Sadaqah" },
  { value: "building", label: "Building" },
  { value: "general", label: "General" },
  { value: "other", label: "Other" },
]

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  category: "general",
  imageKey: "",
  goalAmount: 0,
  isActive: true,
  isFeatured: false,
  order: 0,
  published: true,
}

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function DonationProductsAdmin() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("all")
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()
  const confirm = useConfirm()

  const filtered = items.filter(
    (it) =>
      (filter === "all" || it.category === filter) &&
      (showArchived || !it.archived),
  )
  const archivedCount = items.filter((it) => it.archived).length

  // Reusable reload for event handlers (save/archive/restore/delete).
  const load = async () => {
    try {
      const data = await adminApi.listDonationProducts()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch — inlined (not a call to load) to satisfy the effect linter.
  useEffect(() => {
    let alive = true
    adminApi
      .listDonationProducts()
      .then((data) => {
        if (alive) setItems(data)
      })
      .catch((err) => {
        if (alive) setError(err.message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
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
      const payload = {
        ...form,
        slug: slugify(form.slug || form.name),
        goalAmount: Number(form.goalAmount) || 0,
      }
      if (editing === "new") {
        await adminApi.createDonationProduct(payload)
        notify("Product created")
      } else {
        await adminApi.updateDonationProduct(editing, payload)
        notify("Product saved")
      }
      close()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const archive = async (id) => {
    const ok = await confirm({
      title: "Archive this product?",
      message:
        "It will be removed from the public donations page, but all existing donation records are kept. You can restore it anytime.",
      confirmLabel: "Archive",
    })
    if (!ok) return
    try {
      await adminApi.archiveDonationProduct(id)
      notify("Product archived")
      load()
    } catch (err) {
      notify(err.message || "Archive failed", "error")
    }
  }

  const restore = async (id) => {
    try {
      await adminApi.unarchiveDonationProduct(id)
      notify("Product restored — republish it to show on the site")
      load()
    } catch (err) {
      notify(err.message || "Restore failed", "error")
    }
  }

  const remove = async (id) => {
    const ok = await confirm({
      title: "Delete this product?",
      message:
        "This permanently deletes the product and can't be undone. Products with donations can't be deleted — archive them instead.",
      confirmLabel: "Delete",
      danger: true,
    })
    if (!ok) return
    try {
      await adminApi.deleteDonationProduct(id)
      notify("Product deleted")
      load()
    } catch (err) {
      notify(err.message || "Delete failed", "error")
    }
  }

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Donation Products"
        subtitle="Manage the causes and categories donors can contribute to."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Product
          </Button>
        }
      />

      {/* Category filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[{ value: "all", label: "All" }, ...CATEGORIES]}
        />
        {archivedCount > 0 && (
          <PillToggle
            active={showArchived}
            onClick={() => setShowArchived((s) => !s)}
            activeClass="bg-slate-600 text-white"
          >
            {showArchived ? "Hide" : "Show"} Archived ({archivedCount})
          </PillToggle>
        )}
        <span className="text-[0.625rem] text-primary/40">
          {filtered.length} of {items.length} products
        </span>
      </div>

      {loading ? (
        <SkeletonCardGrid count={6} withImage />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No donation products yet"
          hint="Add your first cause or category for donors to contribute to."
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
              className={`group bg-white border rounded-sm overflow-hidden hover:shadow-md transition-all duration-300 ${
                it.archived
                  ? "border-primary/10 opacity-60"
                  : "border-primary/10 hover:border-secondary-terra/60"
              }`}
            >
              <div className="aspect-[16/10] bg-accent-cream relative overflow-hidden">
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 text-[0.625rem] tracking-[0.2em] uppercase">
                    No Image
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm ${
                    it.archived
                      ? "bg-slate-600/90 text-white"
                      : it.published
                        ? "bg-emerald-500/90 text-white"
                        : "bg-white/85 text-primary/70"
                  }`}
                >
                  {it.archived ? "Archived" : it.published ? "Published" : "Draft"}
                </span>
                <span className="absolute top-3 right-3 text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm bg-primary/85 text-accent-cream">
                  {it.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-base font-medium text-primary leading-tight mb-1">
                  {it.name}
                </p>
                {it.goalAmount > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[0.625rem] tracking-[0.2em] uppercase text-primary/60 mb-1">
                      <span>${((it.raisedAmount || 0) / 100).toLocaleString()} raised</span>
                      <span>${(it.goalAmount / 100).toLocaleString()} goal</span>
                    </div>
                    <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary-terra rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, ((it.raisedAmount || 0) / it.goalAmount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {it.description && (
                  <p className="text-[0.8125rem] text-primary/75 mt-3 line-clamp-2">
                    {it.description}
                  </p>
                )}
                <div className="flex gap-2 mt-4 pt-4 border-t border-primary/8">
                  <button
                    onClick={() => open(it)}
                    className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary hover:text-secondary-terra transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  {it.archived ? (
                    <>
                      <button
                        onClick={() => restore(it._id)}
                        className="ml-auto inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/60 hover:text-emerald-600 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                      <button
                        onClick={() => remove(it._id)}
                        className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => archive(it._id)}
                      className="ml-auto inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50 hover:text-amber-600 transition-colors"
                    >
                      <Archive className="w-3 h-3" /> Archive
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? "New Donation Product" : "Edit Donation Product"}
        subtitle="Configure a cause or category that donors can contribute to."
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
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Education Fund"
            />
          </Field>
          <Field label="URL Slug" hint="Auto-generated from name if left blank.">
            <TextInput
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              onBlur={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder={slugify(form.name || "")}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Goal Amount (cents)" hint="0 = no goal">
              <NumberInput
                value={form.goalAmount}
                onChange={(e) => setForm({ ...form, goalAmount: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Description">
            <TextArea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Describe what this donation supports…"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Order" hint="Lower numbers appear first">
              <NumberInput
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>
          </div>
          <ImageUpload
            folder="donations"
            currentKey={form.imageKey}
            onUploaded={(key) => setForm({ ...form, imageKey: key })}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
            <Checkbox
              label="Published"
              checked={form.published}
              onChange={(v) => setForm({ ...form, published: v })}
            />
            <Checkbox
              label="Featured"
              checked={form.isFeatured}
              onChange={(v) => setForm({ ...form, isFeatured: v })}
            />
            <Checkbox
              label="Active"
              checked={form.isActive}
              onChange={(v) => setForm({ ...form, isActive: v })}
            />
          </div>
        </div>
      </Drawer>
    </div>
  )
}
