/**
 * Visual identity — an icon and a colour tone — for a Site Content section.
 *
 * There are ~90 sections across the 15 page groups and they're declared in
 * `content/registry.js` as plain `{ id, label, fields }`. Hand-assigning an
 * icon to each would mean touching the registry every time a section is added,
 * and the one everybody forgets is the one that looks broken. So both halves
 * are derived from what a section already tells us: the icon is matched from
 * its own words, the tone is hashed from its id.
 *
 * Hashing (rather than cycling by position) means a section keeps its colour
 * when sections are added above it, when a filter hides its neighbours, and
 * between visits — the colour becomes part of how you recognise the section,
 * which a positional palette can't do.
 *
 * Tones are written as complete Tailwind class strings on purpose. Tailwind v4
 * scans source text for literal class names, so a composed `bg-${tone}/10`
 * would silently produce no CSS at all.
 */
import {
  Home,
  PanelBottom,
  HandCoins,
  Sparkles,
  Film,
  Hexagon,
  Palette,
  Milestone,
  Users,
  HandHeart,
  HeartHandshake,
  Handshake,
  Ticket,
  UtensilsCrossed,
  CalendarDays,
  Mail,
  MapPin,
  Car,
  GraduationCap,
  Baby,
  HelpCircle,
  Newspaper,
  Landmark,
  Building2,
  BookOpen,
  Info,
  Target,
  Star,
  LayoutGrid,
  MessageSquareQuote,
  Images,
} from "lucide-react"

// First match wins, so the specific patterns lead. Each is tested against
// `"<id> <label>"`, which is why e.g. the "art" rule also catches "Artwork".
const ICON_RULES = [
  [/hero|banner|stage/, Sparkles],
  [/video|film|footage/, Film],
  [/logo|mark|brand/, Hexagon],
  [/director|message|quote/, MessageSquareQuote],
  // Ahead of `volunteer`, or "Volunteer FAQ" reads as a volunteering block
  // rather than as the questions it actually holds.
  [/faq|question|help/, HelpCircle],
  [/volunteer/, HandHeart],
  [/campaign/, Target],
  [/donat|support|give|fund|cause/, HeartHandshake],
  [/sponsor|partner/, Handshake],
  [/ticket/, Ticket],
  [/gala|dinner/, UtensilsCrossed],
  [/parking|transport|travel|shuttle/, Car],
  [/location|address|western|map|visit|venue/, MapPin],
  [/contact|enquir|email/, Mail],
  [/kids|famil|children/, Baby],
  [/education|school|learn|workshop/, GraduationCap],
  [/smwf|writer|book|festival/, BookOpen],
  [/insight|blog|news|stor(y|ies)|article/, Newspaper],
  // Events lead: "Previous Events" is a list of events, not a history block,
  // and only the leftovers (`past`, `journey`) should read as a timeline.
  [/event|program|offsite|side|details/, CalendarDays],
  [/timeline|journey|project|milestone|past|previous|histor/, Milestone],
  [/architect|infrastructure|\brp\b/, Building2],
  [/museum|guided|mission|landmark/, Landmark],
  [/people|team|member|founding|community|culture|social/, Users],
  [/strategic|direction|vision|goal|purpose/, Target],
  [/art|gallery|exhibit|artwork/, Palette],
  [/highlight|feature|spotlight/, Star],
  [/gallery|image|photo|media/, Images],
  [/about|intro|overview|page/, Info],
  [/grid|list/, LayoutGrid],
]

export function iconForSection(section) {
  const text = `${section.id} ${section.label}`.toLowerCase()
  for (const [pattern, Icon] of ICON_RULES) if (pattern.test(text)) return Icon
  return LayoutGrid
}

// A page group is named differently from a section — "Home" and "Footer" mean
// nothing to the section rules, and Support Us / Donations would otherwise
// collide on one icon. Anything not listed falls through to the section rules,
// which already read page-shaped names like "Timeline" or "Gala Dinner" well.
const GROUP_ICON_RULES = [
  [/^home\b/, Home],
  [/footer/, PanelBottom],
  [/^donate\b|donation/, HandCoins],
]

export function iconForGroup(group) {
  const text = `${group.id} ${group.label}`.toLowerCase()
  for (const [pattern, Icon] of GROUP_ICON_RULES) if (pattern.test(text)) return Icon
  return iconForSection(group)
}

// Drawn from the site's own `@theme` tokens rather than a generic chart palette,
// so a page of eight sections still reads as the museum's palette. `sage` and
// `caramel` are too light to carry text at their own weight, so their `title`
// borrows a darker relative.
const TONES = {
  teal: {
    chip: "bg-primary/10 text-primary",
    rail: "bg-primary/70",
    title: "text-primary/80",
    dot: "bg-primary/60",
    head: "bg-primary/5",
    ring: "ring-primary/25",
  },
  ocean: {
    chip: "bg-bg-teal/12 text-bg-teal",
    rail: "bg-bg-teal/70",
    title: "text-bg-teal",
    dot: "bg-bg-teal/70",
    head: "bg-bg-teal/5",
    ring: "ring-bg-teal/30",
  },
  terra: {
    chip: "bg-secondary-terra/12 text-secondary-terra",
    rail: "bg-secondary-terra/70",
    title: "text-secondary-terra",
    dot: "bg-secondary-terra/70",
    head: "bg-secondary-terra/5",
    ring: "ring-secondary-terra/30",
  },
  amber: {
    chip: "bg-secondary-amber/12 text-secondary-amber",
    rail: "bg-secondary-amber/70",
    title: "text-secondary-amber",
    dot: "bg-secondary-amber/70",
    head: "bg-secondary-amber/5",
    ring: "ring-secondary-amber/30",
  },
  wine: {
    chip: "bg-secondary-wine/12 text-secondary-wine",
    rail: "bg-secondary-wine/70",
    title: "text-secondary-wine",
    dot: "bg-secondary-wine/70",
    head: "bg-secondary-wine/5",
    ring: "ring-secondary-wine/30",
  },
  rust: {
    chip: "bg-secondary-rust/12 text-secondary-rust",
    rail: "bg-secondary-rust/70",
    title: "text-secondary-rust",
    dot: "bg-secondary-rust/70",
    head: "bg-secondary-rust/5",
    ring: "ring-secondary-rust/30",
  },
  sage: {
    chip: "bg-accent-sage/30 text-bg-teal",
    rail: "bg-accent-sage",
    title: "text-bg-teal",
    dot: "bg-accent-sage",
    head: "bg-accent-sage/12",
    ring: "ring-accent-sage/50",
  },
  caramel: {
    chip: "bg-accent-caramel/25 text-secondary-amber",
    rail: "bg-accent-caramel",
    title: "text-secondary-amber",
    dot: "bg-accent-caramel",
    head: "bg-accent-caramel/10",
    ring: "ring-accent-caramel/45",
  },
}

const TONE_ORDER = ["teal", "terra", "sage", "amber", "ocean", "wine", "caramel", "rust"]

// djb2. Any stable string hash does; this one is short and spreads short ids
// (`hero`, `art`, `page`) well enough that a page rarely repeats a tone.
function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Themes for one page's sections, keyed by section id.
 *
 * Hashing alone can hand neighbouring sections the same tone, which defeats the
 * point at exactly the moment it matters, so a repeat is nudged to the next
 * tone. Pass the group's *full* section list — deriving this from a filtered
 * list would repaint the page every time a search narrowed it.
 */
export function themeForSections(sections, groupId) {
  const themes = new Map()
  let previous = -1
  for (const section of sections) {
    let index = hash(`${groupId}.${section.id}`) % TONE_ORDER.length
    if (index === previous) index = (index + 1) % TONE_ORDER.length
    previous = index
    themes.set(section.id, {
      ...TONES[TONE_ORDER[index]],
      Icon: iconForSection(section),
    })
  }
  return themes
}

/**
 * Theme for a whole page group, for the page picker. Hashed from the group id
 * in its own namespace, so a page's colour is stable and independent of the
 * section colours inside it.
 */
export function themeForGroup(group) {
  const index = hash(`group.${group.id}`) % TONE_ORDER.length
  return { ...TONES[TONE_ORDER[index]], Icon: iconForGroup(group) }
}

export const FALLBACK_THEME = { ...TONES.teal, Icon: LayoutGrid }
