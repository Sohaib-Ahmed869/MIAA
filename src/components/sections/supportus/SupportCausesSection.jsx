import { useCMS } from "../../../hooks/useCMS"
import { api } from "../../../lib/api"
import DonationProductsGrid from "../donations/DonationProductsGrid"
import SectionDivider from "../../ui/SectionDivider"
import { useText } from "../../../content/context"

// Shows the active donation causes on the Support Us page — first three, with
// a "View more" reveal. Renders nothing (divider included) when no causes are
// set up in the CMS.
export default function SupportCausesSection() {
  const { data: products } = useCMS(() => api.donationProducts(), [])
  const t = useText()

  if (!products || products.length === 0) return null

  return (
    <>
      <SectionDivider label={t("support.causes.label")} bg="bg-bg" variant="light" />
      <DonationProductsGrid products={products} initialCount={3} />
    </>
  )
}
