import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { EARN_DAYS } from "../../constants/config.js";

export default function EarnedModal({ onClose, onActivate, lang }) {
  const L = getLabel(lang);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", zIndex: 200 }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "28px 28px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 420, margin: "0 auto", border: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>🏆</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>{L.earnedTitle}</div>
          <div style={{ fontSize: 15, color: C.gold, fontWeight: 700, marginBottom: 12 }}>{L.earnedSub}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{EARN_DAYS} jours de constance parfaite.</div>
        </div>

        <div style={{ background: C.surface, borderRadius: 14, padding: "14px 16px", marginBottom: 20, border: `1px solid ${C.border}` }}>
          {L.proFeatures.map((f, i, a) => (
            <div key={i} style={{ fontSize: 13, color: C.text, padding: "7px 0", borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : "none" }}>{f}</div>
          ))}
        </div>

        <button style={{ width: "100%", padding: "16px", borderRadius: 16, background: C.gold, color: "#000", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer" }} onClick={onActivate}>
          {L.activateFree}
        </button>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: C.muted }}>{L.noCard}</div>
      </div>
    </div>
  );
}
