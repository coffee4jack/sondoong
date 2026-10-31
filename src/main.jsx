import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import DriveSection from "./components/DriveSection";
import Business from "./components/Business";
import Safety from "./components/Safety";
import AppDownload from "./components/AppDownload";
import Footer from "./components/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="font-sans text-[#09090B] antialiased scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <DriveSection />
        <Business />
        <Safety />
        <AppDownload />
      </main>
      <Footer />
    </div>
  </React.StrictMode>
);
