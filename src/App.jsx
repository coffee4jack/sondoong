import { Hero } from "./components/Hero.jsx"
import { Features } from "./components/Features.jsx"
import { Journey } from "./components/Journey.jsx"
import { Faq } from "./components/Faq.jsx"
import { Contact } from "./components/Contact.jsx"
import { Footer } from "./components/Footer.jsx"

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://www.elledecoration.vn/wp-content/uploads/2025/03/1-son-doong.jpg)" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
      </div>

      <Hero />
      <main>
        <Features />
        <Journey />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
