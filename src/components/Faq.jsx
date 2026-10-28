import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus } from "lucide-react"
import { faqs } from "../data/site-data.js"
import { fadeUp, inView, stagger } from "../lib/motion.js"

function FaqItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur overflow-hidden">
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
          <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
            <Plus className="w-5 h-5" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="px-6 pb-6 text-white/80 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="relative z-10 py-24 px-6 scroll-mt-6">
      <motion.div
        className="max-w-7xl mx-auto rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 md:p-12"
        variants={stagger(0, 0.1)}
        {...inView}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeUp}>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80 leading-relaxed text-pretty">
              Everything you need to know about the expedition, from physical requirements to booking your spot on this
              exclusive adventure.
            </p>
          </motion.div>

          <motion.div variants={stagger(0, 0.08)} className="flex flex-col gap-4">
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
