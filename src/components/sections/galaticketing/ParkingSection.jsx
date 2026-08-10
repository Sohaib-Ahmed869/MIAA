import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomIn, ZoomOut, X } from "lucide-react"
import { fadeInLeft, fadeInRight } from "../../../lib/motion"
import Text from "../../../content/Text"
import { useText } from "../../../content/context"
import mapImg from "../../../assets/images/Ticketing/area-map.png"
import bgPattern from "../../../assets/images/GalaDinner/herobgpattern.png"

export default function ParkingSection() {
  const t = useText()
  const PARKING_INFO = [
    { title: t("gala.parking.meterTitle"), body: t("gala.parking.meterBody") },
    {
      title: t("gala.parking.stationsTitle"),
      body: t("gala.parking.stationsBody"),
      noteLabel: t("gala.parking.stationsNoteLabel"),
      note: t("gala.parking.stationsNote"),
    },
    { title: t("gala.parking.bicyclesTitle"), body: t("gala.parking.bicyclesBody") },
    { title: t("gala.parking.busesTitle"), body: t("gala.parking.busesBody") },
  ]
  const [mapOpen, setMapOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const openMap = () => {
    setZoom(1)
    setDrag({ x: 0, y: 0 })
    setMapOpen(true)
  }

  const handleMouseDown = (e) => {
    setDragging(true)
    setDragStart({ x: e.clientX - drag.x, y: e.clientY - drag.y })
  }

  const handleMouseMove = (e) => {
    if (!dragging) return
    setDrag({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setDragging(false)

  return (
    <section className="relative py-16 md:py-24 3xl:py-32 bg-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={bgPattern}
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 max-w-[1400px] 3xl:max-w-[3200px] mx-auto px-6 md:px-10 lg:px-16 3xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — heading + parking info */}
          <motion.div {...fadeInLeft}>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] 3xl:text-[3.2rem] font-normal text-accent-cream tracking-tight leading-snug mb-10 md:mb-14 uppercase">
              <Text k="gala.parking.heading" />
            </h2>
            <div className="flex flex-col divide-y divide-accent-cream/15">
            {PARKING_INFO.map((item, i) => (
              <div key={i} className="py-6 first:pt-0 last:pb-0">
                <h3 className="font-display text-xl md:text-2xl 3xl:text-3xl font-normal text-accent-wheat mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base 3xl:text-lg text-[#F3EFEB] leading-relaxed">
                  {item.body}
                </p>
                {item.note && (
                  <p className="text-sm md:text-base 3xl:text-lg text-[#F3EFEB] leading-relaxed mt-2 italic">
                    {item.noteLabel && <span className="text-[#F3EFEB] font-semibold not-italic">{item.noteLabel}</span>}
                    {item.note}
                  </p>
                )}
              </div>
            ))}
            </div>
          </motion.div>

          {/* Right — map with hover controls */}
          <motion.div {...fadeInRight}>
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group"
              onClick={openMap}
            >
              <motion.img
                src={mapImg}
                alt="Map of the area around Art Gallery of NSW with parking locations"
                className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <ZoomIn className="text-primary w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {mapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-primary/95 backdrop-blur-sm"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-accent-wheat/15">
              <h3 className="font-display text-lg md:text-xl 3xl:text-2xl text-accent-cream uppercase tracking-wide">
                <Text k="gala.parking.mapTitle" />
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs 3xl:text-sm text-accent-cream/50 mr-2">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => { setZoom((z) => Math.min(z + 0.5, 4)); setDrag({ x: 0, y: 0 }) }}
                  className="w-9 h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setZoom((z) => Math.max(z - 0.5, 0.5)); setDrag({ x: 0, y: 0 }) }}
                  className="w-9 h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMapOpen(false)}
                  className="w-9 h-9 rounded-full border border-accent-wheat/25 text-accent-cream flex items-center justify-center hover:bg-accent-cream/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Map area — draggable */}
            <div
              className="flex-1 overflow-hidden flex items-center justify-center select-none"
              style={{ cursor: dragging ? "grabbing" : "grab" }}
              onMouseDown={handleMouseDown}
            >
              <img
                src={mapImg}
                alt="Map of the area around Art Gallery of NSW with parking locations"
                className="max-h-[80vh] w-auto transition-transform duration-150"
                draggable={false}
                style={{
                  transform: `scale(${zoom}) translate(${drag.x / zoom}px, ${drag.y / zoom}px)`,
                }}
              />
            </div>

            {/* Bottom hint */}
            <div className="px-6 md:px-10 py-3 border-t border-accent-wheat/15 text-center">
              <p className="text-[0.6875rem] 3xl:text-sm text-accent-cream/40 tracking-wider">
                Drag to pan &middot; Use controls to zoom &middot; Click &times; to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
