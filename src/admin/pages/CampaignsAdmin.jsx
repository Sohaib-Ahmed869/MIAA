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
import { SkeletonCardGrid } from "../components/Skeleton"

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const EMPTY = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  imageKey: "",
  goalAmount: 0,
  startDate: "",
  endDate: "",
  status: "draft",
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

export default function CampaignsAdmin() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("all")
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notify } = useToast()

  const filtered =
    filter === "all" ? items : items.filter((it) => it.status === filter)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listCampaigns()
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
      setForm({
        ...EMPTY,
        ...item,
        startDate: item.startDate ? item.startDate.slice(0, 10) : "",
        endDate: item.endDate ? item.endDate.slice(0, 10) : "",
      })
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
        slug: slugify(form.slug || form.title),
        goalAmount: Number(form.goalAmount) || 0,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      }
      if (editing === "new") {
        await adminApi.createCampaign(payload)
        notify("Campaign created")
      } else {
        await adminApi.updateCampaign(editing, payload)
        notify("Campaign saved")
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
    if (!confirm("Delete this campaign?")) return
    await adminApi.deleteCampaign(id)
    notify("Campaign deleted")
    load()
  }

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Campaigns & Appeals"
        subtitle="Manage fundraising campaigns with goals and deadlines."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Campaign
          </Button>
        }
      />

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[{ value: "all", label: "All" }, ...STATUSES].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 text-[0.625rem] tracking-[0.2em] uppercase rounded-sm border transition-colors ${
              filter === opt.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-primary/70 border-primary/15 hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-[0.625rem] text-primary/40 ml-2">
          {filtered.length} of {items.length} campaigns
        </span>
      </div>

      {loading ? (
        <SkeletonCardGrid count={4} withImage />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          hint="Create your first fundraising campaign."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
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
                    it.status === "active"
                      ? "bg-emerald-500/90 text-white"
                      : it.status === "completed"
                      ? "bg-primary/80 text-white"
                      : "bg-white/85 text-primary/70"
                  }`}
                >
                  {it.status}
                </span>
              </div>
              <div className="p-4">
                <p className="text-base font-medium text-primary leading-tight mb-1">
                  {it.title}
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
                {it.endDate && (
                  <p className="text-[0.625rem] text-primary/50 mt-2">
                    Ends {new Date(it.endDate).toLocaleDateString("en-AU")}
                  </p>
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
        title={editing === "new" ? "New Campaign" : "Edit Campaign"}
        subtitle="Create a fundraising campaign with a goal and timeline."
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
              placeholder="e.g. Ramadan Appeal 2026"
            />
          </Field>
          <Field label="URL Slug" hint="Auto-generated from title if left blank.">
            <TextInput
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              onBlur={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder={slugify(form.title || "")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Goal Amount (cents)">
              <NumberInput
                value={form.goalAmount}
                onChange={(e) => setForm({ ...form, goalAmount: Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <TextInput
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </Field>
            <Field label="End Date">
              <TextInput
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Short Description">
            <TextArea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description for campaign cards…"
            />
          </Field>
          <Field label="Full Description" hint="Detailed body for the campaign page.">
            <TextArea
              value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              rows={6}
              placeholder="The full story behind this campaign…"
            />
          </Field>
          <Field label="Order" hint="Lower numbers appear first">
            <NumberInput
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </Field>
          <ImageUpload
            folder="campaigns"
            currentKey={form.imageKey}
            onUploaded={(key) => setForm({ ...form, imageKey: key })}
          />
          <div className="flex gap-6 pt-2">
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
          </div>
        </div>
      </Drawer>
    </div>
  )
}
