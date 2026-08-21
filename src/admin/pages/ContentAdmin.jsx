import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
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
  ImageIcon,
  Layers,
  Undo2,
  Pencil,
  Eye,
  EyeOff,
  X,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react"
import { adminApi } from "../auth"
import { themeForSections, themeForGroup, FALLBACK_THEME } from "../components/sectionTheme"
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

// Preview visibility is a per-editor preference, so it rides localStorage rather
// than the content document — hiding it is about screen space, not about content.
const PREVIEW_PREF_KEY = "miaa_content_preview"

// Groups that aren't a page of their own but furniture repeated on every page.
// Listing them apart in the picker answers "why is there no Footer page on the
// site?" before it's asked.
const SITE_WIDE_GROUPS = new Set(["footer", "brand"])

/**
 * The page picker's model: everything it needs to describe a page at a glance,
 * computed once. Icon and tone come from the same helper the section cards use,
 * so a page reads the same wherever it appears.
 */
const GROUP_CARDS = CONTENT_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  path: g.path,
  siteWide: SITE_WIDE_GROUPS.has(g.id),
  sectionCount: g.sections.length,
  fieldCount: g.sections.reduce((n, s) => n + s.fields.length, 0),
  theme: themeForGroup(g),
}))

const PICKER_LISTS = [
  { id: "pages", title: "Pages", items: GROUP_CARDS.filter((g) => !g.siteWide) },
  { id: "sitewide", title: "On every page", items: GROUP_CARDS.filter((g) => g.siteWide) },
].filter((list) => list.items.length > 0)

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
  const pickerRef = useRef(null)
  const searchRef = useRef(null)
  const navScrollRef = useRef(null)
  const navRefs = useRef({})
  const [pickerOpen, setPickerOpen] = useState(false)

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
  const [showPreview, setShowPreview] = useState(() => {
    try {
      return localStorage.getItem(PREVIEW_PREF_KEY) !== "hidden"
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(PREVIEW_PREF_KEY, showPreview ? "shown" : "hidden")
    } catch {
      /* private mode / storage full — the toggle still works for this session */
    }
  }, [showPreview])

  const group = useMemo(
    () => CONTENT_GROUPS.find((g) => g.id === groupId) || CONTENT_GROUPS[0],
    [groupId]
  )

  // Colour + icon per section. Built from the group's full section list so a
  // search that hides sections never repaints the ones still on screen.
  const sectionThemes = useMemo(() => themeForSections(group.sections, group.id), [group])
  const themeFor = (id) => sectionThemes.get(id) || FALLBACK_THEME

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

  // Picker model for the page you're on, plus a single figure for unsaved work
  // waiting on the pages you aren't — the one thing the closed control can't
  // show by listing.
  const currentCard = useMemo(
    () => GROUP_CARDS.find((c) => c.id === group.id) || GROUP_CARDS[0],
    [group]
  )
  const groupTheme = currentCard.theme
  const editsElsewhere = useMemo(
    () => CONTENT_GROUPS.reduce((n, g) => (g.id === groupId ? n : n + groupEditCount(g)), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, draft, baseline]
  )

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

  // Reset navigation state when switching pages. `keepQuery` is set when you
  // arrive from a cross-page search hit — dropping the term there would throw
  // away the very thing that sent you to this page.
  const switchGroup = (id, { keepQuery = false } = {}) => {
    setGroupId(id)
    setPickerOpen(false)
    if (!keepQuery) setQuery("")
    setCollapsed(new Set())
    setActiveSection(null)
    fieldsScrollRef.current?.scrollTo?.({ top: 0 })
    window.scrollTo({ top: 0 })
  }

  // ── Search shortcuts ───────────────────────────────────────────
  // `/` and ⌘/Ctrl+K jump to the search box from anywhere on the page; both are
  // suppressed while you're typing in a field, since `/` is ordinary text.
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      const focusSearch = () => {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") focusSearch()
      else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) focusSearch()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

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

  // A long page can push the current section out of the rail's own scroll view,
  // which turns the highlight into something you have to go looking for. Nudge
  // the rail just enough to keep it visible — `scrollIntoView` is avoided here
  // because it would also scroll the editor column behind it.
  useEffect(() => {
    const box = navScrollRef.current
    const el = activeSection ? navRefs.current[activeSection] : null
    if (!box || !el) return
    const top = el.offsetTop
    const bottom = top + el.offsetHeight
    if (top < box.scrollTop) box.scrollTop = top - 8
    else if (bottom > box.scrollTop + box.clientHeight)
      box.scrollTop = bottom - box.clientHeight + 8
  }, [activeSection])

  // ── Page picker ────────────────────────────────────────────────
  // Dismiss on Esc or a click anywhere outside, the two things anyone tries
  // when a panel is covering what they wanted to read.
  useEffect(() => {
    if (!pickerOpen) return
    const onPointer = (e) => {
      if (!pickerRef.current?.contains(e.target)) setPickerOpen(false)
    }
    const onKey = (e) => {
      if (e.key === "Escape") setPickerOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [pickerOpen])

  // ── Field filtering (search + type + edited) ───────────────────
  const q = query.trim().toLowerCase()
  const filtering = Boolean(q) || filter !== "all" || editedOnly

  // Shared by the current page's section list and by the cross-page tally, so
  // "3 on About" always means the same thing as what you'd see after switching.
  const matchesField = (f) => {
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

  const visibleSections = useMemo(() => {
    return group.sections
      .map((section) => ({ ...section, fields: section.fields.filter(matchesField) }))
      .filter((s) => s.fields.length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, q, filter, editedOnly, draft, baseline])

  const visibleFieldCount = useMemo(
    () => visibleSections.reduce((n, s) => n + s.fields.length, 0),
    [visibleSections]
  )

  // Searching only the page you happen to be on is the main way people get lost
  // here — there are 15 pages and no way to guess which one owns a given string.
  // So the same predicate runs over the whole registry and reports the pages
  // that also match; clicking one keeps the query instead of resetting it.
  const otherPageMatches = useMemo(() => {
    if (!filtering) return []
    const counts = new Map()
    for (const f of Object.values(CONTENT_FIELDS)) {
      if (f.groupId === groupId || !matchesField(f)) continue
      counts.set(f.groupId, (counts.get(f.groupId) || 0) + 1)
    }
    return CONTENT_GROUPS.filter((g) => counts.has(g.id)).map((g) => ({
      group: g,
      count: counts.get(g.id),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering, groupId, q, filter, editedOnly, draft, baseline])

  const clearFilters = () => {
    setQuery("")
    setFilter("all")
    setEditedOnly(false)
  }

  // Collapse-all turns a 10-section page into a one-screen table of contents.
  const allCollapsed =
    visibleSections.length > 0 && visibleSections.every((s) => collapsed.has(s.id))
  const toggleAllSections = () =>
    setCollapsed(allCollapsed ? new Set() : new Set(group.sections.map((s) => s.id)))

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
            {/* Preview toggle lives beside the counters so it stays reachable
                once the preview column itself is gone. */}
            <button
              onClick={() => setShowPreview((v) => !v)}
              title={showPreview ? "Hide the live preview" : "Show the live preview"}
              aria-pressed={showPreview}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-[0.6875rem] tracking-[0.1em] uppercase transition-colors ${
                showPreview
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-primary/50 border-primary/8 hover:text-primary"
              }`}
            >
              {showPreview ? (
                <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
              ) : (
                <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
              )}
              Preview
            </button>
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
      {/*
        Three zones: section rail, editor, preview. The rail is the widest thing
        that can be given up, so with the preview open it waits for 2xl — below
        that a 12.5rem column would leave the editor too narrow to write in.

        `railBreakpoint`, the grid template and the toolbar strip's hide class
        must all switch at the SAME breakpoint. A hidden element is not a grid
        item, so a template that lists three columns while the rail is still
        `display:none` would drop the editor into the rail's 12.5rem column.
      */}
      <div
        className={`grid grid-cols-1 gap-6 xl:flex-1 xl:min-h-0 ${
          showPreview
            ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] 2xl:grid-cols-[12.5rem_minmax(0,1fr)_minmax(0,1.1fr)]"
            : "xl:grid-cols-[14rem_minmax(0,1fr)]"
        }`}
      >
        {/* ── Left: section rail (xl and up) ─────────────────
            The horizontal "jump to" strip could only show a few sections before
            running off the edge — Home's ninth section was unreachable without
            sideways scrolling. Vertically there's room for every section at
            once, so the rail doubles as the page's table of contents and shows
            where you currently are. Below xl it's replaced by the strip inside
            the toolbar, where a fixed-width column would cost too much. */}
        <aside
          className={
            showPreview
              ? "hidden 2xl:flex 2xl:flex-col 2xl:h-full 2xl:min-h-0"
              : "hidden xl:flex xl:flex-col xl:h-full xl:min-h-0"
          }
        >
          <div
            ref={navScrollRef}
            className="relative flex-1 min-h-0 overflow-y-auto rounded-2xl bg-white/60 border border-primary/8 p-2"
          >
            <p className="sticky top-0 z-10 flex items-center justify-between px-2.5 pt-1.5 pb-2.5 bg-white/80 backdrop-blur-sm text-[0.5625rem] tracking-[0.2em] uppercase text-primary/35">
              Sections
              <span className="tabular-nums">{visibleSections.length}</span>
            </p>
            <div className="space-y-0.5">
              {visibleSections.map((section) => {
                const edits = sectionEditCount(section)
                const active = activeSection === section.id
                const tone = themeFor(section.id)
                const isCollapsed = collapsed.has(section.id)
                return (
                  <button
                    key={section.id}
                    ref={(el) => (navRefs.current[section.id] = el)}
                    onClick={() => jumpToSection(section.id)}
                    title={section.label}
                    className={`w-full flex items-center gap-2.5 pl-2 pr-2.5 py-2 rounded-xl text-left transition-colors ${
                      active
                        ? `bg-accent-cream ring-1 ${tone.ring} ${tone.title}`
                        : "text-primary/50 hover:bg-accent-cream/60 hover:text-primary"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${tone.chip}`}
                    >
                      <tone.Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 min-w-0 truncate text-[0.6875rem] tracking-[0.08em] uppercase">
                      {section.label}
                    </span>
                    {/* Unsaved work outranks the field count — it's the only
                        one of the two that needs acting on. */}
                    {edits > 0 ? (
                      <span className="flex-shrink-0 min-w-4 px-1 py-0.5 rounded-full bg-secondary-terra text-white text-[0.5625rem] tabular-nums text-center">
                        {edits}
                      </span>
                    ) : (
                      <span
                        className={`flex-shrink-0 text-[0.5625rem] tabular-nums ${
                          isCollapsed ? "text-primary/40" : "text-primary/20"
                        }`}
                      >
                        {section.fields.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {visibleSections.length === 0 && (
              <p className="px-2.5 py-4 text-[0.6875rem] text-primary/35 italic">
                No sections match.
              </p>
            )}
          </div>
        </aside>

        {/* ── Left: editor (the only thing that scrolls on xl) ── */}
        <div
          ref={fieldsScrollRef}
          className="min-w-0 xl:h-full xl:overflow-y-auto xl:pr-3 xl:-mr-3"
        >
          {/* With the preview gone the column spans the whole window, and a
              paragraph field stretched that wide is genuinely hard to read, so
              the content keeps a measure and centres. The sticky toolbar still
              sticks — sticky resolves against the scroll container above, not
              this wrapper. */}
          <div className={`space-y-4 ${showPreview ? "" : "xl:max-w-6xl xl:mx-auto"}`}>
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
            {/* Page selector. This was a sideways-scrolling track of pills:
                with 17 groups the last few sat past the edge, their names were
                clipped mid-word, and finding a page meant dragging the strip
                back and forth. It's now one line that names where you are, and
                opens a panel showing every page at once — full name, what it
                holds, and whether it has unsaved work — so nothing has to be
                hunted for. */}
            <div ref={pickerRef} className="relative">
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                aria-expanded={pickerOpen}
                aria-haspopup="true"
                className={`w-full flex items-center gap-2.5 pl-2 pr-3 py-2 bg-white rounded-full border transition-colors shadow-[0_1px_3px_rgba(33,73,82,0.05)] ${
                  pickerOpen ? "border-primary/25" : "border-primary/8 hover:border-primary/20"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${groupTheme.chip}`}
                >
                  <groupTheme.Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex items-baseline gap-2">
                  <span
                    className={`truncate text-[0.6875rem] tracking-[0.15em] uppercase ${groupTheme.title}`}
                  >
                    {group.label}
                  </span>
                  <span className="hidden sm:block flex-shrink-0 text-[0.625rem] text-primary/35 tabular-nums">
                    {currentCard.sectionCount} sections · {currentCard.fieldCount} fields
                  </span>
                </span>
                {/* Unsaved work elsewhere is the one thing you can't see from
                    here, so it's summarised on the closed control. */}
                {editsElsewhere > 0 && (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-terra/10 text-secondary-terra text-[0.625rem] tabular-nums">
                    {editsElsewhere} on other pages
                  </span>
                )}
                <span className="ml-auto flex-shrink-0 inline-flex items-center gap-1.5 text-[0.625rem] tracking-[0.12em] uppercase text-primary/40">
                  <span className="hidden sm:inline">All pages</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      pickerOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                  />
                </span>
              </button>

              <AnimatePresence>
                {pickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 right-0 top-full mt-2 z-30 p-3 rounded-2xl bg-white border border-primary/10 shadow-[0_16px_44px_rgba(33,73,82,0.18)] max-h-[70vh] overflow-y-auto"
                  >
                    {PICKER_LISTS.map((list) => (
                      <div key={list.id} className="mb-3 last:mb-0">
                        <p className="px-1 pb-1.5 text-[0.5625rem] tracking-[0.2em] uppercase text-primary/30">
                          {list.title}
                        </p>
                        {/* Wrapping grid, so every page is on screen together
                            and the eye can scan columns instead of a queue.
                            `auto-fill` measures the panel, not the viewport —
                            the editor column is much narrower than the window
                            when the preview is open, and viewport breakpoints
                            would squeeze three columns into it and clip the
                            very names this is meant to make readable. */}
                        <div className="grid gap-1 grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]">
                          {list.items.map((card) => {
                            const active = card.id === groupId
                            const edits = groupEditCount(
                              CONTENT_GROUPS.find((g) => g.id === card.id)
                            )
                            return (
                              <button
                                key={card.id}
                                onClick={() => switchGroup(card.id)}
                                className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                                  active
                                    ? `bg-accent-cream ring-1 ${card.theme.ring}`
                                    : "hover:bg-accent-cream/60"
                                }`}
                              >
                                <span
                                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${card.theme.chip}`}
                                >
                                  <card.theme.Icon className="w-4 h-4" strokeWidth={1.75} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span
                                    className={`block truncate text-[0.6875rem] tracking-[0.1em] uppercase ${
                                      active ? card.theme.title : "text-primary/80"
                                    }`}
                                  >
                                    {card.label}
                                  </span>
                                  <span className="block truncate text-[0.625rem] text-primary/35 tabular-nums">
                                    {card.sectionCount} sections · {card.fieldCount} fields
                                  </span>
                                </span>
                                {edits > 0 && (
                                  <span className="flex-shrink-0 min-w-4 px-1 py-0.5 rounded-full bg-secondary-terra text-white text-[0.5625rem] tabular-nums text-center">
                                    {edits}
                                  </span>
                                )}
                                {active && edits === 0 && (
                                  <Check
                                    className={`flex-shrink-0 w-3.5 h-3.5 ${card.theme.title}`}
                                    strokeWidth={2.25}
                                  />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search + type filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/30" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") return
                    // Esc clears first and only leaves the field on a second
                    // press, so it never strands you with a stale filter.
                    if (query) setQuery("")
                    else e.currentTarget.blur()
                  }}
                  placeholder="Search fields, text, images…"
                  className={`w-full py-2.5 pl-10 bg-white border border-primary/8 rounded-full text-sm text-primary placeholder:text-primary/30 focus:border-secondary-terra/60 focus:outline-none transition-colors ${
                    filtering ? "pr-28" : "pr-14"
                  }`}
                />
                {/* Match count answers "did my search find anything here?"
                    without having to read the section list below. */}
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {filtering ? (
                    <>
                      <span
                        className={`text-[0.6875rem] tabular-nums ${
                          visibleFieldCount === 0 ? "text-secondary-terra" : "text-primary/40"
                        }`}
                      >
                        {visibleFieldCount} {visibleFieldCount === 1 ? "field" : "fields"}
                      </span>
                      <button
                        onClick={clearFilters}
                        title="Clear search and filters"
                        aria-label="Clear search and filters"
                        className="p-1 rounded-full text-primary/35 hover:text-primary hover:bg-accent-cream transition-colors"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </>
                  ) : (
                    <kbd className="hidden sm:block px-1.5 py-0.5 rounded border border-primary/10 text-[0.625rem] text-primary/30 leading-none">
                      /
                    </kbd>
                  )}
                </div>
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
                {visibleSections.length > 1 && (
                  <button
                    onClick={toggleAllSections}
                    title={allCollapsed ? "Expand every section" : "Collapse every section"}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[0.75rem] bg-white text-primary/55 border border-primary/8 hover:border-primary/25 transition-colors whitespace-nowrap"
                  >
                    {allCollapsed ? (
                      <ChevronsUpDown className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <ChevronsDownUp className="w-3 h-3" strokeWidth={2} />
                    )}
                    {allCollapsed ? "Expand" : "Collapse"}
                  </button>
                )}
              </div>
            </div>

            {/* Section navigator — the fallback for every width where the left
                rail isn't showing, so its hide class tracks the rail's breakpoint
                exactly. It follows `visibleSections`, not the whole page: while a
                filter is on it becomes the map of what's left, which is when a
                map helps most. */}
            {visibleSections.length > 1 && (
              <div className={`relative ${showPreview ? "2xl:hidden" : "xl:hidden"}`}>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/35 pr-1 flex-shrink-0">
                  Jump to
                </span>
                {visibleSections.map((section) => {
                  const edits = sectionEditCount(section)
                  const active = activeSection === section.id
                  const tone = themeFor(section.id)
                  return (
                    <button
                      key={section.id}
                      onClick={() => jumpToSection(section.id)}
                      // Same icon and tone as the card it scrolls to, so the
                      // chip you click and the block you land on are visibly the
                      // same thing.
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full text-[0.625rem] tracking-[0.12em] uppercase border transition-colors ${
                        active
                          ? `bg-white ${tone.title} border-primary/15 shadow-[0_1px_3px_rgba(33,73,82,0.06)]`
                          : "bg-transparent text-primary/45 border-transparent hover:bg-white hover:border-primary/10"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center ${tone.chip}`}
                      >
                        <tone.Icon className="w-2.5 h-2.5" strokeWidth={2} />
                      </span>
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

          {/* Cross-page hits. Sits above the results rather than in the sticky
              toolbar so it doesn't cost permanent vertical space, and it lands
              at the top of an empty result list where it's the only thing to
              read. */}
          {otherPageMatches.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/70 border border-primary/8">
              <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-primary/35 pr-1">
                {visibleFieldCount === 0 ? "Found on" : "Also on"}
              </span>
              {otherPageMatches.map(({ group: g, count }) => (
                <button
                  key={g.id}
                  onClick={() => switchGroup(g.id, { keepQuery: true })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.625rem] tracking-[0.12em] uppercase border border-primary/10 text-primary/60 hover:text-primary hover:border-primary/30 hover:bg-accent-cream/60 transition-colors"
                >
                  {g.label}
                  <span className="px-1.5 rounded-full bg-primary/8 text-[0.625rem] tabular-nums tracking-normal">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Sections + fields */}
          {visibleSections.map((section) => {
            const isCollapsed = collapsed.has(section.id)
            const edits = sectionEditCount(section)
            const mediaCount = section.fields.filter((f) => isMediaType(f.type)).length
            const tone = themeFor(section.id)
            const isActive = activeSection === section.id
            return (
              <div
                key={section.id}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                // A colour spine down the full height of the card, not just the
                // header: once a section is open and taller than the viewport,
                // the spine is the only part of its identity still on screen.
                className={`relative bg-white rounded-2xl overflow-hidden scroll-mt-36 transition-shadow border ${
                  isActive
                    ? `border-transparent ring-1 ${tone.ring} shadow-[0_4px_16px_rgba(33,73,82,0.08)]`
                    : "border-primary/8 shadow-[0_1px_3px_rgba(33,73,82,0.04)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute left-0 inset-y-0 w-[3px] ${tone.rail}`}
                />
                <button
                  onClick={() => toggleCollapse(section.id)}
                  className={`w-full pl-5 pr-5 py-3.5 flex items-center gap-3 text-left transition-colors ${tone.head} hover:bg-accent-cream/60`}
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${tone.chip}`}
                  >
                    <tone.Icon className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <p
                    className={`text-[0.6875rem] tracking-[0.18em] uppercase flex-1 min-w-0 truncate ${tone.title}`}
                  >
                    {section.label}
                  </p>
                  {/* Field count reads as the section's "size" — collapsed, it's
                      the only clue about what's inside. */}
                  <span className="hidden sm:inline text-[0.625rem] tabular-nums text-primary/30 flex-shrink-0">
                    {section.fields.length} {section.fields.length === 1 ? "field" : "fields"}
                  </span>
                  {mediaCount > 0 && (
                    <span
                      className="inline-flex items-center gap-1 text-[0.625rem] text-primary/35 flex-shrink-0"
                      title={`${mediaCount} image${mediaCount === 1 ? "" : "s"} / video`}
                    >
                      <ImageIcon className="w-3 h-3" strokeWidth={1.75} />
                      {mediaCount}
                    </span>
                  )}
                  {edits > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-terra/10 text-[0.625rem] text-secondary-terra flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-terra" />
                      {edits} unsaved
                    </span>
                  )}
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full bg-white/70 flex items-center justify-center transition-transform ${
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
            <div className="px-4 py-10 text-center bg-white/50 rounded-2xl border border-primary/6 space-y-3">
              <p className="text-[0.8125rem] text-primary/45 italic">
                {q
                  ? `Nothing on ${group.label} matches “${query}”.`
                  : editedOnly
                    ? `Nothing unsaved on ${group.label}.`
                    : `No ${filter === "media" ? "images or video" : "text fields"} on ${group.label}.`}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-primary/10 text-[0.75rem] text-primary/60 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <X className="w-3 h-3" strokeWidth={2} /> Clear search and filters
              </button>
            </div>
          )}

          {/* The preview column carries this status line; without it the page
              would lose the unsaved count and the publish shortcut entirely. */}
          {!showPreview && (
            <p className="text-[0.625rem] text-primary/40 text-center pb-2">
              Editing <span className="text-primary/60">{group.label}</span>
              {totalPageEdits > 0 && <> · {totalPageEdits} unsaved on this page</>} · ⌘/Ctrl+S to
              publish
            </p>
          )}
          </div>
        </div>

        {/* ── Right: live preview (pinned — never scrolls) ───
            Hidden means unmounted, not just off-screen: the iframe loads the
            whole public page, so leaving it mounted would keep paying for it.
            It re-announces `miaa:preview-ready` when it comes back, which
            re-pushes the current draft — no extra wiring needed here. */}
        {showPreview && (
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
                  <button
                    onClick={() => setShowPreview(false)}
                    title="Hide preview"
                    className="p-1.5 rounded-full text-primary/35 hover:text-primary hover:bg-white transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
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
        )}
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
