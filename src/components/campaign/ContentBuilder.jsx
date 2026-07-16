import { useEffect, useState } from "react"
import {
  Type,
  AlignLeft,
  Image as ImageIcon,
  Quote,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react"
import { newBlock } from "./blocks"

const BASE = (import.meta.env.VITE_API_URL || "https://miaa-backend.onrender.com").replace(/\/$/, "")

async function signGet(key) {
  if (!key) return ""
  try {
    const r = await fetch(`${BASE}/api/uploads/sign-get?key=${encodeURIComponent(key)}`)
    if (!r.ok) return ""
    const d = await r.json()
    return d.url || ""
  } catch {
    return ""
  }
}

const inputCls =
  "w-full py-2.5 px-3 bg-white border border-primary/12 text-primary rounded-md text-sm placeholder:text-primary/30 focus:border-secondary-terra focus:outline-none transition-colors"

const BLOCK_TYPES = [
  { type: "heading", label: "Heading", icon: Type },
  { type: "paragraph", label: "Text", icon: AlignLeft },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "quote", label: "Quote", icon: Quote },
]

function TypePicker({ onPick, onClose }) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-primary/[0.04] border border-primary/10">
      {BLOCK_TYPES.map((t) => (
        <button
          key={t.type}
          type="button"
          onClick={() => onPick(t.type)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-primary/10 text-[0.75rem] text-primary hover:border-secondary-terra hover:text-secondary-terra transition-colors"
        >
          <t.icon className="w-3.5 h-3.5" /> {t.label}
        </button>
      ))}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-primary/40 hover:text-primary p-1"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function ImageBlock({ block, onChange, uploadImage }) {
  const [preview, setPreview] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let alive = true
    if (block.imageKey) {
      signGet(block.imageKey).then((u) => {
        if (alive) setPreview((p) => p || u)
      })
    }
    return () => {
      alive = false
    }
  }, [block.imageKey])

  const onFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    setPreview(URL.createObjectURL(f))
    try {
      const key = await uploadImage(f)
      onChange({ imageKey: key })
    } catch {
      // ignore — user can retry
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt=""
            className="w-full max-h-56 object-contain rounded-md bg-primary/[0.03] border border-primary/10"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
          <label className="absolute top-2 right-2 cursor-pointer px-2 py-1 rounded bg-white/90 text-[0.625rem] uppercase tracking-wide text-primary hover:bg-white">
            Replace
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 py-8 rounded-md border-2 border-dashed border-primary/15 cursor-pointer hover:border-secondary-terra/50 transition-colors">
          {uploading ? (
            <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
          ) : (
            <ImageIcon className="w-6 h-6 text-primary/30" />
          )}
          <span className="text-[0.75rem] text-primary/40">Upload an image</span>
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
      )}
      <input
        value={block.caption || ""}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="Caption (optional)"
        className={inputCls}
      />
    </div>
  )
}

export default function ContentBuilder({ value = [], onChange, uploadImage }) {
  const blocks = Array.isArray(value) ? value : []
  const [adding, setAdding] = useState(null) // block index (add-after), "end", or null

  const set = (next) => onChange(next)
  const update = (i, patch) =>
    set(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  const remove = (i) => set(blocks.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = blocks.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    set(next)
  }
  const insertAt = (index, type) => {
    const next = blocks.slice()
    next.splice(index, 0, newBlock(type))
    set(next)
    setAdding(null)
  }

  return (
    <div className="space-y-3">
      {blocks.length === 0 && (
        <div className="rounded-lg border border-dashed border-primary/20 p-4 text-center">
          <p className="text-[0.8125rem] text-primary/50 mb-3">
            Build a rich campaign page — add headings, text, images and quotes.
          </p>
          <TypePicker onPick={(t) => insertAt(0, t)} />
        </div>
      )}

      {blocks.map((b, i) => (
        <div key={b.id || i} className="rounded-lg border border-primary/12 bg-white p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.625rem] tracking-[0.15em] uppercase text-primary/40 font-semibold">
              {b.type}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="p-1 text-primary/40 hover:text-primary disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
                className="p-1 text-primary/40 hover:text-primary disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-1 text-primary/40 hover:text-rose-600"
                aria-label="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {b.type === "heading" && (
            <div className="flex gap-2 items-center">
              <input
                value={b.text}
                onChange={(e) => update(i, { text: e.target.value })}
                placeholder="Heading text"
                className={`${inputCls} text-base font-medium`}
              />
              <select
                value={b.level}
                onChange={(e) => update(i, { level: Number(e.target.value) })}
                className="py-2.5 px-2 rounded-md border border-primary/12 text-sm text-primary bg-white cursor-pointer"
              >
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            </div>
          )}

          {b.type === "paragraph" && (
            <textarea
              value={b.text}
              onChange={(e) => update(i, { text: e.target.value })}
              rows={4}
              placeholder="Write a paragraph…"
              className={`${inputCls} resize-none`}
            />
          )}

          {b.type === "quote" && (
            <div className="space-y-2">
              <textarea
                value={b.text}
                onChange={(e) => update(i, { text: e.target.value })}
                rows={2}
                placeholder="Quote text"
                className={`${inputCls} resize-none italic`}
              />
              <input
                value={b.cite || ""}
                onChange={(e) => update(i, { cite: e.target.value })}
                placeholder="Attribution (optional)"
                className={inputCls}
              />
            </div>
          )}

          {b.type === "image" && (
            <ImageBlock
              block={b}
              onChange={(patch) => update(i, patch)}
              uploadImage={uploadImage}
            />
          )}

          <div className="mt-3 pt-2 border-t border-primary/8">
            {adding === i ? (
              <TypePicker onPick={(t) => insertAt(i + 1, t)} onClose={() => setAdding(null)} />
            ) : (
              <button
                type="button"
                onClick={() => setAdding(i)}
                className="inline-flex items-center gap-1 text-[0.6875rem] tracking-[0.1em] uppercase text-secondary-terra hover:text-secondary-rust"
              >
                <Plus className="w-3 h-3" /> Add section below
              </button>
            )}
          </div>
        </div>
      ))}

      {blocks.length > 0 &&
        (adding === "end" ? (
          <TypePicker onPick={(t) => insertAt(blocks.length, t)} onClose={() => setAdding(null)} />
        ) : (
          <button
            type="button"
            onClick={() => setAdding("end")}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed border-primary/20 text-[0.75rem] text-primary/60 hover:border-secondary-terra hover:text-secondary-terra transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add section
          </button>
        ))}
    </div>
  )
}
