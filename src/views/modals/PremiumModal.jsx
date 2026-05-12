import { useState } from "react";
import { C } from "../../constants/colors.js";
import { getLabel } from "../../constants/labels.js";

export default function PremiumModal({ onClose, lang }) {
  const L = getLabel(lang);
  const [plan, setPlan] = useState("yearly");

  const plans = [
    { id: "monthly", name: L.monthly, price: L.monthlyPrice, sub: L.monthlySub, color: C.text },
    { id: "yearly",  name: L.yearly,  price: L.yearlyPrice,  sub: L.yearlySub,  color: C.gold, badge: true },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", zIndex: 200 }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "28px 28px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 420, margin: "0 auto", border: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>{L.premiumTitle}</div>
          <div style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>{L.premiumEarn}</div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {plans.map((p) => (
            <div key={p.id} onClick={() => setPlan(p.id)}
              style={{ flex: 1, padding: "16px", borderRadius: 18, border: `2px solid ${plan === p.id ? p.color : C.border}`, background: plan === p.id ? `${p.color}12` : C.surface, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.name}</div>
                {p.badge && <span style={{ fontSize: 9, background: C.gold, color: "#000", padding: "2px 5px", borderRadius: 5, fontWeight: 700 }}>-40%</span>}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: p.color }}>{p.price}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{p.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16, fontSize: 12, color: C.muted, lineHeight: 1.9 }}>{L.proFeatures.join(" · ")}</div>

        <button style={{ width: "100%", padding: "16px", borderRadius: 16, background: C.gold, color: "#000", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer" }} onClick={onClose}>
          {plan === "yearly" ? L.startYearly : L.startMonthly}
        </button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: C.muted }}>{L.trialNote}</div>
      </div>
    </div>
  );
}
