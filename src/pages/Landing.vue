<script setup>
import Navbar from "../components/landing/Navbar.vue";
import Hero from "../components/landing/Hero.vue";
import Services from "../components/landing/Services.vue";
import DriveSection from "../components/landing/DriveSection.vue";
import About from "../components/landing/About.vue";
import Business from "../components/landing/Business.vue";
import BoltSend from "../components/landing/Boltsend.vue";
import AppDownload from "../components/landing/AppDownload.vue";
import News from "../components/landing/News.vue";
import Footer from "../components/landing/Footer.vue";
</script>

<template>
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
</template>
