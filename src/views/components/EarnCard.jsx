import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { EARN_DAYS, HABITS_FOR_PERFECT, STEPS_FOR_PERFECT } from "../../constants/config.js";
import Ring from "./Ring.jsx";

export default function EarnCard({ perfectDays, daysLeft, progress, habits, steps, lang }) {
  const L        = getLabel(lang);
  const habitsOk = habits.length >= HABITS_FOR_PERFECT;
  const stepsOk  = (steps || 0) >= STEPS_FOR_PERFECT;

  return (
    <div style={{ margin: "0 24px 24px", background: `linear-gradient(135deg,${C.gold}12,${C.accent}08)`, border: `1px solid ${C.gold}44`, borderRadius: 22, padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <Ring pct={progress} color={C.gold} size={80} stroke={6}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>{perfectDays}</div>
          <div style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>/{EARN_DAYS}</div>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4 }}>{L.earnTitle}</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            {daysLeft > 0 ? L.earnDesc(daysLeft) : L.earnDone}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: habitsOk ? C.accent : C.muted, background: habitsOk ? `${C.accent}18` : C.border, padding: "3px 8px", borderRadius: 8 }}>
              {habitsOk ? "✅" : "⏳"} {habits.length}/{HABITS_FOR_PERFECT} hab.
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: stepsOk ? C.accent : C.muted, background: stepsOk ? `${C.accent}18` : C.border, padding: "3px 8px", borderRadius: 8 }}>
              {stepsOk ? "✅" : "⏳"} {(steps || 0).toLocaleString()} pas
            </span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>{L.earnInfo(HABITS_FOR_PERFECT, EARN_DAYS)}</div>
    </div>
  );
}
