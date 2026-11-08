const chipTones = {
  soft: "border border-ink/15 bg-white text-ink",
  dark: "bg-ink text-white",
  brand: "bg-brand text-ink",
  outline: "border border-mute text-ink",
};

export default function Chip({ tone = "soft", children }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${chipTones[tone] ?? chipTones.soft}`}
    >
      {children}
    </span>
  );
}
