import { C } from "../../constants/colors.js";

export default function Toast({ msg }) {
  return (
    <div style={{
      position: "fixed", top: msg ? 56 : -120, left: "50%", transform: "translateX(-50%)",
      background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 18,
      padding: "13px 18px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px #00000077", zIndex: 999,
      transition: "top 0.4s cubic-bezier(.4,0,.2,1)", maxWidth: 370, width: "90%",
    }}>
      <div style={{ fontSize: 24 }}>{msg?.emoji || "🔔"}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>{msg?.title}</div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{msg?.body}</div>
      </div>
    </div>
  );
}
