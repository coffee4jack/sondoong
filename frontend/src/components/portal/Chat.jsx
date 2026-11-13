import { useEffect, useState } from "react";
import ChipButton from "./ChipButton";
import Button from "../buttons/Button";
import { inputCls } from "./ui";
import { cn } from "../../lib/cn";
import { api } from "../../lib/api";

/**
 * Chat en contexto de pedido.
 * `initial` = { Contacto: [{ from: "me" | "them", text }] }
 * Se copia al montar, así que para reiniciarlo el padre usa `key`.
 */
export default function Chat({ initial, storageKey = "portal-chat" }) {
  const contacts = Object.keys(initial);
  const [who, setWho] = useState(contacts[0] ?? "");
  const [msgs, setMsgs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      return saved ?? Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, [...v]]));
    } catch {
      return Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, [...v]]));
    }
  });
  const [text, setText] = useState("");
  const [chatError, setChatError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    const loadMessages = async () => {
      try {
        const query = new URLSearchParams({ thread_id: storageKey });
        const rows = await api(`/messages/?${query.toString()}`);
        if (!active || rows.length === 0) return;
        setMsgs((current) => {
          const mapped = { ...current };
          for (const row of rows) {
            const contact = row.contact;
            const existing = mapped[contact] ?? [];
            if (existing.some((message) => message.id === row.id)) continue;
            mapped[contact] = [...existing, {
              from: row.sender === "merchant" ? "me" : "them",
              text: row.text,
              id: row.id,
            }];
          }
          return mapped;
        });
      } catch {
        if (active) setChatError("No se pudieron sincronizar los mensajes con el servidor.");
      }
    };
    loadMessages();
    const timer = window.setInterval(loadMessages, 10000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(msgs));
    } catch {
      // Keep the active chat usable if browser storage is unavailable.
    }
  }, [msgs, storageKey]);

  const send = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setChatError("");
    setSending(true);
    setText("");
    api("/messages/", {
      method: "POST",
      body: JSON.stringify({ thread_id: storageKey, contact: who, sender: "merchant", text: t }),
    }).then((saved) => {
      setMsgs((current) => {
        const messages = current[who] ?? [];
        if (messages.some((message) => message.id === saved.id)) return current;
        return { ...current, [who]: [...messages, { from: "me", text: t, id: saved.id }] };
      });
    }).catch((error) => {
      setText(t);
      setChatError(`No se pudo enviar el mensaje: ${error.message}`);
    }).finally(() => setSending(false));
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
      <div role="log" aria-live="polite" className="mt-3 flex min-h-24 flex-col gap-2 overflow-y-auto text-sm">
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
      {chatError && <p role="alert" className="mt-2 text-sm text-red-700">{chatError}</p>}
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
          required
          autoComplete="off"
        />
        <Button type="submit" size="sm" className="h-11 shrink-0" disabled={sending}>
          {sending ? "Enviando…" : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
