import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { HABIT_ICONS, MOOD_EMOJIS, MOOD_COLORS, MOOD_IDS, PILLAR_IDS, PILLAR_ICONS, PILLAR_COLORS } from "../../constants/config.js";
import AICard from "../components/AICard.jsx";
import StepsWidget from "../components/StepsWidget.jsx";
import EarnCard from "../components/EarnCard.jsx";
import NutritionSection from "../components/NutritionSection.jsx";

export default function HomeScreen({
  mood, onMood, pillars, habits, onHabits,
  xp, isPremium, streak, perfectDays, daysLeft, earnProgress,
  onPremium, profile, lang, onGoToProfile, steps, onSteps,
}) {
  const L          = getLabel(lang);
  const hasProfile = profile?.height && profile?.weight;

  return (
    <div style={{ position: "relative", zIndex: 1 }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: C.text }}>Vita<span style={{ color: C.accent }}>Zen</span></div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {new Date().toLocaleDateString(L.dateLocale, { weekday: "long", day: "numeric", month: "long" })} · {xp} {L.xp}
          </div>
        </div>
        {isPremium
          ? <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}66`, color: C.gold, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{L.proActive}</div>
          : <div style={{ background: C.border, color: C.muted, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, cursor: "pointer" }} onClick={onPremium}>{L.goPro}</div>
        }
      </div>

      {/* Profile nudge */}
      {!hasProfile && (
        <div style={{ margin: "0 24px 20px", background: `${C.gold}14`, border: `1px solid ${C.gold}55`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={onGoToProfile}>
          <div style={{ fontSize: 24 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{L.completeProfile}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{L.completeProfileSub}</div>
          </div>
          <div style={{ color: C.gold }}>›</div>
        </div>
      )}

      {/* Streak dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 24px 20px" }}>
        {L.days.map((d, i) => (
          <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: i < streak % 7 ? C.accent : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: i < streak % 7 ? `0 0 12px ${C.accent}66` : "none" }}>
            {i < streak % 7 ? <span style={{ fontSize: 12 }}>✓</span> : <span style={{ fontSize: 11, color: C.muted }}>{d}</span>}
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted, fontWeight: 500 }}>🔥 {streak}j</div>
      </div>

      {/* Mood selector */}
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 14 }}>{L.howAreYou}</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {MOOD_IDS.map((m) => (
            <div key={m} onClick={() => onMood(mood === m ? null : m)}
              style={{ flex: 1, padding: "12px 0", borderRadius: 16, border: mood === m ? `2px solid ${MOOD_COLORS[m]}` : `2px solid ${C.border}`, background: mood === m ? `${MOOD_COLORS[m]}18` : C.card, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: mood === m ? "scale(1.04)" : "scale(1)", boxShadow: mood === m ? `0 4px 20px ${MOOD_COLORS[m]}33` : "none", transition: "all 0.25s" }}>
              <div style={{ fontSize: 24 }}>{MOOD_EMOJIS[m]}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: mood === m ? MOOD_COLORS[m] : C.muted }}>{L[m]}</div>
            </div>
          ))}
        </div>
      </div>

      <AICard mood={mood} habits={habits} streak={streak} isPremium={isPremium} profile={profile} lang={lang} steps={steps} />
      <StepsWidget steps={steps} onSave={onSteps} lang={lang} />
      {!isPremium && <EarnCard perfectDays={perfectDays} daysLeft={daysLeft} progress={earnProgress} habits={habits} steps={steps} lang={lang} />}
      <NutritionSection isPremium={isPremium} profile={profile} lang={lang} />

      {/* Pillars */}
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 14 }}>{L.pillars}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 24px 24px" }}>
        {PILLAR_IDS.map((p) => (
          <div key={p} style={{ background: C.card, borderRadius: 20, padding: "18px 16px", border: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderRadius: "50%", background: `${PILLAR_COLORS[p]}18`, filter: "blur(20px)" }} />
            <div style={{ fontSize: 26, marginBottom: 8 }}>{PILLAR_ICONS[p]}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>{L[p]}</div>
            <div style={{ height: 4, background: C.border, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${pillars[p]}%`, background: PILLAR_COLORS[p], borderRadius: 4, transition: "width 0.8s" }} />
            </div>
            <div style={{ fontSize: 11, color: PILLAR_COLORS[p], fontWeight: 600 }}>{pillars[p]}%</div>
          </div>
        ))}
      </div>

      {/* Habits */}
      <div style={{ padding: "0 24px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>{L.habits}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: habits.length >= 4 ? C.accent : C.muted }}>{L.habitsDone(habits.length, 5)}{habits.length >= 4 ? " 🎯" : ""}</div>
        </div>
        {[1, 2, 3, 4, 5].map((id) => {
          const done = habits.includes(id);
          return (
            <div key={id} onClick={() => onHabits(done ? habits.filter((x) => x !== id) : [...habits, id])}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: done ? `${C.accent}0D` : C.card, borderRadius: 16, marginBottom: 10, border: `1px solid ${done ? C.accent + "44" : C.border}`, cursor: "pointer", transition: "all 0.25s" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${done ? C.accent : C.border}`, background: done ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {done && <span style={{ fontSize: 12, color: "#000", fontWeight: 800 }}>✓</span>}
              </div>
              <div style={{ fontSize: 20 }}>{HABIT_ICONS[id]}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: done ? C.muted : C.text, textDecoration: done ? "line-through" : "none" }}>{L.habitTitles[id]}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{L.habitTimes[id]}</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 11, color: C.gold, fontWeight: 700 }}>{L.habitXP[id]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
