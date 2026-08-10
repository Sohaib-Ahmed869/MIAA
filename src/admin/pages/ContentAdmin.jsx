import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  Search,
  Check,
  FileText,
  ChevronDown,
} from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import { TextInput, TextArea } from "../components/Field"
import { useToast } from "../components/Toast"
import { CONTENT_GROUPS, CONTENT_DEFAULTS } from "../../content/registry"

const DEVICES = {
  desktop: { label: "Desktop", icon: Monitor, width: null },
  tablet: { label: "Tablet", icon: Tablet, width: 820 },
  mobile: { label: "Mobile", icon: Smartphone, width: 390 },
}

// Build the full { key → effective string } draft from saved overrides,
// falling back to the registry default for anything not overridden.
function buildDraft(saved) {
  const out = {}
  for (const [key, def] of Object.entries(CONTENT_DEFAULTS)) {
    const override = saved?.[key]
    out[key] = typeof override === "string" && override.trim() !== "" ? override : def
  }
  return out
}

export default function ContentAdmin() {
  const { notify } = useToast()
  const iframeRef = useRef(null)
  const sectionRefs = useRef({})
  const fieldsScrollRef = useRef(null)

  const [saved, setSaved] = useState({}) // persisted overrides
  const [draft, setDraft] = useState(() => buildDraft({}))
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const [groupId, setGroupId] = useState(CONTENT_GROUPS[0].id)
  const [device, setDevice] = useState("desktop")
  const [query, setQuery] = useState("")
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [activeSection, setActiveSection] = useState(null)

  const group = useMemo(
    () => CONTENT_GROUPS.find((g) => g.id === groupId) || CONTENT_GROUPS[0],
    [groupId]
  )

  // ── Load saved overrides ───────────────────────────────────────
  useEffect(() => {
    let alive = true
    adminApi
      .getSiteContent()
      .then((res) => {
        if (!alive) return
        const values = res?.values || {}
        setSaved(values)
        setDraft(buildDraft(values))
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  // ── Live preview channel ───────────────────────────────────────
  const pushPreview = () => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage(
      { type: "miaa:preview-content", values: draft },
      window.location.origin
    )
  }

  // Respond to the iframe announcing it's ready (initial load / navigation).
  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type === "miaa:preview-ready") pushPreview()
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  // Debounced push whenever the draft changes.
  useEffect(() => {
    const id = setTimeout(pushPreview, 180)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  // ── Dirty tracking ─────────────────────────────────────────────
  const baseline = useMemo(() => buildDraft(saved), [saved])
  const dirtyKeys = useMemo(
    () => Object.keys(draft).filter((k) => draft[k] !== baseline[k]),
    [draft, baseline]
  )
  const dirty = dirtyKeys.length > 0

  const isModified = (key) => draft[key] !== (CONTENT_DEFAULTS[key] ?? "")
  const sectionEditCount = (section) =>
    section.fields.filter((f) => draft[f.key] !== baseline[f.key]).length

  const setValue = (key, value) => setDraft((d) => ({ ...d, [key]: value }))
  const resetField = (key) => setValue(key, CONTENT_DEFAULTS[key] ?? "")
  const discard = () => setDraft(buildDraft(saved))

  const save = async () => {
    if (busy || !dirty) return
    setBusy(true)
    setError("")
    // Send only changed keys; a value equal to the default clears the override.
    const patch = {}
    for (const key of dirtyKeys) {
      const def = CONTENT_DEFAULTS[key] ?? ""
      patch[key] = draft[key] === def ? "" : draft[key]
    }
    try {
      const res = await adminApi.updateSiteContent(patch)
      const values = res?.values || {}
      setSaved(values)
      setDraft(buildDraft(values))
      notify("Content saved — live on the site")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  // Cmd/Ctrl+S to publish.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, busy, dirtyKeys, draft])

  // ── Section navigation ─────────────────────────────────────────
  const jumpToSection = (sectionId) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.delete(sectionId)
      return next
    })
    setActiveSection(sectionId)
    // Wait a frame for the section to expand before scrolling.
    requestAnimationFrame(() => {
      sectionRefs.current[sectionId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  const toggleCollapse = (sectionId) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  // Reset navigation state when switching pages.
  const switchGroup = (id) => {
    setGroupId(id)
    setQuery("")
    setCollapsed(new Set())
    setActiveSection(null)
    fieldsScrollRef.current?.scrollTo?.({ top: 0 })
  }

  // Highlight the section nearest the top of the viewport as the user scrolls.
  useEffect(() => {
    const onScroll = () => {
      let current = null
      for (const section of group.sections) {
        const el = sectionRefs.current[section.id]
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top < 180) current = section.id
      }
      if (current) setActiveSection(current)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [group])

  // ── Field filtering (search) ───────────────────────────────────
  const q = query.trim().toLowerCase()
  const visibleSections = useMemo(() => {
    return group.sections
      .map((section) => ({
        ...section,
        fields: section.fields.filter((f) => {
          if (!q) return true
          return (
            f.label.toLowerCase().includes(q) ||
            f.key.toLowerCase().includes(q) ||
            String(draft[f.key] || "").toLowerCase().includes(q)
          )
        }),
      }))
      .filter((s) => s.fields.length > 0)
  }, [group, q, draft])

  const previewSrc = `${group.path}?preview=1`
  const reloadPreview = () => {
    if (iframeRef.current) iframeRef.current.src = previewSrc
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-white border border-primary/10 rounded-sm animate-pulse"
          />
        ))}
      </div>
    )
  }

  const deviceWidth = DEVICES[device].width
  const totalPageEdits = group.sections.reduce((n, s) => n + sectionEditCount(s), 0)

  return (
    <div>
      <PageHeader
        label="Content"
        title="Site Content"
        subtitle="Edit the text shown on the public website. Changes preview live on the right and go live when you save."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 items-start">
        {/* ── Left: editor ─────────────────────────────────── */}
        <div ref={fieldsScrollRef} className="space-y-4">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-4 py-3 rounded-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Sticky toolbar: page tabs + search + section navigator */}
          <div className="sticky top-2 z-20 -mx-1 px-1 pt-1 pb-2 bg-accent-cream/95 backdrop-blur-sm space-y-3">
            {/* Page selector */}
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_GROUPS.map((g) => {
                const active = g.id === groupId
                return (
                  <button
                    key={g.id}
                    onClick={() => switchGroup(g.id)}
                    className={`px-3.5 py-2 rounded-sm text-[0.8125rem] tracking-wide transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "bg-white text-primary/70 border border-primary/12 hover:border-primary/30"
                    }`}
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this page's text…"
                className="w-full py-2.5 pl-9 pr-3 bg-white border border-primary/12 rounded-sm text-sm text-primary placeholder:text-primary/30 focus:border-secondary-terra/70 focus:outline-none transition-colors"
              />
            </div>

            {/* Section navigator — jump to any section on this page */}
            {!q && group.sections.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/40 pr-1 flex-shrink-0">
                  Jump to
                </span>
                {group.sections.map((section) => {
                  const edits = sectionEditCount(section)
                  const active = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => jumpToSection(section.id)}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[0.75rem] border transition-colors ${
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-primary/65 border-primary/12 hover:border-primary/35"
                      }`}
                    >
                      {section.label}
                      {edits > 0 && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            active ? "bg-accent-wheat" : "bg-secondary-terra"
                          }`}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sections + fields */}
          {visibleSections.map((section) => {
            const isCollapsed = collapsed.has(section.id)
            const edits = sectionEditCount(section)
            return (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                className="bg-white border border-primary/10 rounded-sm scroll-mt-40"
              >
                <button
                  onClick={() => toggleCollapse(section.id)}
                  className="w-full px-6 py-4 border-b border-primary/8 flex items-center gap-3 text-left hover:bg-accent-cream/30 transition-colors"
                >
                  <FileText className="w-4 h-4 text-secondary-terra flex-shrink-0" strokeWidth={1.75} />
                  <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/55 flex-1">
                    {section.label}
                  </p>
                  {edits > 0 && (
                    <span className="inline-flex items-center gap-1 text-[0.625rem] text-secondary-terra">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />
                      {edits} edited
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-primary/35 transition-transform ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-5 space-y-5">
                        {section.fields.map((f) => {
                          const modified = isModified(f.key)
                          return (
                            <div key={f.key}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="flex items-center gap-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                                  {f.label}
                                  {modified && (
                                    <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[0.625rem] text-secondary-terra">
                                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />
                                      Edited
                                    </span>
                                  )}
                                </span>
                                {modified && (
                                  <button
                                    onClick={() => resetField(f.key)}
                                    className="inline-flex items-center gap-1 text-[0.625rem] text-primary/45 hover:text-secondary-terra transition-colors"
                                    title="Reset to original text"
                                  >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                  </button>
                                )}
                              </div>
                              {f.type === "text" ? (
                                <TextInput
                                  value={draft[f.key] ?? ""}
                                  onChange={(e) => setValue(f.key, e.target.value)}
                                />
                              ) : (
                                <TextArea
                                  value={draft[f.key] ?? ""}
                                  onChange={(e) => setValue(f.key, e.target.value)}
                                  rows={f.type === "richtext" ? 8 : 3}
                                />
                              )}
                              {f.help && (
                                <span className="block text-[0.6875rem] text-primary/50 mt-1">
                                  {f.help}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {visibleSections.length === 0 && (
            <p className="text-[0.8125rem] text-primary/45 italic px-1 py-8 text-center">
              No fields match “{query}”.
            </p>
          )}
        </div>

        {/* ── Right: live preview ──────────────────────────── */}
        <div className="xl:sticky xl:top-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-primary/40" strokeWidth={1.75} />
              <p className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/45">
                Live Preview
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Device toggles */}
              <div className="flex items-center bg-white border border-primary/12 rounded-sm p-0.5">
                {Object.entries(DEVICES).map(([id, d]) => {
                  const active = id === device
                  return (
                    <button
                      key={id}
                      onClick={() => setDevice(id)}
                      title={d.label}
                      className={`p-1.5 rounded-sm transition-colors ${
                        active
                          ? "bg-primary text-white"
                          : "text-primary/45 hover:text-primary"
                      }`}
                    >
                      <d.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  )
                })}
              </div>
              <button
                onClick={reloadPreview}
                title="Reload preview"
                className="p-1.5 bg-white border border-primary/12 rounded-sm text-primary/45 hover:text-primary transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
              <a
                href={group.path}
                target="_blank"
                rel="noreferrer"
                title="Open page in new tab"
                className="p-1.5 bg-white border border-primary/12 rounded-sm text-primary/45 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div className="rounded-sm overflow-hidden border border-primary/15 shadow-lg bg-primary/5">
            <div
              className="mx-auto bg-white transition-[width] duration-300"
              style={{ width: deviceWidth ? `${deviceWidth}px` : "100%", maxWidth: "100%" }}
            >
              <iframe
                ref={iframeRef}
                title="Site preview"
                src={previewSrc}
                className="w-full block border-0 bg-white"
                style={{ height: "calc(100vh - 12rem)" }}
              />
            </div>
          </div>
          <p className="text-[0.625rem] text-primary/40 mt-2 text-center">
            Editing <span className="text-primary/60">{group.label}</span>
            {totalPageEdits > 0 && <> · {totalPageEdits} edited on this page</>} · updates
            as you type · ⌘/Ctrl+S to publish
          </p>
        </div>
      </div>

      {/* ── Sticky save bar ────────────────────────────────── */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-[calc(50%+8rem)] z-30"
          >
            <div className="flex items-center gap-4 bg-bg-deep text-accent-cream pl-5 pr-2.5 py-2.5 rounded-full shadow-2xl border border-accent-wheat/20">
              <span className="text-[0.8125rem]">
                {dirtyKeys.length} unsaved {dirtyKeys.length === 1 ? "change" : "changes"}
              </span>
              <button
                onClick={discard}
                disabled={busy}
                className="text-[0.75rem] tracking-wide text-accent-cream/70 hover:text-accent-cream transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary-terra hover:bg-secondary-rust text-white text-[0.75rem] tracking-[0.1em] uppercase transition-colors disabled:opacity-50"
              >
                {busy ? (
                  "Saving…"
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Publish
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
