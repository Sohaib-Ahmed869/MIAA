import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import loaderLogo from "../../assets/images/Loader to logo.png"

import loader01 from "../../assets/images/Homepage/loaderimages/loader-01.jpg"
import loader02 from "../../assets/images/Homepage/loaderimages/loader-02.jpg"
import loader03 from "../../assets/images/Homepage/loaderimages/loader-03.jpg"
import loader04 from "../../assets/images/Homepage/loaderimages/loader-04.jpg"
import loader05 from "../../assets/images/Homepage/loaderimages/loader-05.jpg"
import loader06 from "../../assets/images/Homepage/loaderimages/loader-06.jpg"
import loader07 from "../../assets/images/Homepage/loaderimages/loader-07.jpg"
import loader08 from "../../assets/images/Homepage/loaderimages/loader-08.jpg"

// Static on purpose: the intro animation plays before the content API has
// answered, so a CMS-managed image here would flash the bundled one first.
const galleryImages = [loader01, loader02, loader03, loader04, loader05, loader06, loader07, loader08]

export default function Loader({ onComplete }) {
  const containerRef = useRef(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    let loaded = 0
    const total = galleryImages.length + 1
    const allSrcs = [...galleryImages, loaderLogo]
    allSrcs.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = img.onerror = () => {
        loaded++
        if (loaded >= total) setImagesLoaded(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!imagesLoaded || !containerRef.current) return
    document.body.classList.add("loading")

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("loading")
          onComplete?.()
        },
      })

      // === Scene 1: Gallery frames fade in with stagger ===
      tl.fromTo(
        ".loader-frame",
        { opacity: 0, y: 12, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.06,
          ease: "power2.out",
        }
      )

      // === Scene 2: Logo color reveal — white sweeps left-to-right ===
      tl.fromTo(
        ".loader-logo-white",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 2,
          ease: "power3.inOut",
        },
        "+=0.3"
      )

      // === Scene 3: Gallery + subtitle fades out ===
      tl.to(
        ".loader-frame",
        {
          opacity: 0,
          y: -20,
          scale: 0.7,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.in",
        },
        "+=0.7"
      )
      tl.to(
        ".loader-ack",
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "<"
      )

      // === Scene 4: Logo scales up ===
      tl.to(".loader-logo", {
        scale: 1.3,
        duration: 0.8,
        ease: "power2.inOut",
      })

      tl.to({}, { duration: 0.3 })

      // === Scene 5: Logo moves to top-left navbar position ===
      const is4K = window.innerWidth >= 3600
      const is3xl = window.innerWidth >= 2200
      const logoOffsetX = is4K ? 160 : is3xl ? 110 : 70
      const logoOffsetY = is4K ? 64 : is3xl ? 52 : 44
      const logoScale = is4K ? 0.08 : is3xl ? 0.1 : 0.12
      tl.to(".loader-logo", {
        scale: logoScale,
        x: () => -(window.innerWidth / 2 - logoOffsetX),
        y: () => -(window.innerHeight / 2 - logoOffsetY),
        duration: 0.7,
        ease: "power3.inOut",
      })

      // Fade out loader
      tl.to(
        containerRef.current,
        { opacity: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [imagesLoaded, onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center bg-bg-deep"
    >
      {/* Gallery strip - mobile centers tightly, desktop spreads across 80% */}
      <div className="flex items-center justify-center gap-1.5 md:justify-between md:gap-0 w-full md:w-[80%] 3xl:w-[75%] px-3 md:px-0 mx-auto mt-[8vh]">
        {galleryImages.map((src, i) => (
          <div
            key={i}
            className="loader-frame opacity-0 flex-shrink-0 border-[3px] md:border-[5px] 3xl:border-[0.35rem] border-[#C15C45] overflow-hidden"
            style={{ lineHeight: 0, fontSize: 0 }}
          >
            <img
              src={src}
              alt=""
              className="block w-[32px] h-[32px] md:w-[4.375rem] md:h-[4.375rem] 3xl:w-[8vw] 3xl:h-[8vw] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Center area: logo + text */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* MIAA Logo - tinted layer + white layer revealed L→R */}
        <div className="loader-logo w-[280px] md:w-[28.125rem] lg:w-[34.375rem] 3xl:w-[30vw] relative">
          <img
            src={loaderLogo}
            alt=""
            className="w-full h-auto"
            style={{ filter: "brightness(0.55)", opacity: 0.45 }}
          />
          <img
            src={loaderLogo}
            alt="Museum of Islamic Art Australia"
            className="loader-logo-white absolute inset-0 w-full h-auto"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          />
        </div>

        {/* Acknowledgment text - always visible on mount */}
        <div className="loader-ack mt-10 max-w-[700px] 3xl:max-w-[40vw] text-center px-6">
          <p className="text-[0.6875rem] md:text-[0.8125rem] 3xl:text-base font-bold italic text-white/70 leading-relaxed">
            MIAA is proudly located on beautiful Dharug country in Granville, Western Sydney.
          </p>
          <p className="text-[0.6875rem] md:text-[0.8125rem] 3xl:text-base italic text-white/55 leading-relaxed mt-1">
            The Museum of Islamic Art Australia (MIAA) respectfully acknowledges the Burramattagal people
            of the Dharug Nation as the Traditional Owners of the land on which the museum will be located.
            We pay our respects to Elders past, present and emerging. Sovereignty has never been ceded.
          </p>
        </div>
      </div>
    </div>
  )
}
