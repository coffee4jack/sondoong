
import { motion, useReducedMotion } from "motion/react"

export default function ImageTextCard({
  image,
  title,
  description,
  step,
  imageAlt = "",
  imagePosition = "top",
  imageHeight = "h-64",
  delay = 0,
  className = "",
  href,
  buttonText,
}) {
  const reduceMotion = useReducedMotion()

  const horizontal = ["left", "right"].includes(imagePosition)

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 35,
      filter: reduceMotion ? "none" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={
        reduceMotion ? undefined : { y: -7 }
      }
      className={`
        group relative overflow-hidden rounded-3xl
        border border-white/10 bg-white/[0.05]
        shadow-xl shadow-black/10 backdrop-blur-xl
        transition-colors duration-500
        hover:border-white/25 hover:bg-white/[0.08]
        ${horizontal ? "flex flex-col sm:flex-row" : "flex flex-col"}
        ${className}
      `}
    >
      {/* Image */}
      {image && (
        <div
          className={`
            relative isolate shrink-0 overflow-hidden
            ${horizontal ? "min-h-64 sm:w-1/2" : `w-full ${imageHeight}`}
            ${imagePosition === "right" ? "sm:order-2" : ""}
          `}
        >
          <motion.img
            src={image}
            alt={imageAlt || title || ""}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            whileHover={
              reduceMotion ? undefined : { scale: 1.08 }
            }
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Cinematic overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {step != null && (
            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold tracking-widest text-white backdrop-blur-md">
              {String(step).padStart(2, "0")}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={`
          relative z-10 flex flex-1 flex-col justify-center
          p-6 md:p-8 lg:p-9
          ${horizontal && imagePosition === "right" ? "sm:order-1" : ""}
        `}
      >
        <motion.div
          initial={false}
          className="mb-4 h-1 w-10 rounded-full bg-white/50 transition-all duration-500 group-hover:w-16 group-hover:bg-white"
        />

        <h3 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
          {title}
        </h3>

        <p className="text-sm leading-7 text-white/70 md:text-base">
          {description}
        </p>

        {href && buttonText && (
          <motion.a
            href={href}
            whileHover={reduceMotion ? undefined : { x: 4 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white"
          >
            {buttonText}
            <span aria-hidden="true">→</span>
          </motion.a>
        )}
      </div>
    </motion.article>
  )
}
