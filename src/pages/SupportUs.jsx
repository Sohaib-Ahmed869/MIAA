import SupportHeroSection from "../components/sections/supportus/SupportHeroSection"
import FoundingMemberSection from "../components/sections/supportus/FoundingMemberSection"
import OtherDonationsSection from "../components/sections/supportus/OtherDonationsSection"
import SupportCausesSection from "../components/sections/supportus/SupportCausesSection"
import MIAAKidsSection from "../components/sections/supportus/MIAAKidsSection"
import VolunteerSection from "../components/sections/supportus/VolunteerSection"
import VolunteerFAQSection from "../components/sections/supportus/VolunteerFAQSection"
import SectionDivider from "../components/ui/SectionDivider"

export default function SupportUs() {
  return (
    <>
      <SupportHeroSection />

      <SectionDivider label="Founding Supporters" bg="bg-accent-cream" variant="light" />
      <FoundingMemberSection />

      <SectionDivider label="Ways to Give" bg="bg-bg" variant="light" />
      <OtherDonationsSection />

      <SupportCausesSection />

      <SectionDivider label="MIAA Memberships" bg="bg-primary" variant="dark" />
      <MIAAKidsSection />

      <SectionDivider label="Volunteer" bg="bg-bg" variant="light" />

      <VolunteerSection />

      <SectionDivider label="Volunteer FAQ" bg="bg-bg" variant="light" />
      <VolunteerFAQSection />
    </>
  )
}
