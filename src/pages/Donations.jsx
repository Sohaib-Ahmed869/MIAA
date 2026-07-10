import { useCMS } from "../hooks/useCMS"
import { api } from "../lib/api"
import DonationsHeroSection from "../components/sections/donations/DonationsHeroSection"
import DonationProductsGrid from "../components/sections/donations/DonationProductsGrid"
import CampaignsSection from "../components/sections/donations/CampaignsSection"
import SectionDivider from "../components/ui/SectionDivider"

export default function Donations() {
  const { data: products } = useCMS(() => api.donationProducts(), [])
  const { data: campaigns } = useCMS(() => api.campaigns(), [])

  return (
    <>
      <DonationsHeroSection />

      <SectionDivider label="Choose a Cause" bg="bg-bg" variant="light" />
      <DonationProductsGrid products={products} />

      {campaigns.length > 0 && (
        <>
          <SectionDivider label="Campaigns" bg="bg-bg" variant="light" />
          <CampaignsSection campaigns={campaigns} />
        </>
      )}
    </>
  )
}
