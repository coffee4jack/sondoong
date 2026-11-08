import { useState } from "react";
import ChipButton from "./ChipButton";
import Button from "../buttons/Button";
import { inputCls } from "./ui";
import { cn } from "../../lib/cn";

/**
 * Chat en contexto de pedido.
 * `initial` = { Contacto: [{ from: "me" | "them", text }] }
 * Se copia al montar, así que para reiniciarlo el padre usa `key`.
 */
export default function Chat({ initial }) {
  const contacts = Object.keys(initial);
  const [who, setWho] = useState(contacts[0]);
  const [msgs, setMsgs] = useState(() =>
    Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, [...v]]))
  );
  const [text, setText] = useState("");

  const send = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => ({ ...m, [who]: [...(m[who] ?? []), { from: "me", text: t }] }));
    setText("");
  };

  return (
    <div>
      {contacts.length > 1 && (
        <div className="flex gap-1.5">
          {contacts.map((c) => (
            <ChipButton key={c} active={who === c} onClick={() => setWho(c)}>
              {c}
            </ChipButton>
          ))}
        </div>
      )}
      <div role="log" aria-live="polite" className="mt-3 flex min-h-24 flex-col gap-2 text-sm">
        {(msgs[who] ?? []).map((m, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3 py-2",
              m.from === "me"
                ? "self-end bg-brand text-ink"
                : "border border-ink/10 bg-white text-ink"
            )}
          >
            {m.text}
          </p>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={send}>
        <label htmlFor={`chat-${who}`} className="sr-only">
          Mensaje para {who}
        </label>
        <input
          id={`chat-${who}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje…"
          className={inputCls}
        />
        <Button type="submit" size="sm" className="h-11">
          Enviar
        </Button>
      </form>
    </div>
  );
}
