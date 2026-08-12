import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { UploadCloud, RotateCcw, Film, Image as ImageIcon, Link2, AlertCircle } from "lucide-react"
import { uploadMediaToS3 } from "../auth"
import { TextInput } from "./Field"

/**
 * One image / video / embed row in the Site Content editor.
 *
 * The value is always a URL string, so media saves through exactly the same
 * override map as the copy. Two states matter to the editor:
 *   • **Original** — the value equals the asset bundled with the build.
 *   • **Custom**   — a file uploaded to the public S3 media bucket.
 * "Reset" puts the original back, and publishing an original clears the
 * override entirely so future design updates flow through.
 */

const ACCEPT = {
  image: "image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml",
  video: "video/mp4,video/webm,video/quicktime",
}

const MAX_MB = { image: 10, video: 100 }

const TYPE_ICON = { image: ImageIcon, video: Film, embed: Link2 }

/** Turns a watch/share link into the embed form used by the public site. */
function toEmbedPreview(url) {
  const raw = (url || "").trim()
  if (!raw) return ""
  const yt =
    raw.match(/youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/) ||
    raw.match(/youtu\.be\/([\w-]+)/) ||
    raw.match(/youtube\.com\/shorts\/([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`
  const vimeo = raw.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return raw
}

export default function MediaField({
  field,
  value,
  defaultValue,
  altValue,
  onChange,
  onAltChange,
  folder = "general",
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [drag, setDrag] = useState(false)

  const { type, label, help, alt } = field
  const Icon = TYPE_ICON[type] || ImageIcon
  const isOriginal = !value || value === defaultValue
  const isEmbed = type === "embed"

  const handleFile = async (file) => {
    if (!file) return
    setError("")

    const limit = MAX_MB[type] ?? 10
    if (file.size > limit * 1024 * 1024) {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${limit} MB.`)
      return
    }
    if (!ACCEPT[type]?.split(",").includes(file.type)) {
      setError(`${file.type || "That file type"} isn't supported here.`)
      return
    }

    setUploading(true)
    setProgress(0)
    try {
      const url = await uploadMediaToS3(file, folder, setProgress)
      onChange(url)
    } catch (err) {
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
      setProgress(0)
      // Let the same file be picked again after a failure.
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="border border-primary/8 rounded-2xl overflow-hidden bg-accent-cream/40">
      {/* Header — label, state badge, reset */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/8 bg-white">
        <Icon className="w-3.5 h-3.5 text-secondary-terra flex-shrink-0" strokeWidth={1.75} />
        <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">{label}</span>
        {!isOriginal && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-terra/10 text-[0.625rem] text-secondary-terra">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />
            Custom
          </span>
        )}
        <span className="flex-1" />
        {!isOriginal && (
          <button
            type="button"
            onClick={() => onChange(defaultValue)}
            className="inline-flex items-center gap-1 text-[0.625rem] text-primary/40 hover:text-secondary-terra transition-colors"
            title="Put the original file back"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {isEmbed ? (
          <>
            <TextInput
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              radius="rounded-xl"
              placeholder="https://www.youtube.com/watch?v=…"
            />
            {value && (
              <div className="aspect-video w-full bg-primary/5 rounded-xl overflow-hidden">
                <iframe
                  src={toEmbedPreview(value)}
                  title={label}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDrag(true)
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`relative group rounded-xl overflow-hidden border transition-colors ${
              drag ? "border-secondary-terra" : "border-primary/10"
            }`}
          >
            {type === "video" ? (
              <video
                key={value}
                src={value}
                muted
                loop
                playsInline
                controls
                className="w-full max-h-56 bg-black object-contain block"
              />
            ) : (
              <img
                src={value}
                alt=""
                className="w-full max-h-56 object-contain bg-white block"
              />
            )}

            {/* Hover / drag overlay */}
            <div
              className={`absolute inset-0 bg-primary/45 flex items-center justify-center transition-opacity ${
                drag ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-[0.625rem] tracking-[0.15em] uppercase rounded-full shadow-sm hover:bg-accent-cream disabled:opacity-60"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                {drag ? "Drop to upload" : "Replace"}
              </button>
            </div>

            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-primary/70 flex flex-col items-center justify-center gap-2.5 px-8"
                >
                  <p className="text-[0.625rem] tracking-[0.2em] uppercase text-white">
                    Uploading {Math.round(progress * 100)}%
                  </p>
                  <div className="w-full max-w-48 h-1 bg-white/25 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-wheat transition-[width] duration-200"
                      style={{ width: `${Math.max(progress * 100, 4)}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT[type]}
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="sr-only"
            />
          </div>
        )}

        {/* Accessible description, when the registry declares one */}
        {typeof alt === "string" && (
          <div>
            <span className="block text-[0.5625rem] tracking-[0.2em] uppercase text-primary/45 mb-1">
              Description (alt text)
            </span>
            <TextInput
              radius="rounded-xl"
              value={altValue ?? ""}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Describe the image for screen readers"
            />
          </div>
        )}

        {help && <p className="text-[0.6875rem] text-primary/50">{help}</p>}

        {error && (
          <p className="flex items-start gap-1.5 text-[0.6875rem] text-rose-600">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
