
import { Hero } from "./components/Hero.jsx"
import { Features } from "./components/Features.jsx"
import { Journey } from "./components/Journey.jsx"
import { Faq } from "./components/Faq.jsx"
import { Contact } from "./components/Contact.jsx"
import { Footer } from "./components/Footer.jsx"
import ImageTextCard from "./components/ImageTextCard.jsx"

export default function App() {
  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden">

        {/* Background image */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://www.elledecoration.vn/wp-content/uploads/2025/03/1-son-doong.jpg)",
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        <Hero />

        <main>
          <Journey />

          {/* Reusable Image + Text Component */}
          <section className="relative z-10 px-6 py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

              <ImageTextCard
                image="https://www.elledecoration.vn/wp-content/uploads/2025/03/1-son-doong.jpg"
                imageAlt="Son Doong cave"
                title="Discover the Unknown"
                description="Explore extraordinary underground landscapes and experience the beauty of nature in its most spectacular form."
                step={1}
                delay={0}
                imagePosition="top"
                imageHeight="h-64"
                href="#contact"
                buttonText="Explore More"
              />

              <ImageTextCard
                image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                imageAlt="Mountain landscape"
                title="Into the Wild"
                description="Escape the ordinary and discover breathtaking landscapes on an unforgettable adventure."
                step={2}
                delay={0.12}
                imagePosition="top"
                imageHeight="h-64"
              />

              <ImageTextCard
                image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
                imageAlt="Lake surrounded by mountains"
                title="Beyond the Horizon"
                description="Every destination opens the door to new experiences, unforgettable moments, and incredible discoveries."
                step={3}
                delay={0.24}
                imagePosition="top"
                imageHeight="h-64"
              />

            </div>
          </section>

          <Features />
          <Journey />
          <Faq />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  )
}
