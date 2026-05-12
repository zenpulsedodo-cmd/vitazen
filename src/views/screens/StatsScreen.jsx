import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { EARN_DAYS, STEPS_FOR_PERFECT } from "../../constants/config.js";
import { calcBMI, getBMICategory } from "../../models/profileModel.js";
import Ring from "../components/Ring.jsx";

export default function StatsScreen({ habits, steps, isPremium, onPremium, perfectDays, earnProgress, profile, lang, streak, weekData }) {
  const L      = getLabel(lang);
  const bmi    = calcBMI(profile?.weight, profile?.height);
  const bmiCat = getBMICategory(parseFloat(bmi), L.imcLabels);
  const score  = weekData.length ? Math.round(weekData.reduce((a, b) => a + b, 0) / weekData.length) : 0;

  return (
    <div style={{ padding: "52px 24px 100px", position: "relative", zIndex: 1 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>
          {lang === "en" ? "My " : "Mes "}<span style={{ color: C.accent }}>Stats</span>
        </div>
        {!isPremium && (
          <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}66`, color: C.gold, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, cursor: "pointer" }} onClick={onPremium}>✦ Pro</div>
        )}
      </div>

      {/* Weekly chart */}
      <div style={{ background: `linear-gradient(135deg,${C.accent}22,${C.sky}12)`, border: `1px solid ${C.accent}44`, borderRadius: 20, padding: "20px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>{L.thisWeek}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.accent }}>{score}%</div>
          </div>
          <div style={{ fontSize: 36 }}>📈</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 52 }}>
          {weekData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: `${Math.max(v, 4)}%`, background: i === 6 ? C.accent : `${C.accent}44`, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
              <div style={{ fontSize: 10, color: i === 6 ? C.accent : C.muted, fontWeight: i === 6 ? 700 : 400 }}>{L.days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: C.card, borderRadius: 20, padding: "18px", border: `1px solid ${C.border}`, marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 36 }}>👣</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{L.stepsTitle}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: (steps || 0) >= STEPS_FOR_PERFECT ? C.accent : C.gold }}>{(steps || 0).toLocaleString()}</div>
          <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
            <div style={{ height: "100%", width: `${Math.min(100, ((steps || 0) / 10000) * 100)}%`, background: (steps || 0) >= 10000 ? C.accent : (steps || 0) >= STEPS_FOR_PERFECT ? C.sky : C.gold, borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ fontSize: 24 }}>{(steps || 0) >= 10000 ? "🔥" : (steps || 0) >= STEPS_FOR_PERFECT ? "💪" : "🚶"}</div>
      </div>

      {/* BMI */}
      {bmi && (
        <div style={{ background: `linear-gradient(135deg,${bmiCat?.color}18,transparent)`, border: `1px solid ${bmiCat?.color}44`, borderRadius: 20, padding: "18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{L.myIMC}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: bmiCat?.color }}>{bmi}</div>
            <div style={{ fontSize: 12, color: bmiCat?.color, fontWeight: 600 }}>{bmiCat?.label}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{profile?.height} cm · {profile?.weight} kg</div>
            <div style={{ fontSize: 36 }}>📊</div>
          </div>
        </div>
      )}

      {/* Today's habits */}
      <div style={{ background: C.card, borderRadius: 20, padding: "20px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{L.today}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.gold }}>{habits.length} / 5</div>
          </div>
          <div style={{ fontSize: 36 }}>✅</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((id) => <div key={id} style={{ flex: 1, height: 6, borderRadius: 3, background: habits.includes(id) ? C.gold : C.border }} />)}
        </div>
      </div>

      {/* Premium progress */}
      <div style={{ background: `linear-gradient(135deg,${C.gold}12,transparent)`, border: `1px solid ${C.gold}33`, borderRadius: 20, padding: "18px", display: "flex", alignItems: "center", gap: 14 }}>
        <Ring pct={earnProgress} color={C.gold} size={64} stroke={5}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{perfectDays}</div>
          <div style={{ fontSize: 9, color: C.muted }}>/{EARN_DAYS}</div>
        </Ring>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{L.towardsPremium}</div>
          <div style={{ fontSize: 13, color: C.muted }}>{L.perfectDaysLabel}</div>
        </div>
      </div>
    </div>
  );
}
