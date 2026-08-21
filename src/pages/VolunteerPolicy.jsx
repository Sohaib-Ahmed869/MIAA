import PolicyPage from "../components/sections/legal/PolicyPage"

// Order here is the order on the page and in the contents rail. Each entry's
// copy lives in the `volunteer-policy` group of the content registry.
const SECTIONS = [
  { id: "purpose", heading: "volpolicy.purpose.heading", body: "volpolicy.purpose.body" },
  { id: "commitment", heading: "volpolicy.commitment.heading", body: "volpolicy.commitment.body" },
  { id: "rights", heading: "volpolicy.rights.heading", body: "volpolicy.rights.body" },
  { id: "responsibilities", heading: "volpolicy.responsibilities.heading", body: "volpolicy.responsibilities.body" },
  { id: "recruitment", heading: "volpolicy.recruitment.heading", body: "volpolicy.recruitment.body" },
  { id: "induction", heading: "volpolicy.induction.heading", body: "volpolicy.induction.body" },
  { id: "conduct", heading: "volpolicy.conduct.heading", body: "volpolicy.conduct.body" },
  { id: "childsafe", heading: "volpolicy.childsafe.heading", body: "volpolicy.childsafe.body" },
  { id: "whs", heading: "volpolicy.whs.heading", body: "volpolicy.whs.body" },
  { id: "privacy", heading: "volpolicy.privacy.heading", body: "volpolicy.privacy.body" },
  { id: "media", heading: "volpolicy.media.heading", body: "volpolicy.media.body" },
  { id: "expenses", heading: "volpolicy.expenses.heading", body: "volpolicy.expenses.body" },
  { id: "concerns", heading: "volpolicy.concerns.heading", body: "volpolicy.concerns.body" },
  { id: "ending", heading: "volpolicy.ending.heading", body: "volpolicy.ending.body" },
  { id: "contact", heading: "volpolicy.contact.heading", body: "volpolicy.contact.body" },
]

export default function VolunteerPolicy() {
  return (
    <PolicyPage
      eyebrowKey="volpolicy.hero.eyebrow"
      titleKey="volpolicy.hero.title"
      updatedKey="volpolicy.hero.updated"
      introKey="volpolicy.hero.intro"
      contentsLabelKey="volpolicy.hero.contentsLabel"
      sections={SECTIONS}
    />
  )
}
