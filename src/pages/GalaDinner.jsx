import GalaHeroSection from "../components/sections/galadinner/GalaHeroSection"
import GalaIntroSection from "../components/sections/galadinner/GalaIntroSection"
import GalaSponsorsSection from "../components/sections/galadinner/GalaSponsorsSection"
import GalaSponsorshipSection from "../components/sections/galadinner/GalaSponsorshipSection"
import GalaDonateSection from "../components/sections/galadinner/GalaDonateSection"
import GalaEventDetailsSection from "../components/sections/galadinner/GalaEventDetailsSection"
import LocationSection from "../components/sections/galaticketing/LocationSection"
import SectionDivider from "../components/ui/SectionDivider"
import TransportSection from "../components/sections/galaticketing/TransportSection"
import ParkingSection from "../components/sections/galaticketing/ParkingSection"

export default function GalaDinner() {
  return (
    <>
      <GalaHeroSection />
      <GalaIntroSection />
      <GalaSponsorsSection />
      <GalaSponsorshipSection />
      <GalaDonateSection />
      <GalaEventDetailsSection />
        <LocationSection />

      <SectionDivider label="Transport" bg="bg-bg" variant="light" />
      <TransportSection />

      <SectionDivider label="Parking" bg="bg-primary" variant="dark" />
      <ParkingSection />
    </>
  )
}
