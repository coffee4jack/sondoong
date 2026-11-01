import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import DriveSection from "./components/DriveSection";
import About from "./components/About";
import Business from "./components/Business";
import BoltSend from "./components/Boltsend.jsx";
import AppDownload from "./components/AppDownload";
import News from "./components/News";
import Footer from "./components/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="font-sans text-[#09090B] antialiased scroll-smooth">
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
    </div>
  </React.StrictMode>
);