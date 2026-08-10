import { useState } from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./Navbar"
import Footer from "./Footer"
import Loader from "../loader/Loader"
import ScrollToTop from "./ScrollToTop"
import smallLogo from "../../assets/images/Homepage/smalllogo.png"

export default function Layout() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isHome = location.pathname === "/"
  const isSmwf = location.pathname === "/smwf"
  // In the admin live-preview iframe (?preview=1) skip the intro loader so
  // content shows immediately and doesn't replay the animation on every edit.
  const isPreview = new URLSearchParams(location.search).has("preview")
  const showLoader = loading && isHome && !isPreview

  return (
    <>
      <ScrollToTop />

      {/* Show loader only on first visit to home */}
      <AnimatePresence>
        {showLoader && (
          <Loader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Hide page shell while loader is playing so footer doesn't flash */}
      <div style={showLoader ? { visibility: "hidden" } : undefined}>
        {/* Logo top-left — absolute so it scrolls away with the page (only the hamburger stays sticky).
            Hidden on /smwf because the SMWF hero ships its own MINN × SMWF lockup. */}
        {!isSmwf && (
          <Link
            to="/"
            className="absolute left-4 sm:left-6 md:left-10 lg:left-16 3xl:left-24 z-50 h-20 md:h-24 3xl:h-28 flex items-center"
          >
            <img
              src={smallLogo}
              alt="MIAA"
              className="h-auto miaa-logo"
            />
          </Link>
        )}

        {!isSmwf && <Navbar />}
        <main>
          {/* Pages render directly — section-level Framer Motion handles entrance animations.
              No route-level opacity fade so the teal body bg never flashes on cream/light pages. */}
          <Outlet context={{ loaderDone: !loading || !isHome || isPreview }} />
        </main>
        {!isSmwf && <Footer />}
      </div>
    </>
  )
}
