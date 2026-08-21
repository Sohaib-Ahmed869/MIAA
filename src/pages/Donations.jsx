import { useCMS } from "../hooks/useCMS"
import { api } from "../lib/api"
import DonationsHeroSection from "../components/sections/donations/DonationsHeroSection"
import DonationProductsGrid from "../components/sections/donations/DonationProductsGrid"
import NoCausesSection from "../components/sections/donations/NoCausesSection"
import CampaignsSection from "../components/sections/donations/CampaignsSection"
import SectionDivider from "../components/ui/SectionDivider"

export default function Donations() {
  const { data: products, loading: productsLoading } = useCMS(() => api.donationProducts(), [])
  const { data: campaigns } = useCMS(() => api.campaigns(), [])

  // The public products endpoint returns only published, active causes, so
  // disabling them all empties this list. The divider is tied to the grid it
  // labels rather than rendered unconditionally — on its own it left "Choose a
  // Cause" hanging over nothing at the bottom of the page.
  const hasCauses = products.length > 0

  return (
    <>
      {/* Nothing to choose between, so the hero's jump link has nowhere to go. */}
      <DonationsHeroSection showCausesLink={hasCauses} />

      {/* Held back until the fetch settles: the backend sleeps on Render's free
          tier, and flashing "no causes" for half a minute before the real list
          arrives reads as an outage. */}
      {!productsLoading &&
        (hasCauses ? (
          <>
            <SectionDivider label="Choose a Cause" bg="bg-bg" variant="light" />
            <DonationProductsGrid products={products} />
          </>
        ) : (
          <NoCausesSection />
        ))}

      {campaigns.length > 0 && (
        <>
          <SectionDivider label="Campaigns" bg="bg-bg" variant="light" />
          <CampaignsSection campaigns={campaigns} />
        </>
      )}
    </>
  )
}
