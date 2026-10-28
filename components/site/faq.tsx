"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { faqs } from "@/lib/site-data"

type FaqItemProps = {
  id: string
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FaqItem({ id, question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur overflow-hidden">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <span className="text-lg font-semibold pr-4">{question}</span>
          {isOpen ? (
            <Minus className="w-5 h-5 shrink-0" aria-hidden="true" />
          ) : (
            <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
          )}
        </button>
      </h3>
      {isOpen && (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} className="px-6 pb-6">
          <p className="text-white/80 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative z-10 py-24 px-6 scroll-mt-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80 leading-relaxed text-pretty">
              Everything you need to know about the expedition, from physical requirements to booking your spot on this
              exclusive adventure.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                id={`faq-${index}`}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
