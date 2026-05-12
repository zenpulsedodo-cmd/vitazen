import { useState } from "react";
import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { GOAL_IDS, GOAL_ICONS, EARN_DAYS } from "../../constants/config.js";
import { calcBMI, getBMICategory, getIdealWeight } from "../../models/profileModel.js";
import Ring from "../components/Ring.jsx";

// ── Profile Form ──────────────────────────────────────────────────────────────
function ProfileForm({ profile, onSave, lang }) {
  const L = getLabel(lang);
  const [local, setLocal] = useState(profile || { height: "", weight: "", gender: "neutral", goals: [] });
  const toggleGoal = (id) => setLocal((p) => ({ ...p, goals: p.goals.includes(id) ? p.goals.filter((g) => g !== id) : [...p.goals, id] }));
  const bmi    = calcBMI(parseFloat(local.weight), parseFloat(local.height));
  const bmiCat = getBMICategory(parseFloat(bmi), L.imcLabels);
  const idealW = getIdealWeight(parseFloat(local.height), local.gender);

  return (
    <div style={{ padding: "52px 24px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: C.text }}>
        {lang === "en" ? "My " : "Mon "}<span style={{ color: C.accent }}>{lang === "en" ? "Profile" : lang === "es" ? "Perfil" : "Profil"}</span>
      </div>

      {/* Height & Weight */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[{ label: L.height, key: "height", ph: "175" }, { label: L.weight, key: "weight", ph: "70" }].map((f) => (
          <div key={f.key} style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{f.label}</div>
            <input type="number" placeholder={f.ph} value={local[f.key]}
              onChange={(e) => setLocal((p) => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 15, fontWeight: 600, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }}
            />
          </div>
        ))}
      </div>

      {/* Gender */}
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{L.gender}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ id: "homme", l: L.male }, { id: "femme", l: L.female }, { id: "neutral", l: L.neutral }].map((g) => (
          <div key={g.id} onClick={() => setLocal((p) => ({ ...p, gender: g.id }))}
            style={{ flex: 1, padding: "10px", borderRadius: 12, border: `2px solid ${local.gender === g.id ? C.accent : C.border}`, background: local.gender === g.id ? `${C.accent}18` : C.card, cursor: "pointer", textAlign: "center", fontSize: 12, fontWeight: 600, color: local.gender === g.id ? C.accent : C.muted }}>
            {g.l}
          </div>
        ))}
      </div>

      {/* BMI preview */}
      {bmi && (
        <div style={{ background: `linear-gradient(135deg,${bmiCat?.color}18,transparent)`, border: `1px solid ${bmiCat?.color}44`, borderRadius: 16, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{L.myIMC}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: bmiCat?.color }}>{bmi}</div>
            <div style={{ fontSize: 12, color: bmiCat?.color, fontWeight: 600 }}>{bmiCat?.label}</div>
          </div>
          {idealW && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{L.idealWeight}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{idealW} kg</div>
            </div>
          )}
        </div>
      )}

      {/* Goals */}
      <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 12 }}>{L.goals}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {GOAL_IDS.map((id) => {
          const sel = local.goals.includes(id);
          return (
            <div key={id} onClick={() => toggleGoal(id)}
              style={{ padding: "14px", borderRadius: 16, border: `2px solid ${sel ? C.accent : C.border}`, background: sel ? `${C.accent}14` : C.card, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transform: sel ? "scale(1.02)" : "scale(1)", transition: "all 0.2s" }}>
              <div style={{ fontSize: 22 }}>{GOAL_ICONS[id]}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: sel ? C.accent : C.muted, lineHeight: 1.3 }}>{L.goalLabels[id]}</div>
              {sel && <div style={{ marginLeft: "auto", fontSize: 14, color: C.accent }}>✓</div>}
            </div>
          );
        })}
      </div>

      {/* Nutrition reminder */}
      <div style={{ background: `${C.coral}18`, border: `1px solid ${C.coral}44`, borderRadius: 14, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
        <b style={{ color: C.coral }}>{L.nutritionWarn}</b>
      </div>

      <button onClick={() => onSave(local)}
        style={{ width: "100%", padding: "16px", borderRadius: 16, background: C.accent, color: "#000", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer" }}>
        {L.saveProfile}
      </button>
    </div>
  );
}

// ── Profile Screen ────────────────────────────────────────────────────────────
export default function ProfileScreen({
  xp, habits, isPremium, streak, onPremium,
  notif, perfectDays, earnProgress, daysLeft,
  profile, onSaveProfile, lang, onSetLang, onLogout, userEmail,
}) {
  const L = getLabel(lang);
  const [editMode, setEditMode] = useState(!profile?.height);
  const level  = Math.floor(xp / 100) + 1;
  const prog   = xp % 100;
  const bmi    = calcBMI(profile?.weight, profile?.height);
  const bmiCat = getBMICategory(parseFloat(bmi), L.imcLabels);

  const handleSave = (p) => { onSaveProfile(p); setEditMode(false); };

  if (editMode) return <ProfileForm profile={profile} onSave={handleSave} lang={lang} />;

  return (
    <div style={{ padding: "52px 24px 100px", position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>
          {lang === "en" ? "My " : "Mon "}<span style={{ color: C.accent }}>{lang === "en" ? "Profile" : lang === "es" ? "Perfil" : "Profil"}</span>
        </div>
        <button onClick={() => setEditMode(true)} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 10, cursor: "pointer" }}>{L.editProfile}</button>
      </div>

      {/* Language selector */}
      <div style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>🌍 {L.language}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ id: "fr", flag: "🇫🇷", label: "Français" }, { id: "en", flag: "🇬🇧", label: "English" }, { id: "es", flag: "🇪🇸", label: "Español" }].map((l) => (
            <div key={l.id} onClick={() => onSetLang(l.id)}
              style={{ flex: 1, padding: "10px 6px", borderRadius: 12, border: `2px solid ${lang === l.id ? C.accent : C.border}`, background: lang === l.id ? `${C.accent}18` : C.surface, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{l.flag}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: lang === l.id ? C.accent : C.muted, marginTop: 4 }}>{l.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 12px", background: `linear-gradient(135deg,${C.lavender},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: `0 0 30px ${C.accent}44` }}>🧘</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{lang === "en" ? "Zen User" : lang === "es" ? "Usuario Zen" : "Utilisateur Zen"}</div>
        <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, marginTop: 4 }}>{L.level} {level} · {xp} {L.xp}{isPremium ? " ✦" : ""}</div>
        {userEmail && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>📧 {userEmail}</div>}
        <div style={{ width: 160, height: 6, background: C.border, borderRadius: 3, margin: "10px auto 0" }}>
          <div style={{ width: `${prog}%`, height: "100%", background: C.accent, borderRadius: 3 }} />
        </div>
      </div>

      {/* Measurements */}
      {profile?.height && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { label: lang === "en" ? "Height" : "Taille", value: `${profile.height} cm`, color: C.sky },
            { label: lang === "en" ? "Weight" : "Poids",  value: `${profile.weight} kg`, color: C.lavender },
            ...(bmi ? [{ label: L.myIMC, value: bmi, color: bmiCat?.color, sub: bmiCat?.label }] : []),
            { label: L.idealWeight, value: `${getIdealWeight(profile.height, profile.gender)} kg`, color: C.gold },
          ].map((s, i) => (
            <div key={i} style={{ background: s.sub ? `${s.color}14` : C.card, borderRadius: 18, padding: "14px", border: `1px solid ${s.sub ? s.color + "44" : C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 10, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.sub}</div>}
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Goals */}
      {profile?.goals?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>{L.goals}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {profile.goals.map((gid) => (
              <div key={gid} style={{ background: `${C.accent}18`, border: `1px solid ${C.accent}44`, borderRadius: 20, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{GOAL_ICONS[gid]}</span>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>{L.goalLabels[gid]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[
          { l: L.streak,  v: `${streak}🔥`, c: C.gold },
          { l: L.habits,  v: `${habits.length}✓`, c: C.accent },
          { l: lang === "en" ? "Perfect" : lang === "es" ? "Perfectos" : "Parfaits", v: `${perfectDays}`, c: C.lavender },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: C.card, borderRadius: 18, padding: "14px 8px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div style={{ background: C.card, borderRadius: 20, padding: "18px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 26 }}>🔔</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{L.notifTitle}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{L.notifSub}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: notif.perm === "granted" ? C.accent : notif.perm === "denied" ? C.coral : C.muted, background: notif.perm === "granted" ? `${C.accent}18` : notif.perm === "denied" ? `${C.coral}18` : C.border, padding: "3px 8px", borderRadius: 8 }}>
            {notif.perm === "granted" ? L.notifGranted : notif.perm === "denied" ? L.notifDenied : L.notifPending}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {notif.perm !== "granted" && (
            <button onClick={notif.requestPerm} style={{ flex: 1, padding: "10px", borderRadius: 12, background: C.accent, color: "#000", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>{L.activateNotif}</button>
          )}
          <button onClick={() => notif.send({ emoji: "🔥", title: `${streak} streak!`, body: "" })}
            style={{ flex: 1, padding: "10px", borderRadius: 12, background: C.surface, color: C.text, fontWeight: 600, fontSize: 13, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            {L.testNotif}
          </button>
        </div>
      </div>

      {/* Premium block */}
      {isPremium ? (
        <div style={{ background: `linear-gradient(135deg,${C.gold}18,${C.coral}08)`, border: `1px solid ${C.gold}44`, borderRadius: 20, padding: "18px", marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.gold, marginBottom: 6 }}>✦ {L.proActive}</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{L.proRenew}<br />{L.renewIn}</div>
        </div>
      ) : (
        <div style={{ background: `linear-gradient(135deg,${C.gold}12,${C.coral}08)`, border: `1px solid ${C.gold}44`, borderRadius: 20, padding: "18px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <Ring pct={earnProgress} color={C.gold} size={52} stroke={4}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>{perfectDays}</div>
            </Ring>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4 }}>{L.goPro} ✨</div>
              <div style={{ fontSize: 12, color: C.muted }}>{daysLeft > 0 ? L.moreLeft(daysLeft) : L.activateFreeNow}</div>
            </div>
          </div>
          <button style={{ width: "100%", padding: "11px", borderRadius: 12, background: C.gold, color: "#000", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }} onClick={onPremium}>{L.seePlans}</button>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.accent, fontWeight: 600 }}>{L.autoEarn(EARN_DAYS)}</div>
        </div>
      )}

      {/* Settings */}
      {[L.darkMode, L.exportData, L.feedback, L.help].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: C.card, borderRadius: 14, marginBottom: 8, border: `1px solid ${C.border}`, cursor: "pointer" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{item}</div>
          <div style={{ color: C.muted }}>›</div>
        </div>
      ))}

      <button onClick={onLogout}
        style={{ width: "100%", padding: "14px", borderRadius: 14, background: "transparent", border: `1px solid ${C.coral}55`, color: C.coral, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
        🚪 {L.logout}
      </button>
    </div>
  );
}
