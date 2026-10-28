
import { Hero } from "./components/Hero.jsx"
import { Features } from "./components/Features.jsx"
import { Journey } from "./components/Journey.jsx"
import { Faq } from "./components/Faq.jsx"
import { Contact } from "./components/Contact.jsx"
import { Footer } from "./components/Footer.jsx"
import { ScrollExperience } from "./components/ScrollExperience.jsx"

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#080b09]">

      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/4284290/pexels-photo-4284290.jpeg)",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Hero />

      <main>
        <ScrollExperience />
        <Journey />

        

        <Features />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
