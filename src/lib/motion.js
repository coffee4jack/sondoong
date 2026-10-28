export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger = (delayChildren = 0, staggerChildren = 0.12) => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})

export const inView = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.25 },
}
