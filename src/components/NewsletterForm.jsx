import { useState } from "react"
import { motion } from "motion/react"

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubscribed(true)
    e.currentTarget.reset()
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-4">Get Expedition Updates</h3>
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Enter your email"
          className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-white/5 ring-1 ring-white/20 backdrop-blur border-0 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 focus:outline-none"
        />
        <motion.button
          type="submit"
          className="bg-white text-black font-medium rounded-lg px-6 hover:bg-white/90 transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          Subscribe
        </motion.button>
      </form>
      <p role="status" className="text-sm text-white/70 mt-3 min-h-5">
        {subscribed ? "You're subscribed. See you underground!" : ""}
      </p>
    </div>
  )
}
