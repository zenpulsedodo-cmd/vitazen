import { useState } from "react";
import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { STEPS_FOR_PERFECT, STEPS_GOAL } from "../../constants/config.js";

export default function StepsWidget({ steps, onSave, lang }) {
  const L = getLabel(lang);
  const [input, setInput] = useState(steps || "");
  const [saved, setSaved] = useState(false);
  const pct = Math.min(100, ((steps || 0) / STEPS_GOAL) * 100);

  const handleSave = () => {
    const n = parseInt(input) || 0;
    onSave(n);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const barColor = (steps || 0) >= STEPS_GOAL
    ? C.accent
    : (steps || 0) >= STEPS_FOR_PERFECT
    ? C.sky
    : C.gold;

  return (
    <div style={{ margin: "0 24px 24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 28 }}>👣</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{L.stepsTitle}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{L.stepsGoal}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: (steps || 0) >= STEPS_FOR_PERFECT ? C.accent : C.gold }}>{(steps || 0).toLocaleString()}</div>
          {(steps || 0) > 0 && <div style={{ fontSize: 11, color: C.muted }}>{L.stepsMotivation(steps)}</div>}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 4, transition: "width 0.8s" }} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="number" min={0} max={99999}
          placeholder={L.stepsPlaceholder} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif" }}
        />
        <button onClick={handleSave} style={{ padding: "10px 18px", borderRadius: 12, background: saved ? C.border : C.accent, color: saved ? C.muted : "#000", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", flexShrink: 0 }}>
          {saved ? "✓" : L.stepsSave}
        </button>
      </div>
    </div>
  );
}
