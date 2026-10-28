"use client"

import { useState, type FormEvent } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"

function InquiryForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <div className="rounded-2xl bg-white/95 text-black p-8 shadow-2xl">
      <h3 className="text-2xl font-bold mb-6">Send an Inquiry</h3>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input type="text" id="name" name="name" required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={inputClass}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your expedition interests..."
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 text-base">
          Send Message
        </Button>
        <p role="status" className="text-sm text-gray-700 min-h-5">
          {sent ? "Thanks! We'll get back to you within one business day." : ""}
        </p>
      </form>
    </div>
  )
}

function GuideCard() {
  return (
    <div className="rounded-2xl bg-white/95 text-black p-6 shadow-2xl">
      <div className="flex items-center gap-4 mb-4">
        <img
          src="https://www.elledecoration.vn/wp-content/uploads/2025/03/edam-garden.jpg"
          alt="David Luong"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h4 className="text-lg font-semibold">David Luong</h4>
          <p className="text-gray-600">Lead Expedition Guide</p>
        </div>
      </div>
      <Button asChild className="w-full bg-black text-white hover:bg-gray-800 rounded-lg">
        <a href="mailto:hello@sondoongexpeditions.com">
          <Mail className="w-4 h-4" aria-hidden="true" />
          Email
        </a>
      </Button>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative z-10 py-24 px-6 scroll-mt-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 md:p-12">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-16 text-center text-balance">
          Contact Our Team
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <InquiryForm />
          <div className="flex flex-col gap-8">
            <p className="text-xl text-white/90 leading-relaxed text-pretty">
              For questions about private tours, partnerships, or media inquiries, please get in touch. We reply within
              one business day.
            </p>
            <GuideCard />
          </div>
        </div>
      </div>
    </section>
  )
}
