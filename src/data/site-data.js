import { Sparkles, ShieldCheck, Wallet, Leaf } from "lucide-react"

export const navLinks = [
  { label: "The Expedition", href: "#expedition" },
  { label: "Safety", href: "#features" },
  { label: "Gallery", href: "#expedition" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

export const features = [
  { icon: Sparkles, title: "Expert-Led Tours", description: "Guided by geologists, cavers, and local experts." },
  { icon: ShieldCheck, title: "World-Class Safety", description: "Rigorous protocols and modern equipment." },
  { icon: Wallet, title: "All-Inclusive Package", description: "Permits, gear, meals, and transport are covered." },
  { icon: Leaf, title: "Eco-Friendly Caving", description: "We are committed to preserving the cave's ecosystem." },
]

export const journeySteps = [
  {
    title: "Briefing & Prep",
    description:
      "Your adventure begins in Phong Nha with a full safety briefing and equipment check to ensure you're ready for the trek.",
  },
  {
    title: "The Trek",
    description:
      "Hike through pristine jungle, cross rivers, and camp in remote locations on your way to the entrance of Son Doong.",
  },
  {
    title: "Caving",
    description:
      "Descend into the cave to witness colossal stalagmites, explore vast chambers, and see the unique underground jungle.",
  },
  {
    title: "Base Camp",
    description:
      "Spend nights at breathtaking campsites inside the cave, sharing stories with your group before trekking back.",
  },
]

export const faqs = [
  {
    question: "How physically demanding is the tour?",
    answer:
      "The Son Doong expedition requires excellent physical fitness. You'll trek 15+ kilometers through jungle terrain, rappel down 80-meter drops, and navigate underground rivers. Participants must be able to carry a 15kg backpack and have prior caving or trekking experience.",
  },
  {
    question: "What is included in the tour price?",
    answer:
      "Your expedition includes all permits, professional guides, safety equipment, camping gear, meals during the expedition, transportation from Phong Nha, and emergency evacuation insurance. Personal items like clothing and toiletries are not included.",
  },
  {
    question: "Is it safe to explore Son Doong Cave?",
    answer:
      "Safety is our absolute priority. All guides are certified cave rescue specialists, we use professional-grade equipment, maintain constant communication with base camp, and have comprehensive emergency protocols. Weather conditions are monitored continuously.",
  },
  {
    question: "How do I book a spot?",
    answer:
      "Expeditions are limited to 10 people per group and run only during dry season (February-August). Book 6-12 months in advance through our website. A 50% deposit secures your spot, with final payment due 30 days before departure.",
  },
]

export const footerColumns = [
  { title: "Expedition", links: ["Itinerary", "Pricing", "Gear List", "Photo Gallery"] },
  { title: "About", links: ["Our Mission", "Safety Standards", "Our Team", "Conservation"] },
  { title: "Resources", links: ["Help Center", "Contact Us", "FAQ", "Terms & Conditions"] },
]
