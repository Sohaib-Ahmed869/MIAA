import bannerIcon from "../../../assets/images/Homepage/SMWF/banner-icon.svg"

const TEXT = "Sydney Muslim Writers Festival"
const REPEAT = 10
const BG = "#2A9E9B"

// Adjacent section colours. Top half matches the section above (Past Festivals,
// now white), bottom half matches the section below (Community section, cream)
// — same pattern the blue marquee uses to "bleed" into its neighbours.
const TOP_BG    = "#FFFFFF"
const BOTTOM_BG = "#F3EFEB"

function MarqueeRow() {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: REPEAT }).map((_, i) => (
        <div
          key={i}
          // Gap + padding bumped to match the blue marquee's spacing
          className="flex items-center gap-16 md:gap-24 desktop:gap-28 3xl:gap-32 4xl:gap-44 px-8 md:px-12 desktop:px-14 3xl:px-16 4xl:px-24 shrink-0"
        >
          <span
            className="text-white font-aeonik font-bold text-3xl md:text-4xl desktop:text-5xl 3xl:text-6xl 4xl:text-8xl whitespace-nowrap tracking-tight"
          >
            {TEXT}
          </span>
          <img
            src={bannerIcon}
            alt=""
            aria-hidden="true"
            className="w-7 h-7 md:w-8 md:h-8 desktop:w-10 desktop:h-10 3xl:w-12 3xl:h-12 4xl:w-16 4xl:h-16 shrink-0"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      ))}
    </div>
  )
}

export default function SMWFTurquoiseMarquee() {
  return (
    <div
      className="relative overflow-hidden h-24 md:h-32 desktop:h-36 3xl:h-44 4xl:h-64"
      aria-label="Sydney Muslim Writers Festival"
    >
      {/* Top half — matches section above */}
      <div className="absolute inset-x-0 top-0 h-1/2" style={{ backgroundColor: TOP_BG }} />
      {/* Bottom half — matches section below */}
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ backgroundColor: BOTTOM_BG }} />

      {/* Tilted band crossing the midline.
          Rotation flipped from -2deg to +1.5deg so it tilts the same way
          as the blue marquee. */}
      <div
        className="absolute top-1/2 left-[-100px] right-[-100px] py-3 md:py-4 desktop:py-5 3xl:py-6 4xl:py-9 overflow-hidden"
        style={{
          backgroundColor: BG,
          transform: "translateY(-50%) rotate(1.5deg)",
          transformOrigin: "center",
        }}
      >
        <div
          className="flex smwf-banner-top w-max"
          style={{ animationDuration: "180s", animationDirection: "reverse" }}
        >
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </div>
  )
}