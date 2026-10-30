import { useEffect } from "react"
import { MotionConfig, motion, useScroll, useSpring } from "motion/react"
import { Hero } from "./components/Hero.jsx"
import { Features } from "./components/Features.jsx"
import { Journey } from "./components/Journey.jsx"
import { Faq } from "./components/Faq.jsx"
import { Contact } from "./components/Contact.jsx"
import { Footer } from "./components/Footer.jsx"
// import { ScrollExperience } from "./components/ScrollExperience.jsx" // desactivado: contenido de otra marca

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[100] h-0.5 w-full origin-left bg-emerald-400"
    />
  )
}

export default function App() {
  // Scroll suave en los anchors, respetando prefers-reduced-motion
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.documentElement.style.scrollBehavior = reduce ? "auto" : "smooth"
    return () => { document.documentElement.style.scrollBehavior = "" }
  }, [])

  return (
    // reducedMotion="user" desactiva animaciones de transformación si el sistema lo pide
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-clip bg-[#080b09]">
        <ScrollProgress />

        {/* https://images.pexels.com/photos/7641148/pexels-photo-7641148.jpeg */}

        <div
          className="pointer-events-none fixed inset-0 bg-cover bg-center"
          style={{
            width: "100%",
            height: "100%",

            backgroundImage: "url(https://images.pexels.com/photos/7794388/pexels-photo-7794388.jpeg)"
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <main>
          <Hero />
          <Features />
          <Journey />
          <Faq />
          <Contact />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  )
}
