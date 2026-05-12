import { useState, useRef, useCallback } from "react";
import { getLabel } from "../constants/labels.js";
import { calcBMI } from "../models/profileModel.js";

function buildSystemPrompt(context, L) {
  const { mood, habitCount, streak, profile, steps, lang } = context;
  const bmi   = calcBMI(profile?.weight, profile?.height);
  const goals = profile?.goals?.map((g) => L.goalLabels[g]).filter(Boolean).join(", ") || "non définis";
  const langLine =
    lang === "en" ? "Always reply in English." :
    lang === "es" ? "Responde siempre en español." :
    "Réponds toujours en français.";

  return `Tu es VitaAI, coach bien-être expert de VitaZen. ${langLine}
PROFIL: taille=${profile?.height||"?"}cm, poids=${profile?.weight||"?"}kg, IMC=${bmi||"?"}, objectifs="${goals}", humeur="${mood||"?"}", habitudes=${habitCount}/5, pas=${steps||0}, streak=${streak}j.
RÈGLES STRICTES:
1. Conseil CONCRET et PERSONNALISÉ basé sur ce profil exact
2. UNE activité simple de 5-15 min adaptée (pas d'intensité si IMC>30)
3. Si pas < 5000 → suggère une courte marche ou étirements 10 min
4. Mentionne toujours que l'alimentation = 70% des résultats
5. Ton bienveillant, motivant, direct — 3-4 phrases MAX — 2 emojis MAX
6. JAMAIS de réponse générique comme "je suis là pour toi"`;
}

function buildInitMessage(context, L) {
  const { mood, habitCount, streak, profile, steps } = context;
  const bmi   = calcBMI(profile?.weight, profile?.height);
  const goals = profile?.goals?.length
    ? profile.goals.map((g) => L.goalLabels[g]).join(", ")
    : "";
  return `Bonjour ! ${habitCount}/5 habitudes. ${steps || 0} pas. Streak ${streak}j. IMC ${bmi || "?"}. ${goals ? "Objectifs: " + goals + "." : ""} ${mood ? "Humeur: " + mood + "." : ""} Conseil personnalisé et activité simple adaptée à ma journée ?`;
}

export function useAIController() {
  const [msgs,     setMsgs]     = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [hasError, setHasError] = useState(false);

  const callAPI = useCallback(async (allMsgs, context) => {
    setLoading(true);
    setHasError(false);
    const L      = getLabel(context.lang);
    const system = buildSystemPrompt(context, L);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:       "llama-3.1-8b-instant",
          max_tokens:  250,
          temperature: 0.8,
          messages:    [{ role: "system", content: system }, ...allMsgs],
        }),
      });

      if (!res.ok) throw new Error("API " + res.status);
      const d   = await res.json();
      const txt = d.choices?.[0]?.message?.content?.trim();
      if (!txt) throw new Error("empty");

      const updated = [...allMsgs, { role: "assistant", content: txt }];
      setMsgs(updated);
    } catch {
      setHasError(true);
      const L2 = getLabel(context.lang);
      setMsgs([...allMsgs, { role: "assistant", content: L2.aiError }]);
    }
    setLoading(false);
  }, []);

  const init = useCallback((context) => {
    const L   = getLabel(context.lang);
    const txt = buildInitMessage(context, L);
    const m   = [{ role: "user", content: txt }];
    setMsgs(m);
    callAPI(m, context);
  }, [callAPI]);

  const send = useCallback((text, context) => {
    const updated = [...msgs, { role: "user", content: text }];
    setMsgs(updated);
    callAPI(updated, context);
  }, [msgs, callAPI]);

  return { msgs, loading, hasError, init, send };
}
