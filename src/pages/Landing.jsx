import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import DriveSection from "../components/landing/DriveSection";
import About from "../components/landing/About";
import Business from "../components/landing/Business";
import BoltSend from "../components/landing/Boltsend";
import AppDownload from "../components/landing/AppDownload";
import News from "../components/landing/News";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <DriveSection />
        <About />
        <Business />
        <BoltSend />
        <AppDownload />
        <News />
      </main>
      <Footer />
    </>
  );
}
