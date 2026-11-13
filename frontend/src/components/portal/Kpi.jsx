import Card from "./Card";

export default function Kpi({ label, value, hint = "" }) {
  return (
    <Card>
      <p className="text-sm text-ink/65">{label}</p>
      <p className="mt-1.5 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-[13px] text-ink/65">{hint}</p>
    </Card>
  );
}
