import { useState, useEffect, useRef } from "react";
import { C } from "../../constants/colors.js";
import { useAIController } from "../../controllers/useAIController.js";
import { getLabel } from "../../constants/labels.js";

export default function AICard({ mood, habits, streak, isPremium, profile, lang, steps }) {
  const L = getLabel(lang);
  const { msgs, loading, hasError, init, send } = useAIController();
  const [input, setInput] = useState("");
  const [open,  setOpen]  = useState(false);
  const chatRef  = useRef(null);
  const initDone = useRef(false);
  const context  = { mood, habitCount: habits.length, streak, profile, steps, lang };

  useEffect(() => {
    if (!initDone.current) { initDone.current = true; init(context); }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  const lastAI = msgs.filter((m) => m.role === "assistant").slice(-1)[0];

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    send(text, context);
    setOpen(true);
  };

  return (
    <div style={{ margin: "0 24px 24px", background: `linear-gradient(135deg,${C.lavender}18,${C.sky}12)`, border: `1px solid ${hasError ? C.coral + "44" : C.lavender + "44"}`, borderRadius: 22, padding: "20px" }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.lavender},${C.sky})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: loading ? `0 0 16px ${C.lavender}88` : "none" }}>
          {loading ? <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span> : "🤖"}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{L.aiName}{isPremium && <span style={{ color: C.gold, fontSize: 11 }}> ✦ Pro</span>}</div>
          <div style={{ fontSize: 11, color: loading ? C.accent : hasError ? C.coral : C.muted }}>{loading ? L.aiThinking : hasError ? "⚠️ " + L.aiError.split("—")[0] : L.aiSub}</div>
        </div>
        <div style={{ marginLeft: "auto", cursor: "pointer", fontSize: 16, color: C.muted, padding: 4 }} onClick={() => setOpen(!open)}>{open ? "▲" : "▼"}</div>
      </div>

      {/* Last message (collapsed) */}
      {!open && (
        <div style={{ fontSize: 14, color: C.text, lineHeight: 1.65, marginBottom: 14, minHeight: 42 }}>
          {loading && msgs.length === 0
            ? <span style={{ color: C.muted }}>{L.aiThinking}</span>
            : lastAI?.content || L.completeProfileSub}
        </div>
      )}

      {/* Chat history (expanded) */}
      {open && (
        <div ref={chatRef} style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
          {msgs.filter((m, i) => m.role !== "user" || i > 0).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "88%", padding: "11px 14px", borderRadius: m.role === "assistant" ? "4px 18px 18px 18px" : "18px 4px 18px 18px", background: m.role === "assistant" ? `${C.lavender}22` : C.card, border: `1px solid ${m.role === "assistant" ? C.lavender + "44" : C.border}`, fontSize: 14, lineHeight: 1.6, color: C.text }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && msgs[msgs.length - 1]?.role === "user" && (
            <div style={{ display: "flex" }}>
              <div style={{ padding: "11px 14px", borderRadius: "4px 18px 18px 18px", background: `${C.lavender}22`, border: `1px solid ${C.lavender}44`, fontSize: 14, color: C.muted }}>...</div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <input
          style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif" }}
          placeholder={L.aiPlaceholder} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          maxLength={300}
        />
        <button onClick={handleSend} style={{ width: 40, height: 40, borderRadius: 12, background: input.trim() && !loading ? C.accent : C.border, border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>→</button>
      </div>
    </div>
  );
}
