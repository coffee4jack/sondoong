"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
        <Button type="submit" className="bg-white text-black hover:bg-white/90 rounded-lg px-6 h-[50px]">
          Subscribe
        </Button>
      </form>
      <p role="status" className="text-sm text-white/70 mt-3 min-h-5">
        {subscribed ? "You're subscribed. See you underground!" : ""}
      </p>
    </div>
  )
}
