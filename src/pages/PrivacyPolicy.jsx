import PolicyPage from "../components/sections/legal/PolicyPage"

// Order here is the order on the page and in the contents rail. Each entry's
// copy lives in the `privacy` group of the content registry.
const SECTIONS = [
  { id: "about", heading: "privacy.about.heading", body: "privacy.about.body" },
  { id: "collect", heading: "privacy.collect.heading", body: "privacy.collect.body" },
  { id: "how", heading: "privacy.how.heading", body: "privacy.how.body" },
  { id: "why", heading: "privacy.why.heading", body: "privacy.why.body" },
  { id: "payments", heading: "privacy.payments.heading", body: "privacy.payments.body" },
  { id: "sharing", heading: "privacy.sharing.heading", body: "privacy.sharing.body" },
  { id: "storage", heading: "privacy.storage.heading", body: "privacy.storage.body" },
  { id: "cookies", heading: "privacy.cookies.heading", body: "privacy.cookies.body" },
  { id: "marketing", heading: "privacy.marketing.heading", body: "privacy.marketing.body" },
  { id: "volunteers", heading: "privacy.volunteers.heading", body: "privacy.volunteers.body" },
  { id: "access", heading: "privacy.access.heading", body: "privacy.access.body" },
  { id: "complaints", heading: "privacy.complaints.heading", body: "privacy.complaints.body" },
  { id: "changes", heading: "privacy.changes.heading", body: "privacy.changes.body" },
  { id: "contact", heading: "privacy.contact.heading", body: "privacy.contact.body" },
]

export default function PrivacyPolicy() {
  return (
    <PolicyPage
      eyebrowKey="privacy.hero.eyebrow"
      titleKey="privacy.hero.title"
      updatedKey="privacy.hero.updated"
      introKey="privacy.hero.intro"
      contentsLabelKey="privacy.hero.contentsLabel"
      sections={SECTIONS}
    />
  )
}
