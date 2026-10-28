import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react"

export function ScrollExperience() {
  const containerRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Cinematic scroll animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.3,
  })

  const imageScale = useTransform(
    smoothProgress,
    [0, 0.45, 1],
    [1.15, 1, 1.3]
  )

  const imageY = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", "12%"]
  )

  const imageRadius = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ["0px", "24px", "0px"]
  )

  const introY = useTransform(
    smoothProgress,
    [0, 0.2],
    ["0%", "-80%"]
  )

  const introOpacity = useTransform(
    smoothProgress,
    [0, 0.12, 0.25],
    [1, 0.7, 0]
  )

  const titleScale = useTransform(
    smoothProgress,
    [0, 0.3],
    [1, 0.8]
  )

  const secondTextY = useTransform(
    smoothProgress,
    [0.25, 0.55],
    ["100px", "0px"]
  )

  const secondTextOpacity = useTransform(
    smoothProgress,
    [0.25, 0.4, 0.65],
    [0, 1, 1]
  )

  const finalScale = useTransform(
    smoothProgress,
    [0.6, 1],
    [0.8, 1]
  )

  const finalOpacity = useTransform(
    smoothProgress,
    [0.65, 0.85],
    [0, 1]
  )

  const progressWidth = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", "100%"]
  )

  const floatingY = reduceMotion ? 0 : undefined

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-[400vh] bg-[#080b09] text-white"
    >
      {/* Scroll progress */}
      <div className="fixed left-0 top-0 z-[100] h-[2px] w-full">
        <motion.div
          style={{ width: progressWidth }}
          className="h-full bg-lime-300 shadow-[0_0_15px_rgba(190,242,100,0.7)]"
        />
      </div>

      {/* Sticky cinematic stage */}
      <div className="sticky top-0 flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden">

        {/* Background image */}
        <motion.div
          style={{
            scale: imageScale,
            y: imageY,
            borderRadius: imageRadius,
          }}
          className="absolute inset-0"
        >
          <img
            src="https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg"
            alt="The enormous underground world of Son Doong"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#080b09]" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />

        {/* Decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        {/* Floating coordinates */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -12, 0], opacity: [0.6, 1, 0.6] }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-6 top-28 hidden font-mono text-[10px] tracking-[0.3em] text-white/70 md:left-12 md:block"
        >
          17°27'25.9"N
          <br />
          106°17'15.4"E
          <br />
          <span className="text-lime-300">● EXPEDITION ZONE</span>
        </motion.div>

        <div className="absolute right-6 top-28 hidden text-right font-mono text-[10px] tracking-[0.25em] text-white/60 md:right-12 md:block">
          FIELD REPORT — 001
          <br />
          DEPTH: UNKNOWN
        </div>

        {/* Main intro */}
        <motion.div
          style={{
            y: introY,
            opacity: introOpacity,
            scale: titleScale,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-8 flex items-center gap-3 text-[10px] font-semibold tracking-[0.4em] text-lime-300 md:text-xs"
          >
            <span className="h-px w-8 bg-lime-300" />
            THE ART OF EXPLORATION
            <span className="h-px w-8 bg-lime-300" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-6xl font-black uppercase leading-[0.85] tracking-[-0.07em] md:text-8xl lg:text-[10rem]"
            >
              DESCEND
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-3 text-6xl font-black uppercase leading-[0.85] tracking-[-0.07em] text-lime-300 md:text-8xl lg:text-[10rem]"
            >
              INTO THE
            </motion.h2>
          </div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-3 text-6xl font-black uppercase leading-[0.85] tracking-[-0.07em] md:text-8xl lg:text-[10rem]"
            >
              UNKNOWN<span className="text-lime-300">.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 max-w-md text-sm leading-7 text-white/75 md:text-base"
          >
            Some places are not meant to be seen from a distance.
            They are meant to change the way you see the world.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            animate={
              reduceMotion ? undefined : { y: [0, 8, 0] }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] tracking-[0.35em] text-white/70">
              SCROLL TO DESCEND
            </span>
            <div className="h-10 w-px bg-gradient-to-b from-lime-300 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Second chapter */}
        <motion.div
          style={{
            y: secondTextY,
            opacity: secondTextOpacity,
          }}
          className="absolute inset-x-0 top-1/2 mx-auto flex w-full max-w-6xl -translate-y-1/2 flex-col px-6 md:px-12"
        >
          <motion.span
            className="mb-6 text-xs tracking-[0.35em] text-lime-300"
          >
            01 / BEYOND THE SURFACE
          </motion.span>

          <h3 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            A WORLD
            <br />
            WITHOUT
            <br />
            <span className="text-white/40">LIMITS.</span>
          </h3>

          <p className="mt-8 max-w-md text-sm leading-7 text-white/80 md:text-base">
            Beneath the familiar lies an extraordinary world.
            Ancient formations, hidden chambers, and landscapes
            that make you feel like the first person to arrive.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-16 bg-lime-300" />
            <span className="text-[10px] tracking-[0.3em] text-white/70">
              THERE IS MORE BELOW
            </span>
          </div>
        </motion.div>

        {/* Final chapter */}
        <motion.div
          style={{
            scale: finalScale,
            opacity: finalOpacity,
          }}
          className="absolute inset-x-5 bottom-10 mx-auto max-w-5xl md:bottom-16"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/40 p-7 backdrop-blur-2xl md:p-12">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-xl">
                <span className="text-[10px] tracking-[0.35em] text-lime-300">
                  02 / YOUR NEXT CHAPTER
                </span>

                <h3 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
                  The world is
                  <br />
                  <span className="text-white/40">still unexplored.</span>
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
                  Leave the ordinary behind. Find the extraordinary
                  with an expedition built for the curious.
                </p>
              </div>

              <motion.a
                href="#contact"
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.04, backgroundColor: "#d9f99d" }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="inline-flex shrink-0 items-center justify-center gap-4 rounded-full bg-lime-300 px-7 py-4 text-sm font-bold text-black transition-colors"
              >
                START YOUR JOURNEY
                <span aria-hidden="true">↗</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Side progress indicator */}
        <div className="absolute bottom-10 right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:right-12 md:flex">
          <span className="font-mono text-[9px] text-white/60">01</span>
          <div className="relative h-24 w-px bg-white/20">
            <motion.div
              style={{ scaleY: smoothProgress }}
              className="absolute left-0 top-0 h-full w-full origin-top bg-lime-300"
            />
          </div>
          <span className="font-mono text-[9px] text-white/60">04</span>
        </div>
      </div>
    </section>
  )
}