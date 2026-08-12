import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
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
  Type,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Layers,
  Undo2,
  Pencil,
} from "lucide-react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import { TextInput, TextArea } from "../components/Field"
import MediaField from "../components/MediaField"
import { useToast } from "../components/Toast"
import {
  CONTENT_GROUPS,
  CONTENT_DEFAULTS,
  CONTENT_FIELDS,
  isMediaType,
  altKeyFor,
} from "../../content/registry"

const DEVICES = {
  desktop: { label: "Desktop", icon: Monitor, width: null },
  tablet: { label: "Tablet", icon: Tablet, width: 820 },
  mobile: { label: "Mobile", icon: Smartphone, width: 390 },
}

const FILTERS = {
  all: { label: "Everything", icon: Layers },
  text: { label: "Text only", icon: Type },
  media: { label: "Images & video only", icon: ImageIcon },
}

// Build the full { key → effective value } draft from saved overrides, falling
// back to the registry default for anything not overridden. Media keys ride the
// same map — their value is just a URL.
function buildDraft(saved) {
  const out = {}
  for (const [key, def] of Object.entries(CONTENT_DEFAULTS)) {
    const override = saved?.[key]
    out[key] = typeof override === "string" && override.trim() !== "" ? override : def
  }
  return out
}

/**
 * Textarea that grows to fit its content. Paragraph copy here runs to arbitrary
 * length, and a fixed `rows` with `resize-none` silently hides the tail — you
 * can't see the end of what you're editing.
 */
function AutoTextArea({ value, minRows = 3, ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return <TextArea ref={ref} radius="rounded-xl" rows={minRows} value={value} {...props} />
}

/** Small labelled figure in the header strip. */
function Stat({ value, label, accent = false }) {
  return (
    <div className="flex items-baseline gap-1.5 px-3.5 py-2 rounded-full bg-white border border-primary/8">
      <span className={`text-sm ${accent ? "text-secondary-terra" : "text-primary/85"}`}>
        {value}
      </span>
      <span className="text-[0.6875rem] text-primary/45">{label}</span>
    </div>
  )
}

export default function ContentAdmin() {
  const { notify } = useToast()
  const iframeRef = useRef(null)
  const sectionRefs = useRef({})
  const fieldsScrollRef = useRef(null)
  const tabsRef = useRef(null)
  const [tabArrows, setTabArrows] = useState({ left: false, right: false })

  const [saved, setSaved] = useState({}) // persisted overrides
  const [draft, setDraft] = useState(() => buildDraft({}))
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const [groupId, setGroupId] = useState(CONTENT_GROUPS[0].id)
  const [device, setDevice] = useState("desktop")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [editedOnly, setEditedOnly] = useState(false)
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
    win.postMessage({ type: "miaa:preview-content", values: draft }, window.location.origin)
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

  // A media field counts as customised when its file *or* its alt text differs.
  const fieldKeys = (f) => (typeof f.alt === "string" ? [f.key, altKeyFor(f.key)] : [f.key])
  const fieldCustomised = (f) => fieldKeys(f).some(isModified)
  const fieldChanged = (f) => fieldKeys(f).some((k) => draft[k] !== baseline[k])

  const sectionEditCount = (section) => section.fields.filter(fieldChanged).length
  const groupEditCount = (g) =>
    g.sections.reduce((n, s) => n + s.fields.filter(fieldChanged).length, 0)

  const setValue = (key, value) => setDraft((d) => ({ ...d, [key]: value }))
  const resetField = (f) =>
    setDraft((d) => {
      const next = { ...d }
      for (const k of fieldKeys(f)) next[k] = CONTENT_DEFAULTS[k] ?? ""
      return next
    })
  const discard = () => setDraft(buildDraft(saved))

  const save = async () => {
    if (busy || !dirty) return
    setBusy(true)
    setError("")
    // Send only changed keys; a value equal to the default clears the override
    // so the page falls back to what ships in the build.
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
      sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" })
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

  // Highlight the section nearest the top of the editor as it scrolls. On wide
  // screens the editor column is its own scroll container; below that the window
  // scrolls — listen to both and measure relative to the column's own top so the
  // threshold holds either way.
  useEffect(() => {
    const container = fieldsScrollRef.current
    const onScroll = () => {
      const originTop = container ? container.getBoundingClientRect().top : 0
      let current = null
      for (const section of group.sections) {
        const el = sectionRefs.current[section.id]
        if (!el) continue
        if (el.getBoundingClientRect().top - originTop < 140) current = section.id
      }
      if (current) setActiveSection(current)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    container?.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      container?.removeEventListener("scroll", onScroll)
    }
  }, [group])

  // Show an arrow only when there is actually something that way. Watches both
  // scrolling and resizing, since widening the window can make the track fit.
  const syncTabArrows = useCallback(() => {
    const el = tabsRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setTabArrows({ left: el.scrollLeft > 4, right: el.scrollLeft < max - 4 })
  }, [])

  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    syncTabArrows()
    el.addEventListener("scroll", syncTabArrows, { passive: true })
    const ro = new ResizeObserver(syncTabArrows)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", syncTabArrows)
      ro.disconnect()
    }
    // `loading` matters: while it's true the page renders a skeleton and the
    // track doesn't exist yet, so without it this would bind to nothing and the
    // arrows would never appear.
  }, [syncTabArrows, loading])

  const scrollTabs = (direction) => {
    const el = tabsRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.max(180, el.clientWidth * 0.6), behavior: "smooth" })
  }

  // The page track scrolls sideways, so the selected page can sit off-screen —
  // pull it back into view whenever it changes.
  useEffect(() => {
    tabsRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [groupId])

  // ── Field filtering (search + type + edited) ───────────────────
  const q = query.trim().toLowerCase()
  const visibleSections = useMemo(() => {
    const matches = (f) => {
      if (filter === "text" && isMediaType(f.type)) return false
      if (filter === "media" && !isMediaType(f.type)) return false
      if (editedOnly && !fieldChanged(f)) return false
      if (!q) return true
      return (
        f.label.toLowerCase().includes(q) ||
        f.key.toLowerCase().includes(q) ||
        String(draft[f.key] || "").toLowerCase().includes(q)
      )
    }
    return group.sections
      .map((section) => ({ ...section, fields: section.fields.filter(matches) }))
      .filter((s) => s.fields.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, q, filter, editedOnly, draft, baseline])

  const previewSrc = `${group.path}?preview=1`
  const reloadPreview = () => {
    if (iframeRef.current) iframeRef.current.src = previewSrc
  }

  // Site-wide counters for the header.
  // Counted from CONTENT_FIELDS (keyed by content key) rather than by walking
  // the groups: a file shared between pages is surfaced under each of them, so
  // walking the tree would count it once per page it appears on.
  const totals = useMemo(() => {
    const all = Object.values(CONTENT_FIELDS)
    return {
      fields: all.length,
      media: all.filter((f) => isMediaType(f.type)).length,
      customised: Object.keys(CONTENT_DEFAULTS).filter(isModified).length,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/70 border border-primary/8 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  const deviceWidth = DEVICES[device].width
  const totalPageEdits = groupEditCount(group)

  return (
    // `100vh - 5rem` matches AdminLayout's pt-10 + pb-10, so the workspace fills
    // exactly the space between them without the page itself scrolling.
    <div className="xl:h-[calc(100vh-5rem)] xl:flex xl:flex-col xl:overflow-hidden">
      {/* Counters sit in the header's action slot rather than on their own row:
          the workspace below is height-constrained, so every row costs preview. */}
      <PageHeader
        label="Content"
        title="Site Content"
        subtitle="Edit the words, images and video on the public website — previews live, publishes on save."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Stat value={totals.fields} label="fields" />
            <Stat value={totals.media} label="images & videos" />
            <Stat
              value={totals.customised}
              label="changed"
              accent={totals.customised > 0}
            />
          </div>
        }
      />

      {/*
        Split workspace. On wide screens the *page* doesn't scroll at all — the
        shell is pinned to the viewport and only the editor column scrolls
        inside it, so the preview physically cannot move out of view. This is
        deliberately not `position: sticky`: sticky depends on every ancestor
        avoiding `overflow`/`contain`/`transform`, which is fragile in a shared
        admin layout. Below xl the columns stack and the page scrolls normally.
      */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:flex-1 xl:min-h-0">
        {/* ── Left: editor (the only thing that scrolls on xl) ── */}
        <div
          ref={fieldsScrollRef}
          className="min-w-0 space-y-4 xl:h-full xl:overflow-y-auto xl:pr-3 xl:-mr-3"
        >
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          {/* Toolbar: page tabs + search + filters + section navigator. Sticky
              inside the editor's own scroll container. */}
          <div className="sticky top-0 z-20 -mx-1 px-1 pt-1 pb-3 bg-accent-cream/90 backdrop-blur-md space-y-2.5">
            {/* Page selector — a single segmented track that scrolls sideways;
                15 pages would otherwise wrap to three lines. */}
            <div className="relative">
              <div
                ref={tabsRef}
                // Padding stays constant whether or not the arrows are showing:
                // reserving space only when they appear shifted the whole track
                // sideways mid-scroll. An arrow is only ever rendered when that
                // end has content to reach, so it never covers a tab you could
                // otherwise have clicked — and the fade under it reads as
                // "continues this way" rather than a clipped label.
                className="flex items-center gap-1 p-1 bg-white rounded-full border border-primary/8 shadow-[0_1px_3px_rgba(33,73,82,0.05)] overflow-x-auto no-scrollbar scroll-smooth"
              >
              {CONTENT_GROUPS.map((g) => {
                const active = g.id === groupId
                const edits = groupEditCount(g)
                return (
                  <button
                    key={g.id}
                    data-active={active}
                    onClick={() => switchGroup(g.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.6875rem] tracking-[0.15em] uppercase transition-colors duration-200 ${
                      active
                        ? "bg-primary text-white"
                        : "text-primary/50 hover:text-primary hover:bg-accent-cream/70"
                    }`}
                  >
                    {g.label}
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

              {/* Scroll controls — 15 pages never fit at once. Each side shows
                  only when there is something that way, so the arrows double as
                  the "there's more" affordance. The fade sits under the button
                  so labels dissolve into it rather than being cut mid-word. */}
              {tabArrows.left && (
                <>
                  <div className="pointer-events-none absolute inset-y-1 left-1 w-14 rounded-l-full bg-gradient-to-r from-white via-white/85 to-transparent" />
                  <button
                    type="button"
                    aria-label="Scroll pages left"
                    onClick={() => scrollTabs(-1)}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-primary/10 shadow-[0_1px_4px_rgba(33,73,82,0.14)] flex items-center justify-center text-primary/55 hover:text-primary hover:border-primary/25 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </button>
                </>
              )}
              {tabArrows.right && (
                <>
                  <div className="pointer-events-none absolute inset-y-1 right-1 w-14 rounded-r-full bg-gradient-to-l from-white via-white/85 to-transparent" />
                  <button
                    type="button"
                    aria-label="Scroll pages right"
                    onClick={() => scrollTabs(1)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-primary/10 shadow-[0_1px_4px_rgba(33,73,82,0.14)] flex items-center justify-center text-primary/55 hover:text-primary hover:border-primary/25 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </button>
                </>
              )}
            </div>

            {/* Search + type filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/30" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search this page…"
                  className="w-full py-2.5 pl-10 pr-3 bg-white border border-primary/8 rounded-full text-sm text-primary placeholder:text-primary/30 focus:border-secondary-terra/60 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-white border border-primary/8 rounded-full p-0.5">
                  {Object.entries(FILTERS).map(([id, f]) => {
                    const active = id === filter
                    return (
                      <button
                        key={id}
                        onClick={() => setFilter(id)}
                        title={f.label}
                        className={`p-2 rounded-full transition-colors ${
                          active ? "bg-primary text-white" : "text-primary/40 hover:text-primary"
                        }`}
                      >
                        <f.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setEditedOnly((v) => !v)}
                  title="Show only what you've changed in this session"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[0.75rem] border transition-colors whitespace-nowrap ${
                    editedOnly
                      ? "bg-secondary-terra text-white border-secondary-terra"
                      : "bg-white text-primary/55 border-primary/8 hover:border-primary/25"
                  }`}
                >
                  <Pencil className="w-3 h-3" strokeWidth={2} />
                  Unsaved
                </button>
              </div>
            </div>

            {/* Section navigator — jump to any section on this page */}
            {!q && !editedOnly && group.sections.length > 1 && (
              <div className="relative">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/35 pr-1 flex-shrink-0">
                  Jump to
                </span>
                {group.sections.map((section) => {
                  const edits = sectionEditCount(section)
                  const active = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => jumpToSection(section.id)}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.625rem] tracking-[0.12em] uppercase border transition-colors ${
                        active
                          ? "bg-primary/8 text-primary border-primary/15"
                          : "bg-transparent text-primary/45 border-transparent hover:bg-white hover:border-primary/10"
                      }`}
                    >
                      {section.label}
                      {edits > 0 && <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />}
                    </button>
                  )
                })}
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-accent-cream to-transparent" />
              </div>
            )}
          </div>

          {/* Sections + fields */}
          {visibleSections.map((section) => {
            const isCollapsed = collapsed.has(section.id)
            const edits = sectionEditCount(section)
            const mediaCount = section.fields.filter((f) => isMediaType(f.type)).length
            return (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                className="bg-white border border-primary/8 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(33,73,82,0.04)] scroll-mt-36"
              >
                <button
                  onClick={() => toggleCollapse(section.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-accent-cream/40 transition-colors"
                >
                  <p className="text-[0.6875rem] tracking-[0.18em] uppercase text-primary/60 flex-1">
                    {section.label}
                  </p>
                  {mediaCount > 0 && (
                    <span
                      className="inline-flex items-center gap-1 text-[0.625rem] text-primary/35"
                      title={`${mediaCount} image${mediaCount === 1 ? "" : "s"} / video`}
                    >
                      <ImageIcon className="w-3 h-3" strokeWidth={1.75} />
                      {mediaCount}
                    </span>
                  )}
                  {edits > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-terra/10 text-[0.625rem] text-secondary-terra">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />
                      {edits} unsaved
                    </span>
                  )}
                  <span
                    className={`w-6 h-6 rounded-full bg-accent-cream/70 flex items-center justify-center transition-transform ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-primary/45" strokeWidth={2} />
                  </span>
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
                      <div className="px-5 pb-5 pt-5 space-y-6 border-t border-primary/6">
                        {section.fields.map((f) =>
                          isMediaType(f.type) ? (
                            <MediaField
                              key={f.key}
                              field={f}
                              folder={group.id}
                              value={draft[f.key] ?? ""}
                              defaultValue={CONTENT_DEFAULTS[f.key] ?? ""}
                              altValue={draft[altKeyFor(f.key)] ?? ""}
                              onChange={(url) => setValue(f.key, url)}
                              onAltChange={(text) => setValue(altKeyFor(f.key), text)}
                            />
                          ) : (
                            <div key={f.key}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center gap-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
                                  {f.label}
                                  {fieldCustomised(f) && (
                                    <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[0.625rem] text-secondary-terra">
                                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />
                                      Edited
                                    </span>
                                  )}
                                </span>
                                {fieldCustomised(f) && (
                                  <button
                                    onClick={() => resetField(f)}
                                    className="inline-flex items-center gap-1 text-[0.625rem] text-primary/40 hover:text-secondary-terra transition-colors"
                                    title="Reset to original text"
                                  >
                                    <RotateCcw className="w-3 h-3" /> Reset
                                  </button>
                                )}
                              </div>
                              {f.type === "text" ? (
                                <TextInput
                                  radius="rounded-xl"
                                  value={draft[f.key] ?? ""}
                                  onChange={(e) => setValue(f.key, e.target.value)}
                                />
                              ) : (
                                <AutoTextArea
                                  value={draft[f.key] ?? ""}
                                  onChange={(e) => setValue(f.key, e.target.value)}
                                  minRows={f.type === "richtext" ? 4 : 2}
                                />
                              )}
                              {f.help && (
                                <span className="block text-[0.6875rem] text-primary/45 mt-1.5">
                                  {f.help}
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {visibleSections.length === 0 && (
            <p className="text-[0.8125rem] text-primary/45 italic px-1 py-10 text-center bg-white/50 rounded-2xl border border-primary/6">
              {editedOnly ? "Nothing unsaved on this page." : `No fields match “${query}”.`}
            </p>
          )}
        </div>

        {/* ── Right: live preview (pinned — never scrolls) ─── */}
        <div className="min-w-0 xl:h-full xl:min-h-0">
          <div className="flex flex-col h-full">
            <div className="flex flex-col min-h-0 h-[75vh] xl:h-auto xl:flex-1 rounded-2xl overflow-hidden border border-primary/10 bg-white shadow-[0_4px_24px_rgba(33,73,82,0.07)]">
              {/* Browser-style chrome: label, path, device + actions */}
              <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-primary/8 bg-accent-cream/50">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-terra/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-wheat/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                </div>
                <div className="flex-1 min-w-0 flex justify-center">
                  <span className="max-w-full truncate px-3 py-1 rounded-full bg-white border border-primary/8 text-[0.6875rem] text-primary/45">
                    miaaustralia.org{group.path === "/" ? "" : group.path}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="flex items-center bg-white border border-primary/8 rounded-full p-0.5">
                    {Object.entries(DEVICES).map(([id, d]) => {
                      const active = id === device
                      return (
                        <button
                          key={id}
                          onClick={() => setDevice(id)}
                          title={d.label}
                          className={`p-1.5 rounded-full transition-colors ${
                            active ? "bg-primary text-white" : "text-primary/35 hover:text-primary"
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
                    className="p-1.5 rounded-full text-primary/35 hover:text-primary hover:bg-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <a
                    href={group.path}
                    target="_blank"
                    rel="noreferrer"
                    title="Open page in new tab"
                    className="p-1.5 rounded-full text-primary/35 hover:text-primary hover:bg-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </a>
                </div>
              </div>

              <div className="flex-1 min-h-0 bg-primary/5">
                <div
                  className="mx-auto h-full bg-white transition-[width] duration-300"
                  style={{ width: deviceWidth ? `${deviceWidth}px` : "100%", maxWidth: "100%" }}
                >
                  <iframe
                    ref={iframeRef}
                    title="Site preview"
                    src={previewSrc}
                    className="w-full h-full block border-0 bg-white"
                  />
                </div>
              </div>
            </div>

            <p className="flex-shrink-0 text-[0.625rem] text-primary/40 mt-2.5 text-center">
              Editing <span className="text-primary/60">{group.label}</span>
              {totalPageEdits > 0 && <> · {totalPageEdits} unsaved on this page</>} · updates as
              you type · ⌘/Ctrl+S to publish
            </p>
          </div>
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
                className="inline-flex items-center gap-1 text-[0.75rem] tracking-wide text-accent-cream/70 hover:text-accent-cream transition-colors disabled:opacity-50"
              >
                <Undo2 className="w-3.5 h-3.5" /> Discard
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
