import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import ImageUpload from "../components/ImageUpload"
import { Field, TextInput, TextArea, Select, Checkbox } from "../components/Field"
import BlogBlockEditor from "../components/BlogBlockEditor"
import { blocksToHtml, cleanBlocks, emptyBlock, toBlocks, withKeys } from "../../lib/blogBlocks"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonCardGrid } from "../components/Skeleton"

const EMPTY = {
  slug: "",
  title: "",
  description: "",
  body: "",
  blocks: [],
  category: "Blog",
  author: "MIAA Team",
  date: "",
  coverImageKey: "",
  featured: false,
  published: true,
}

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function BlogAdmin() {
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
      const data = await adminApi.listBlog()
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
      // A post written before the builder has HTML in `body` and no blocks —
      // parse it so it opens as editable blocks rather than raw markup.
      setForm({
        ...EMPTY,
        ...item,
        blocks: withKeys(toBlocks(item.blocks?.length ? item.blocks : item.body) || []),
      })
    } else {
      setEditing("new")
      // Start with a lead paragraph so the builder opens on something to type in.
      setForm({ ...EMPTY, blocks: withKeys([emptyBlock("intro")]) })
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
      const blocks = cleanBlocks(form.blocks)
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        blocks,
        // `body` stays in sync as HTML so anything still reading it — and any
        // future export — sees the same article the builder produced.
        body: blocksToHtml(blocks),
      }
      if (editing === "new") {
        await adminApi.createBlog(payload)
        notify("Post created")
      } else {
        await adminApi.updateBlog(editing, payload)
        notify("Post saved")
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
    if (!(await confirm({ title: "Delete this post?", confirmLabel: "Delete", danger: true }))) return
    await adminApi.deleteBlog(id)
    notify("Post deleted")
    load()
  }

  return (
    <div>
      <PageHeader
        label="Blog"
        title="Updates &amp; Blog Posts"
        subtitle="Manage the MIAA Updates row and the longer-form Blog posts shown on the Updates &amp; Blog page."
        actions={
          <Button onClick={() => open(null)} variant="primary" withArrow>
            <Plus className="w-3.5 h-3.5 -ml-0.5 mr-0.5" strokeWidth={2.5} />
            New Post
          </Button>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={6} withImage />
      ) : items.length === 0 ? (
        <EmptyState
          title="No posts yet"
          hint="Add your first post to populate the Updates &amp; Blog page."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4"
        >
          {items.map((it) => (
            <motion.div
              key={it._id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="group bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-secondary-terra/60 hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[16/10] bg-accent-cream relative overflow-hidden">
                {it.coverImageKey ? (
                  <CoverImage imageKey={it.coverImageKey} alt={it.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 text-[0.625rem] tracking-[0.2em] uppercase">
                    No Cover
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
                {it.featured && (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[0.5625rem] tracking-[0.2em] uppercase px-2 py-1 rounded-sm bg-accent-wheat text-primary font-semibold">
                    <Star className="w-2.5 h-2.5" fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[0.625rem] tracking-[0.2em] uppercase text-secondary-terra mb-1">
                  {it.date || (it.publishedAt && new Date(it.publishedAt).toLocaleDateString())}
                </p>
                <p className="text-base font-medium text-primary leading-tight mb-1">
                  {it.title}
                </p>
                <p className="text-xs text-primary/55 italic">/{it.slug}</p>
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
        title={editing === "new" ? "New Post" : "Edit Post"}
        subtitle="Updates appear in the &lsquo;MIAA Updates&rsquo; row; Blog posts in the &lsquo;MIAA Blog Posts&rsquo; row."
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
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Blog">Blog Post</option>
                <option value="Update">Update</option>
              </Select>
            </Field>
            <Field label="Display Date" hint='e.g. "December 16, 2025"'>
              <TextInput
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="December 16, 2025"
              />
            </Field>
          </div>
          <Field label="Title">
            <TextInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onBlur={() => {
                if (!form.slug && form.title) {
                  setForm((f) => ({ ...f, slug: slugify(f.title) }))
                }
              }}
              placeholder="Stories Behind the Creative Process"
            />
          </Field>
          <Field label="Slug" hint="URL-friendly id; auto-generated from the title">
            <TextInput
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder="stories-behind-the-creative-process"
            />
          </Field>
          <Field label="Author">
            <TextInput
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </Field>
          <Field label="Short description" hint="Shown on the card and at the top of the detail page">
            <TextArea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <ImageUpload
            folder="blog"
            currentKey={form.coverImageKey}
            onUploaded={(key) => setForm({ ...form, coverImageKey: key })}
            label="Cover Image"
          />
          <BlogBlockEditor
            blocks={form.blocks}
            onChange={(blocks) => setForm((f) => ({ ...f, blocks }))}
          />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2">
            <Checkbox
              label="Published"
              checked={form.published}
              onChange={(v) => setForm({ ...form, published: v })}
            />
            <Checkbox
              label="Featured (Blog hero card)"
              checked={form.featured}
              onChange={(v) => setForm({ ...form, featured: v })}
            />
          </div>
        </div>
      </Drawer>
    </div>
  )
}

function CoverImage({ imageKey, alt }) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    let cancelled = false
    const base = (import.meta.env.VITE_API_URL || "https://miaa-backend.onrender.com").replace(/\/$/, "")
    fetch(`${base}/api/uploads/sign-get?key=${encodeURIComponent(imageKey)}`)
      .then((r) => (r.ok ? r.json() : { url: "" }))
      .then((d) => !cancelled && setUrl(d.url || ""))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [imageKey])
  if (!url) return null
  return (
    <img
      src={url}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  )
}
