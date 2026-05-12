import { useState } from "react";
import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";
import { NUTRITION_ADS } from "../../constants/config.js";
import { calcBMI, getBMICategory } from "../../models/profileModel.js";

export default function NutritionSection({ isPremium, profile, lang }) {
  const L      = getLabel(lang);
  const bmi    = calcBMI(profile?.weight, profile?.height);
  const bmiCat = getBMICategory(parseFloat(bmi), L.imcLabels);
  const [adIdx]= useState(Math.floor(Math.random() * NUTRITION_ADS.length));
  const ad     = NUTRITION_ADS[adIdx];
  const adText = ad.text[lang] || ad.text.fr;
  const adCta  = ad.cta[lang]  || ad.cta.fr;

  const getTip = () => {
    if (!profile?.goals?.length)              return L.nutritionTips.default;
    if (profile.goals.includes("weightloss")) return L.nutritionTips.weightloss;
    if (profile.goals.includes("muscle"))     return L.nutritionTips.muscle;
    if (profile.goals.includes("energy"))     return L.nutritionTips.energy;
    return L.nutritionTips.default;
  };

  return (
    <div style={{ padding: "0 24px 24px" }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg,${C.coral}22,${C.gold}12)`, border: `2px solid ${C.coral}55`, borderRadius: 20, padding: "18px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 28 }}>🥦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{L.nutrition}</div>
            <div style={{ fontSize: 11, color: C.coral, fontWeight: 700 }}>{L.nutritionWarn}</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: bmi ? 10 : 0 }}>{getTip()}</div>
        {bmi && (
          <div style={{ background: C.card, borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, color: C.muted }}>{L.myIMC}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: bmiCat?.color }}>{bmi}</div>
              <div style={{ fontSize: 11, color: bmiCat?.color, fontWeight: 600 }}>{bmiCat?.label}</div>
            </div>
          </div>
        )}
      </div>

      {/* Sponsored ad (free users only) */}
      {!isPremium && (
        <div>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: C.gold, color: "#000", padding: "2px 7px", borderRadius: 5, fontSize: 9, fontWeight: 800 }}>{L.sponsored}</span>
            <span>{lang === "en" ? "Selected nutrition partner" : lang === "es" ? "Socio seleccionado" : "Partenaire nutrition"}</span>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.gold}44`, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 32 }}>{ad.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{adText}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ad.brand} · {ad.sub}</div>
            </div>
            <div style={{ padding: "9px 14px", borderRadius: 10, background: C.gold, color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>{adCta}</div>
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 6, textAlign: "center" }}>{L.sponsorNote}</div>
        </div>
      )}
    </div>
  );
}
