import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Heading as HeadingIcon,
  Image as ImageIcon,
  List,
  Plus,
  Quote,
  Trash2,
  Type,
  AlignLeft,
} from "lucide-react"
import { BLOCK_TYPES, blockMeta, emptyBlock, nextBlockKey } from "../../lib/blogBlocks"
import { TextInput, TextArea, Checkbox } from "./Field"
import ImageUpload from "./ImageUpload"

const ICONS = {
  intro: Type,
  paragraph: AlignLeft,
  heading: HeadingIcon,
  list: List,
  quote: Quote,
  image: ImageIcon,
}

const nextKey = nextBlockKey

/**
 * Block builder for a blog post body — the editor picks a block type and fills
 * in plain text; no HTML is ever typed. The value is the block array described
 * in `lib/blogBlocks.js`.
 */
export default function BlogBlockEditor({ blocks, onChange }) {
  const list = blocks || []

  const update = (i, patch) =>
    onChange(list.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))

  const add = (type) => onChange([...list, { ...emptyBlock(type), _k: nextKey() }])

  const duplicate = (i) => {
    const copy = { ...list[i], _k: nextKey() }
    onChange([...list.slice(0, i + 1), copy, ...list.slice(i + 1)])
  }

  const remove = (i) => onChange(list.filter((_, idx) => idx !== i))

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <p className="block text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-1.5">
        Article Body
      </p>
      <p className="text-[0.6875rem] text-primary/50 mb-3">
        Build the article one block at a time — pick a block, type the text. No HTML needed.
      </p>

      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {list.map((block, i) => (
            <motion.div
              key={block._k || i}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: -12 }}
              transition={{ duration: 0.2 }}
              className="border border-primary/15 rounded-sm bg-white overflow-hidden"
            >
              <BlockHeader
                block={block}
                index={i}
                count={list.length}
                onMove={(dir) => move(i, dir)}
                onDuplicate={() => duplicate(i)}
                onRemove={() => remove(i)}
              />
              <div className="p-3 pt-2.5">
                <BlockFields block={block} onChange={(patch) => update(i, patch)} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <p className="text-sm text-primary/45 border border-dashed border-primary/20 rounded-sm px-4 py-6 text-center bg-accent-cream/40">
            No blocks yet — add a lead paragraph to begin.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {BLOCK_TYPES.map((t) => {
          const Icon = ICONS[t.type] || Plus
          return (
            <button
              key={t.type}
              type="button"
              onClick={() => add(t.type)}
              title={t.hint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[0.625rem] tracking-[0.15em] uppercase text-primary/75 bg-white border border-primary/15 rounded-sm hover:border-secondary-terra/60 hover:text-secondary-terra transition-colors"
            >
              <Plus className="w-3 h-3" strokeWidth={2.5} />
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BlockHeader({ block, index, count, onMove, onDuplicate, onRemove }) {
  const meta = blockMeta(block.type)
  const Icon = ICONS[block.type] || AlignLeft
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-accent-cream/50 border-b border-primary/10">
      <Icon className="w-3.5 h-3.5 text-secondary-terra" />
      <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/70">
        {meta.label}
      </span>
      <span className="text-[0.625rem] text-primary/35">#{index + 1}</span>
      <div className="ml-auto flex items-center gap-0.5">
        <IconBtn label="Move up" onClick={() => onMove(-1)} disabled={index === 0}>
          <ChevronUp className="w-3.5 h-3.5" />
        </IconBtn>
        <IconBtn label="Move down" onClick={() => onMove(1)} disabled={index === count - 1}>
          <ChevronDown className="w-3.5 h-3.5" />
        </IconBtn>
        <IconBtn label="Duplicate" onClick={onDuplicate}>
          <Copy className="w-3 h-3" />
        </IconBtn>
        <IconBtn label="Remove block" onClick={onRemove} danger>
          <Trash2 className="w-3 h-3" />
        </IconBtn>
      </div>
    </div>
  )
}

function IconBtn({ children, label, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 inline-flex items-center justify-center rounded-sm transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${
        danger
          ? "text-primary/50 hover:text-rose-600 hover:bg-rose-50"
          : "text-primary/60 hover:text-secondary-terra hover:bg-white"
      }`}
    >
      {children}
    </button>
  )
}

function BlockFields({ block, onChange }) {
  const meta = blockMeta(block.type)

  if (block.type === "heading") {
    return (
      <TextInput
        value={block.text || ""}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder={meta.placeholder}
      />
    )
  }

  if (block.type === "list") {
    return <ListFields block={block} onChange={onChange} />
  }

  if (block.type === "quote") {
    return (
      <div className="flex flex-col gap-2">
        <AutoTextArea
          value={block.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder={meta.placeholder}
          minRows={2}
        />
        <TextInput
          value={block.attribution || ""}
          onChange={(e) => onChange({ attribution: e.target.value })}
          placeholder="Attribution (optional) — e.g. Dr Amina Khan, Curator"
        />
      </div>
    )
  }

  if (block.type === "image") {
    return (
      <div className="flex flex-col gap-2">
        <ImageUpload
          folder="blog"
          label=""
          currentKey={block.imageKey}
          onUploaded={(key) => onChange({ imageKey: key, imageUrl: "" })}
        />
        <TextInput
          value={block.caption || ""}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Caption (optional)"
        />
      </div>
    )
  }

  return (
    <AutoTextArea
      value={block.text || ""}
      onChange={(e) => onChange({ text: e.target.value })}
      placeholder={meta.placeholder}
      minRows={block.type === "intro" ? 3 : 4}
    />
  )
}

function ListFields({ block, onChange }) {
  const items = block.items?.length ? block.items : [""]

  const setItem = (i, value) =>
    onChange({ items: items.map((it, idx) => (idx === i ? value : it)) })

  const addItem = (at = items.length) =>
    onChange({ items: [...items.slice(0, at), "", ...items.slice(at)] })

  const removeItem = (i) =>
    onChange({ items: items.length === 1 ? [""] : items.filter((_, idx) => idx !== i) })

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-primary/40 w-4 text-right shrink-0">
            {block.ordered ? `${i + 1}.` : "•"}
          </span>
          <TextInput
            value={item}
            onChange={(e) => setItem(i, e.target.value)}
            onKeyDown={(e) => {
              // Enter adds the next point, the way a list behaves everywhere else.
              if (e.key === "Enter") {
                e.preventDefault()
                addItem(i + 1)
              }
            }}
            placeholder={i === 0 ? "First point" : "Next point"}
          />
          <IconBtn label="Remove point" onClick={() => removeItem(i)} danger>
            <Trash2 className="w-3 h-3" />
          </IconBtn>
        </div>
      ))}
      <div className="flex items-center gap-4 pl-6">
        <button
          type="button"
          onClick={() => addItem()}
          className="inline-flex items-center gap-1 text-[0.625rem] tracking-[0.2em] uppercase text-primary/60 hover:text-secondary-terra transition-colors"
        >
          <Plus className="w-3 h-3" /> Add point
        </button>
        <Checkbox
          label="Numbered"
          checked={!!block.ordered}
          onChange={(v) => onChange({ ordered: v })}
        />
      </div>
    </div>
  )
}

/** Textarea that grows with its content, so long paragraphs stay readable. */
function AutoTextArea({ value, minRows = 3, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return <TextArea ref={ref} rows={minRows} value={value} {...props} />
}
