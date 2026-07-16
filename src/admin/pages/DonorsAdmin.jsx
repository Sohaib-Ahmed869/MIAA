import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Drawer from "../components/Drawer"
import EmptyState from "../components/EmptyState"
import { useToast } from "../components/Toast"
import { SkeletonCardGrid } from "../components/Skeleton"

export default function DonorsAdmin() {
  const [donors, setDonors] = useState([])
  const [viewing, setViewing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listDonors()
      setDonors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <PageHeader
        label="Donations"
        title="Donors"
        subtitle="View registered donors and their giving history."
      />

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : donors.length === 0 ? (
        <EmptyState
          title="No registered donors yet"
          hint="Donors will appear here once they create accounts."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="flex flex-col gap-2"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-primary/50">
            <span>Name</span>
            <span>Email</span>
            <span>Total Donated</span>
            <span>Donations</span>
            <span>Joined</span>
          </div>
          {donors.map((d) => (
            <motion.div
              key={d._id}
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => setViewing(d)}
              className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 bg-white border border-primary/8 rounded-sm hover:border-secondary-terra/40 hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="text-sm font-medium text-primary truncate">
                {d.firstName} {d.lastName}
              </p>
              <p className="text-sm text-primary/70 truncate">{d.email}</p>
              <p className="text-sm font-medium text-primary min-w-[6rem] text-right">
                ${((d.totalDonated || 0) / 100).toLocaleString()}
              </p>
              <p className="text-sm text-primary/60 min-w-[4rem] text-center">
                {d.donationCount || 0}
              </p>
              <p className="text-[0.6875rem] text-primary/50 min-w-[5rem] text-right">
                {new Date(d.createdAt).toLocaleDateString("en-AU")}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail drawer */}
      <Drawer
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title="Donor Detail"
        subtitle={viewing ? `${viewing.firstName} ${viewing.lastName}` : ""}
      >
        {viewing && (
          <div className="flex flex-col gap-4">
            {[
              ["Name", `${viewing.firstName} ${viewing.lastName}`],
              ["Email", viewing.email],
              ["Phone", viewing.phone || "—"],
              ["Total Donated", `$${((viewing.totalDonated || 0) / 100).toLocaleString()}`],
              ["Donation Count", viewing.donationCount || 0],
              ["Verified", viewing.isVerified ? "Yes" : "No"],
              ["Joined", new Date(viewing.createdAt).toLocaleDateString("en-AU")],
              [
                "Address",
                viewing.address?.street
                  ? [viewing.address.street, viewing.address.city, viewing.address.state, viewing.address.postcode]
                      .filter(Boolean)
                      .join(", ")
                  : "—",
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-primary/8 pb-2">
                <span className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55">
                  {label}
                </span>
                <span className="text-sm text-primary text-right max-w-[60%] truncate">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  )
}
