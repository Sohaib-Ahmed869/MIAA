import { useOutletContext } from "react-router-dom"
import HeroSection from "../components/sections/homepage/HeroSection"
import AboutUsSection from "../components/sections/homepage/AboutUsSection"
import IslamicArtSection from "../components/sections/homepage/IslamicArtSection"
import OffsiteEventsSection from "../components/sections/homepage/OffsiteEventsSection"
import SMWFSection from "../components/sections/homepage/SMWFSection"
import EducationSection from "../components/sections/homepage/EducationSection"
import TimelineSection from "../components/sections/homepage/TimelineSection"
import InsightsSection from "../components/sections/homepage/InsightsSection"
import ContactSection from "../components/sections/homepage/ContactSection"
import SectionDivider from "../components/ui/SectionDivider"

export default function Home() {
  const { loaderDone } = useOutletContext()

  if (!loaderDone) return null

  return (
    <>
      <HeroSection />

      <SectionDivider label="About Us" bg="bg-accent-cream" variant="light" />
      <AboutUsSection />

      <SectionDivider label="Islamic Art in Australia" bg="bg-accent-cream" variant="light" />
      <IslamicArtSection />

      <SectionDivider label="Events" bg="bg-bg-deep" variant="dark" />
      <OffsiteEventsSection />

      <SectionDivider label="Sydney Muslim Writers Festival" bg="bg-bg" variant="light" />
      <SMWFSection />

      <SectionDivider label="Education & Community Engagement" bg="bg-bg" variant="light" />
      <EducationSection />

      <SectionDivider label="MIAA Construction" bg="bg-accent-cream" variant="light" />
      <TimelineSection />

      <SectionDivider label="Blogs" bg="bg-accent-cream" variant="light" />
      <InsightsSection />

      <SectionDivider label="Contact Us" bg="bg-bg-deep" variant="dark" />
      <ContactSection />
    </>
  )
}
