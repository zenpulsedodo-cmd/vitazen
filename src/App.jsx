import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

// ─── COULEURS ─────────────────────────────────────────────────────────────────
const C = {
  bg:"#0D0F14", surface:"#13161E", card:"#191D28", border:"#252A38",
  accent:"#7EE8A2", gold:"#F5C842", coral:"#FF6B6B",
  sky:"#5BC4FF", lavender:"#B69EFF", text:"#EEF0F6", muted:"#6B728E",
};

// ─── TRADUCTIONS ──────────────────────────────────────────────────────────────
const T = {
  fr: {
    appName: "VitaZen",
    tagline: "Ton coach bien-être IA",
    home: "Accueil", stats: "Stats", profile: "Profil",
    howAreYou: "Comment tu te sens ?",
    energized: "Énergisé", calm: "Calme", tired: "Fatigué", stressed: "Stressé",
    habits: "Habitudes du jour",
    pillars: "Tes piliers bien-être",
    sleep: "Sommeil", hydration: "Hydratation", movement: "Mouvement", serenity: "Sérénité",
    nutrition: "L'alimentation : ton pilier N°1",
    nutritionWarning: "⚠️ Fondamentale — représente 70% de tes résultats",
    sponsored: "SPONSORISÉ",
    sponsorNote: "VitaZen perçoit une commission · Partenaires soigneusement sélectionnés",
    earnTitle: "🏆 Gagne 1 mois Pro gratuit",
    earnDesc: (n) => `Encore ${n} jour${n>1?"s":""} parfait${n>1?"s":""}…`,
    earnDone: "🎉 Félicitations, tu as gagné !",
    earnToday: (n, max) => `⏳ ${n}/${max} habitudes aujourd'hui`,
    perfectDay: "✅ Journée parfaite !",
    earnInfo: (hpd, days) => `Complète ${hpd} habitudes/jour pendant ${days} jours consécutifs → 1 mois Premium offert 🎁`,
    myStats: "Mes Stats",
    myProfile: "Mon Profil",
    thisWeek: "Score cette semaine",
    today: "Aujourd'hui",
    towardsPremium: "Vers le Premium mérité",
    perfectDays: "jours parfaits consécutifs",
    achievements: "Succès",
    height: "Taille (cm)", weight: "Poids (kg)",
    gender: "Genre (pour le calcul du poids idéal)",
    male: "Homme", female: "Femme", neutral: "Non précisé",
    goals: "Mes objectifs",
    saveProfile: "Sauvegarder mon profil ✓",
    editProfile: "✏️ Modifier",
    myIMC: "Ton IMC",
    idealWeight: "Poids idéal",
    imcNormal: "Poids normal ✓", imcUnder: "Insuffisance pondérale", imcOver: "Surpoids", imcObese: "Obésité",
    nutritionTip: {
      default: "Une alimentation équilibrée est le socle de tous tes objectifs bien-être.",
      weightloss: "Pour perdre du poids : déficit calorique modéré (-300 kcal/j), protéines élevées (1,6g/kg), légumes à volonté.",
      muscle: "Pour prendre du muscle : surplus calorique (+200 kcal/j), protéines à 2g/kg, repas autour de l'entraînement.",
      energy: "Pour booster l'énergie : 3 repas structurés, céréales complètes, oméga-3 et évite les sucres rapides.",
    },
    nutritionBottom: (p) => `Quel que soit ton objectif, l'alimentation représente 70% de tes résultats.`,
    goalLabels: {
      weightloss:"Perdre du poids", muscle:"Prendre du muscle", endurance:"Améliorer l'endurance",
      sleep:"Mieux dormir", stress:"Réduire le stress", energy:"Booster l'énergie",
    },
    notifications: "Rappel quotidien",
    notifSub: "1 seul message par jour, jamais plus",
    activateNotif: "Activer les notifs",
    testNotif: "Tester le rappel",
    notifSent: "✓ Envoyée !",
    notifGranted: "✓ Activées", notifDenied: "✗ Bloquées", notifPending: "En attente",
    proActive: "✦ PRO ACTIF", goPro: "✦ Passer Pro",
    premiumTitle: "VitaZen Pro",
    premiumEarn: "🏆 Ou gagne-le : 30 jours parfaits = 1 mois offert",
    monthly: "Mensuel", yearly: "Annuel",
    monthlyPrice: "4,99€", yearlyPrice: "2,99€",
    monthlySub: "Sans engagement", yearlySub: "35,88€/an • -40%",
    startMonthly: "Commencer à 4,99€/mois →",
    startYearly: "Commencer à 2,99€/mois →",
    trialNote: "Essai 7 jours gratuit · Annulation à tout moment",
    earnedTitle: "Félicitations !",
    earnedSub: "Tu as gagné 1 mois Premium gratuit",
    earnedDesc: (n) => `${n} jours de constance parfaite. VitaZen te récompense automatiquement.`,
    activateFree: "Activer mon mois gratuit →",
    noCard: "Aucune carte bancaire requise",
    proFeatures: ["✨ VitaAI illimitée","🚫 Zéro publicité","📊 Rapports PDF hebdo","⚡ Accès prioritaire"],
    aiName: "VitaAI",
    aiSub: "Coach IA personnalisé",
    aiThinking: "Analyse ton profil...",
    aiPlaceholder: "Pose ta question à VitaAI...",
    completeProfile: "Complète ton profil !",
    completeProfileSub: "Taille, poids et objectifs pour des conseils personnalisés",
    profileSaved: "Profil sauvegardé !",
    profileSavedBody: "VitaAI va personnaliser tes conseils selon ton profil.",
    proActivated: "Premium activé !",
    proActivatedBody: "1 mois Pro offert pour ta constance. Profite-en !",
    streakToast: (n, left) => `${n} jours de streak ! Plus que ${left} jours parfaits pour ton mois Premium.`,
    language: "Langue",
    darkMode: "🌙 Mode sombre",
    exportData: "📤 Exporter mes données",
    feedback: "💬 Feedback",
    help: "❓ Aide",
    level: "Niveau",
    xp: "XP",
    streak: "Streak",
    habitsDone: "Habitudes",
    moreLeft: (n) => `Encore ${n} jours parfaits pour le gagner !`,
    activateFreeNow: "🎉 Active ton mois gratuit !",
    seePlans: "Voir les plans →",
    autoEarn: (n) => `🏆 ${n} jours parfaits = 1 mois offert automatiquement`,
    renewIn: "Renouvellement dans 28 jours",
    proRenew: "ZitaAI illimitée · Zéro pub · Rapports PDF",
    habitTitles: {
      1: "Boire 2L d'eau", 2: "10 min de méditation",
      3: "30 min de marche", 4: "Journaling du soir", 5: "Coucher avant 23h"
    },
    habitTimes: {
      1: "Toute la journée", 2: "Matin • 7:00",
      3: "Midi • 12:30", 4: "Soir • 21:00", 5: "Nuit • 22:45"
    },
    days: ["L","M","M","J","V","S","D"],
    dateLocale: "fr-FR",
  },
  en: {
    appName: "VitaZen",
    tagline: "Your AI wellness coach",
    home: "Home", stats: "Stats", profile: "Profile",
    howAreYou: "How are you feeling?",
    energized: "Energized", calm: "Calm", tired: "Tired", stressed: "Stressed",
    habits: "Today's Habits",
    pillars: "Your wellness pillars",
    sleep: "Sleep", hydration: "Hydration", movement: "Movement", serenity: "Serenity",
    nutrition: "Nutrition: Your #1 Pillar",
    nutritionWarning: "⚠️ Essential — accounts for 70% of your results",
    sponsored: "SPONSORED",
    sponsorNote: "VitaZen earns a commission · Carefully selected partners",
    earnTitle: "🏆 Earn 1 free Pro month",
    earnDesc: (n) => `${n} more perfect day${n>1?"s":""}…`,
    earnDone: "🎉 Congratulations, you've earned it!",
    earnToday: (n, max) => `⏳ ${n}/${max} habits today`,
    perfectDay: "✅ Perfect day!",
    earnInfo: (hpd, days) => `Complete ${hpd} habits/day for ${days} consecutive days → 1 free Premium month 🎁`,
    myStats: "My Stats",
    myProfile: "My Profile",
    thisWeek: "This week's score",
    today: "Today",
    towardsPremium: "Towards earned Premium",
    perfectDays: "consecutive perfect days",
    achievements: "Achievements",
    height: "Height (cm)", weight: "Weight (kg)",
    gender: "Gender (for ideal weight calculation)",
    male: "Male", female: "Female", neutral: "Prefer not to say",
    goals: "My goals",
    saveProfile: "Save my profile ✓",
    editProfile: "✏️ Edit",
    myIMC: "Your BMI",
    idealWeight: "Ideal weight",
    imcNormal: "Normal weight ✓", imcUnder: "Underweight", imcOver: "Overweight", imcObese: "Obese",
    nutritionTip: {
      default: "A balanced diet is the foundation of all your wellness goals.",
      weightloss: "To lose weight: moderate calorie deficit (-300 kcal/day), high protein (1.6g/kg), vegetables freely.",
      muscle: "To build muscle: calorie surplus (+200 kcal/day), protein at 2g/kg, meals around training.",
      energy: "To boost energy: 3 structured meals, whole grains, omega-3, avoid fast sugars.",
    },
    nutritionBottom: () => `Whatever your goal, nutrition accounts for 70% of your results.`,
    goalLabels: {
      weightloss:"Lose weight", muscle:"Build muscle", endurance:"Improve endurance",
      sleep:"Sleep better", stress:"Reduce stress", energy:"Boost energy",
    },
    notifications: "Daily reminder",
    notifSub: "Just 1 message per day, never more",
    activateNotif: "Enable notifications",
    testNotif: "Test reminder",
    notifSent: "✓ Sent!",
    notifGranted: "✓ Enabled", notifDenied: "✗ Blocked", notifPending: "Pending",
    proActive: "✦ PRO ACTIVE", goPro: "✦ Go Pro",
    premiumTitle: "VitaZen Pro",
    premiumEarn: "🏆 Or earn it: 30 perfect days = 1 month free",
    monthly: "Monthly", yearly: "Yearly",
    monthlyPrice: "€4.99", yearlyPrice: "€2.99",
    monthlySub: "No commitment", yearlySub: "€35.88/yr • -40%",
    startMonthly: "Start at €4.99/month →",
    startYearly: "Start at €2.99/month →",
    trialNote: "7-day free trial · Cancel anytime",
    earnedTitle: "Congratulations!",
    earnedSub: "You've earned 1 free Premium month",
    earnedDesc: (n) => `${n} days of perfect consistency. VitaZen rewards you automatically.`,
    activateFree: "Activate my free month →",
    noCard: "No credit card required",
    proFeatures: ["✨ Unlimited VitaAI","🚫 Zero ads","📊 Weekly PDF reports","⚡ Priority access"],
    aiName: "VitaAI",
    aiSub: "Personalized AI coach",
    aiThinking: "Analyzing your profile...",
    aiPlaceholder: "Ask VitaAI anything...",
    completeProfile: "Complete your profile!",
    completeProfileSub: "Height, weight and goals for personalized advice",
    profileSaved: "Profile saved!",
    profileSavedBody: "VitaAI will personalize your advice based on your profile.",
    proActivated: "Premium activated!",
    proActivatedBody: "1 Pro month for your consistency. Enjoy!",
    streakToast: (n, left) => `${n} day streak! ${left} more perfect days for your free Premium month.`,
    language: "Language",
    darkMode: "🌙 Dark mode",
    exportData: "📤 Export my data",
    feedback: "💬 Feedback",
    help: "❓ Help",
    level: "Level",
    xp: "XP",
    streak: "Streak",
    habitsDone: "Habits",
    moreLeft: (n) => `${n} more perfect days to earn it!`,
    activateFreeNow: "🎉 Activate your free month!",
    seePlans: "See plans →",
    autoEarn: (n) => `🏆 ${n} perfect days = 1 month free automatically`,
    renewIn: "Renewal in 28 days",
    proRenew: "Unlimited VitaAI · Zero ads · PDF reports",
    habitTitles: {
      1: "Drink 2L of water", 2: "10 min meditation",
      3: "30 min walk", 4: "Evening journaling", 5: "Bed before 11pm"
    },
    habitTimes: {
      1: "All day", 2: "Morning • 7:00",
      3: "Noon • 12:30", 4: "Evening • 9:00pm", 5: "Night • 10:45pm"
    },
    days: ["M","T","W","T","F","S","S"],
    dateLocale: "en-GB",
  },
  es: {
    appName: "VitaZen",
    tagline: "Tu coach de bienestar IA",
    home: "Inicio", stats: "Stats", profile: "Perfil",
    howAreYou: "¿Cómo te sientes?",
    energized: "Energizado", calm: "Tranquilo", tired: "Cansado", stressed: "Estresado",
    habits: "Hábitos de hoy",
    pillars: "Tus pilares de bienestar",
    sleep: "Sueño", hydration: "Hidratación", movement: "Movimiento", serenity: "Serenidad",
    nutrition: "Alimentación: tu Pilar N°1",
    nutritionWarning: "⚠️ Fundamental — representa el 70% de tus resultados",
    sponsored: "PATROCINADO",
    sponsorNote: "VitaZen recibe una comisión · Socios cuidadosamente seleccionados",
    earnTitle: "🏆 Gana 1 mes Pro gratis",
    earnDesc: (n) => `Aún ${n} día${n>1?"s":""} perfecto${n>1?"s":""}…`,
    earnDone: "🎉 ¡Felicidades, lo has ganado!",
    earnToday: (n, max) => `⏳ ${n}/${max} hábitos hoy`,
    perfectDay: "✅ ¡Día perfecto!",
    earnInfo: (hpd, days) => `Completa ${hpd} hábitos/día durante ${days} días consecutivos → 1 mes Premium gratis 🎁`,
    myStats: "Mis Stats",
    myProfile: "Mi Perfil",
    thisWeek: "Puntuación esta semana",
    today: "Hoy",
    towardsPremium: "Hacia el Premium merecido",
    perfectDays: "días perfectos consecutivos",
    achievements: "Logros",
    height: "Altura (cm)", weight: "Peso (kg)",
    gender: "Género (para el cálculo del peso ideal)",
    male: "Hombre", female: "Mujer", neutral: "No especificar",
    goals: "Mis objetivos",
    saveProfile: "Guardar mi perfil ✓",
    editProfile: "✏️ Editar",
    myIMC: "Tu IMC",
    idealWeight: "Peso ideal",
    imcNormal: "Peso normal ✓", imcUnder: "Bajo peso", imcOver: "Sobrepeso", imcObese: "Obesidad",
    nutritionTip: {
      default: "Una alimentación equilibrada es la base de todos tus objetivos de bienestar.",
      weightloss: "Para perder peso: déficit calórico moderado (-300 kcal/d), proteínas altas (1,6g/kg), verduras a voluntad.",
      muscle: "Para ganar músculo: superávit calórico (+200 kcal/d), proteínas a 2g/kg, comidas alrededor del entrenamiento.",
      energy: "Para aumentar la energía: 3 comidas estructuradas, cereales integrales, omega-3, evita los azúcares rápidos.",
    },
    nutritionBottom: () => `Sea cual sea tu objetivo, la alimentación representa el 70% de tus resultados.`,
    goalLabels: {
      weightloss:"Perder peso", muscle:"Ganar músculo", endurance:"Mejorar resistencia",
      sleep:"Dormir mejor", stress:"Reducir el estrés", energy:"Aumentar energía",
    },
    notifications: "Recordatorio diario",
    notifSub: "Solo 1 mensaje por día, nunca más",
    activateNotif: "Activar notificaciones",
    testNotif: "Probar recordatorio",
    notifSent: "✓ ¡Enviado!",
    notifGranted: "✓ Activadas", notifDenied: "✗ Bloqueadas", notifPending: "Pendiente",
    proActive: "✦ PRO ACTIVO", goPro: "✦ Ir a Pro",
    premiumTitle: "VitaZen Pro",
    premiumEarn: "🏆 O gánalo: 30 días perfectos = 1 mes gratis",
    monthly: "Mensual", yearly: "Anual",
    monthlyPrice: "4,99€", yearlyPrice: "2,99€",
    monthlySub: "Sin compromiso", yearlySub: "35,88€/año • -40%",
    startMonthly: "Empezar a 4,99€/mes →",
    startYearly: "Empezar a 2,99€/mes →",
    trialNote: "Prueba 7 días gratis · Cancelar en cualquier momento",
    earnedTitle: "¡Felicidades!",
    earnedSub: "Has ganado 1 mes Premium gratis",
    earnedDesc: (n) => `${n} días de constancia perfecta. VitaZen te recompensa automáticamente.`,
    activateFree: "Activar mi mes gratis →",
    noCard: "No se requiere tarjeta bancaria",
    proFeatures: ["✨ VitaAI ilimitada","🚫 Cero publicidad","📊 Informes PDF semanales","⚡ Acceso prioritario"],
    aiName: "VitaAI",
    aiSub: "Coach IA personalizado",
    aiThinking: "Analizando tu perfil...",
    aiPlaceholder: "Pregunta a VitaAI...",
    completeProfile: "¡Completa tu perfil!",
    completeProfileSub: "Altura, peso y objetivos para consejos personalizados",
    profileSaved: "¡Perfil guardado!",
    profileSavedBody: "VitaAI personalizará tus consejos según tu perfil.",
    proActivated: "¡Premium activado!",
    proActivatedBody: "1 mes Pro por tu constancia. ¡Disfrútalo!",
    streakToast: (n, left) => `¡${n} días de racha! ${left} días perfectos más para tu mes Premium gratis.`,
    language: "Idioma",
    darkMode: "🌙 Modo oscuro",
    exportData: "📤 Exportar mis datos",
    feedback: "💬 Comentarios",
    help: "❓ Ayuda",
    level: "Nivel",
    xp: "XP",
    streak: "Racha",
    habitsDone: "Hábitos",
    moreLeft: (n) => `¡${n} días perfectos más para ganarlo!`,
    activateFreeNow: "🎉 ¡Activa tu mes gratis!",
    seePlans: "Ver planes →",
    autoEarn: (n) => `🏆 ${n} días perfectos = 1 mes gratis automáticamente`,
    renewIn: "Renovación en 28 días",
    proRenew: "VitaAI ilimitada · Cero anuncios · Informes PDF",
    habitTitles: {
      1: "Beber 2L de agua", 2: "10 min de meditación",
      3: "30 min de caminata", 4: "Diario de la tarde", 5: "Dormir antes de las 23h"
    },
    habitTimes: {
      1: "Todo el día", 2: "Mañana • 7:00",
      3: "Mediodía • 12:30", 4: "Tarde • 21:00", 5: "Noche • 22:45"
    },
    days: ["L","M","X","J","V","S","D"],
    dateLocale: "es-ES",
  }
};

const EARN_DAYS = 30;
const HABITS_FOR_PERFECT = 4;
const HABIT_XP = {1:"+10 XP", 2:"+20 XP", 3:"+30 XP", 4:"+15 XP", 5:"+25 XP"};
const HABIT_ICONS = {1:"💧", 2:"🧘", 3:"🚶", 4:"📓", 5:"🌙"};
const MOOD_EMOJIS = {energized:"⚡", calm:"🌊", tired:"😴", stressed:"🌪️"};
const MOOD_COLORS = {energized:C.gold, calm:C.sky, tired:C.lavender, stressed:C.coral};
const PILLAR_IDS = ["sleep","hydration","movement","serenity"];
const PILLAR_ICONS = {sleep:"🌙", hydration:"💧", movement:"🏃", serenity:"🧘"};
const PILLAR_COLORS = {sleep:C.lavender, hydration:C.sky, movement:C.coral, serenity:C.accent};
const GOAL_IDS = ["weightloss","muscle","endurance","sleep","stress","energy"];
const GOAL_ICONS = {weightloss:"⚖️", muscle:"💪", endurance:"🏃", sleep:"🌙", stress:"🧘", energy:"⚡"};
const WEEK_DATA = [62,74,81,58,90,77,85];

const NUTRITION_ADS = [
  {icon:"🥗", brand:"NutriBox", textFr:"Livraison repas équilibrés", textEn:"Balanced meal delivery", textEs:"Entrega de comidas equilibradas", sub:"–30% • Code VITAZEN", cta:{fr:"Voir",en:"View",es:"Ver"}},
  {icon:"🧃", brand:"FreshMeal", textFr:"Meal prep santé clé en main", textEn:"Ready-made healthy meal prep", textEs:"Meal prep saludable listo", sub:"7 repas/semaine livrés frais", cta:{fr:"Commander",en:"Order",es:"Pedir"}},
  {icon:"🌾", brand:"GreenPlate", textFr:"Menus végétaux personnalisés", textEn:"Personalized plant-based menus", textEs:"Menús vegetales personalizados", sub:"Adapté à ton IMC et objectifs", cta:{fr:"Essayer",en:"Try",es:"Probar"}},
];

// ─── UTILITAIRES ──────────────────────────────────────────────────────────────
function calcBMI(weight, height) {
  if (!weight || !height) return null;
  return (weight / ((height/100)**2)).toFixed(1);
}

function getBMICategory(bmi, t) {
  if (!bmi) return null;
  if (bmi < 18.5) return {label: t.imcUnder, color: C.sky};
  if (bmi < 25)   return {label: t.imcNormal, color: C.accent};
  if (bmi < 30)   return {label: t.imcOver, color: C.gold};
  return {label: t.imcObese, color: C.coral};
}

function getIdealWeight(height, gender) {
  if (!height) return null;
  if (gender === "male"   || gender === "homme") return Math.round(height - 100 - (height-150)/4);
  if (gender === "female" || gender === "femme") return Math.round(height - 100 - (height-150)/2.5);
  return Math.round(height - 100 - (height-150)/3.5);
}

// ─── RING ─────────────────────────────────────────────────────────────────────
function Ring({pct, color, size=80, stroke=6, children}) {
  const r = (size - stroke*2) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (pct/100) * circ;
  return (
    <div style={{position:"relative", width:size, height:size, flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)", position:"absolute", inset:0}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}>
        {children}
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg}) {
  return (
    <div style={{
      position:"fixed", top:msg?56:-120, left:"50%", transform:"translateX(-50%)",
      background:C.card, border:`1px solid ${C.accent}44`, borderRadius:18,
      padding:"13px 18px", display:"flex", alignItems:"center", gap:12,
      boxShadow:"0 8px 32px #00000077", zIndex:999,
      transition:"top 0.4s cubic-bezier(.4,0,.2,1)", maxWidth:370, width:"90%",
    }}>
      <div style={{fontSize:24}}>{msg?.emoji||"🔔"}</div>
      <div>
        <div style={{fontSize:13, fontWeight:700, color:C.text, marginBottom:2}}>{msg?.title}</div>
        <div style={{fontSize:12, color:C.muted, lineHeight:1.4}}>{msg?.body}</div>
      </div>
    </div>
  );
}

// ─── NOTIF HOOK ───────────────────────────────────────────────────────────────
function useNotif() {
  const [toast, setToast] = useState(null);
  const [perm, setPerm] = useState("default");
  const timer = useRef(null);
  const lastDay = useRef(null);

  useEffect(() => { if ("Notification" in window) setPerm(Notification.permission); }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4800);
  }, []);

  const requestPerm = async () => {
    if (!("Notification" in window)) return false;
    const p = await Notification.requestPermission();
    setPerm(p); return p === "granted";
  };

  const send = useCallback((msg) => {
    const today = new Date().toDateString();
    if (lastDay.current === today) return;
    lastDay.current = today;
    showToast(msg);
    if (perm === "granted" && "Notification" in window) {
      try { new Notification(msg.title, {body: msg.body}); } catch {}
    }
  }, [perm, showToast]);

  return {toast, showToast, send, requestPerm, perm};
}

// ─── VITAAI HOOK ──────────────────────────────────────────────────────────────
function useVitaAI() {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const callAPI = async (allMsgs, mood, habitCount, streak, profile, lang) => {
    setLoading(true);
    const bmi = calcBMI(profile?.weight, profile?.height);
    const t = T[lang] || T.fr;
    const goals = profile?.goals?.map(g => t.goalLabels[g]).filter(Boolean).join(", ") || "?";
    const langInstructions = lang === "en" ? "Answer in English." : lang === "es" ? "Responde en español." : "Réponds en français.";
    const sys = `Tu es VitaAI, coach bien-être de VitaZen. ${langInstructions}
Profil: taille=${profile?.height||"?"}cm, poids=${profile?.weight||"?"}kg, IMC=${bmi||"?"}, objectifs="${goals}", humeur="${mood||"?"}".
Habitudes: ${habitCount}/5 aujourd'hui, streak: ${streak}j.
Rappelle toujours que l'alimentation est FONDAMENTALE (70% des résultats).
Réponds en 2-3 phrases max, propose 1 action concrète adaptée au profil. Tutoie si français/espagnol. Max 2 emojis.`;

    try {
      const groqMessages = [{role:"system", content:sys}, ...allMsgs];
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({model:"llama3-8b-8192", max_tokens:1000, messages:groqMessages}),
      });
      const d = await res.json();
      const txt = d.choices?.[0]?.message?.content || "Je suis là pour toi ! 💪";
      setMsgs([...allMsgs, {role:"assistant", content:txt}]);
    } catch {
      setMsgs([...allMsgs, {role:"assistant", content:"Petit souci de connexion 🔄"}]);
    }
    setLoading(false);
  };

  const init = useCallback((mood, habitCount, streak, profile, lang) => {
    const t = T[lang] || T.fr;
    const bmi = calcBMI(profile?.weight, profile?.height);
    const goals = profile?.goals?.length ? profile.goals.map(g => t.goalLabels[g]).join(", ") : "";
    const txt = `Bonjour ! ${habitCount} habitudes. Streak ${streak}j. IMC ${bmi||"non renseigné"}. ${goals ? "Objectifs: "+goals+"." : ""} Conseil rapide ?`;
    const m = [{role:"user", content:txt}];
    setMsgs(m);
    callAPI(m, mood, habitCount, streak, profile, lang);
  }, []);

  const send = useCallback((text, mood, habitCount, streak, profile, lang) => {
    const updated = [...msgs, {role:"user", content:text}];
    setMsgs(updated);
    callAPI(updated, mood, habitCount, streak, profile, lang);
  }, [msgs]);

  return {msgs, loading, init, send};
}

// ─── VITAAI CARD ──────────────────────────────────────────────────────────────
function AICard({mood, habits, streak, isPremium, profile, lang}) {
  const t = T[lang] || T.fr;
  const {msgs, loading, init, send} = useVitaAI();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const chatRef = useRef(null);
  const initDone = useRef(false);

  useEffect(() => {
    if (!initDone.current) { initDone.current = true; init(mood, habits.length, streak, profile, lang); }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  const lastAI = msgs.filter(m => m.role === "assistant").slice(-1)[0];

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input.trim(); setInput("");
    send(text, mood, habits.length, streak, profile, lang);
    setOpen(true);
  };

  return (
    <div style={{margin:"0 24px 24px", background:`linear-gradient(135deg,${C.lavender}18,${C.sky}12)`, border:`1px solid ${C.lavender}44`, borderRadius:22, padding:"20px"}}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:14}}>
        <div style={{width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.lavender},${C.sky})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:loading?`0 0 16px ${C.lavender}88`:"none"}}>
          {loading ? <span style={{display:"inline-block", animation:"spin 0.8s linear infinite"}}>⟳</span> : "🤖"}
        </div>
        <div>
          <div style={{fontSize:14, fontWeight:700, color:C.text}}>{t.aiName} {isPremium && <span style={{color:C.gold, fontSize:11}}>✦ Pro</span>}</div>
          <div style={{fontSize:11, color:loading?C.accent:C.muted}}>{loading ? t.aiThinking : t.aiSub}</div>
        </div>
        <div style={{marginLeft:"auto", cursor:"pointer", fontSize:16, color:C.muted, padding:4}} onClick={() => setOpen(!open)}>
          {open ? "▲" : "▼"}
        </div>
      </div>

      {!open && (
        <div style={{fontSize:14, color:C.text, lineHeight:1.65, marginBottom:14, minHeight:42}}>
          {loading && msgs.length === 0
            ? <span style={{color:C.muted}}>{t.aiThinking}</span>
            : lastAI?.content || t.completeProfileSub}
        </div>
      )}

      {open && (
        <div ref={chatRef} style={{display:"flex", flexDirection:"column", gap:10, maxHeight:200, overflowY:"auto", marginBottom:12, paddingRight:2}}>
          {msgs.filter((m,i) => m.role !== "user" || i > 0).map((m, i) => (
            <div key={i} style={{display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"88%", padding:"11px 14px", borderRadius:m.role==="assistant"?"4px 18px 18px 18px":"18px 4px 18px 18px", background:m.role==="assistant"?`${C.lavender}22`:C.card, border:`1px solid ${m.role==="assistant"?C.lavender+"44":C.border}`, fontSize:14, lineHeight:1.6, color:C.text}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && msgs[msgs.length-1]?.role === "user" && (
            <div style={{display:"flex"}}>
              <div style={{padding:"11px 14px", borderRadius:"4px 18px 18px 18px", background:`${C.lavender}22`, border:`1px solid ${C.lavender}44`, fontSize:14, color:C.muted}}>...</div>
            </div>
          )}
        </div>
      )}

      <div style={{display:"flex", gap:8, marginTop:4}}>
        <input
          style={{flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif"}}
          placeholder={t.aiPlaceholder}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          maxLength={200}
        />
        <button onClick={handleSend} style={{width:40, height:40, borderRadius:12, background:input.trim()&&!loading?C.accent:C.border, border:"none", cursor:input.trim()&&!loading?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0}}>
          →
        </button>
      </div>
    </div>
  );
}

// ─── NUTRITION ────────────────────────────────────────────────────────────────
function NutritionSection({isPremium, profile, lang}) {
  const t = T[lang] || T.fr;
  const bmi = calcBMI(profile?.weight, profile?.height);
  const bmiCat = getBMICategory(parseFloat(bmi), t);
  const [adIdx] = useState(Math.floor(Math.random() * NUTRITION_ADS.length));
  const ad = NUTRITION_ADS[adIdx];
  const adText = lang === "en" ? ad.textEn : lang === "es" ? ad.textEs : ad.textFr;
  const adCta = ad.cta[lang] || ad.cta.fr;

  const getTip = () => {
    if (!profile?.goals?.length) return t.nutritionTip.default;
    if (profile.goals.includes("weightloss")) return t.nutritionTip.weightloss;
    if (profile.goals.includes("muscle")) return t.nutritionTip.muscle;
    if (profile.goals.includes("energy")) return t.nutritionTip.energy;
    return t.nutritionTip.default;
  };

  return (
    <div style={{padding:"0 24px 24px"}}>
      <div style={{background:`linear-gradient(135deg,${C.coral}22,${C.gold}12)`, border:`2px solid ${C.coral}55`, borderRadius:20, padding:"18px", marginBottom:16}}>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
          <div style={{fontSize:28}}>🥦</div>
          <div>
            <div style={{fontSize:15, fontWeight:800, color:C.text}}>{t.nutrition}</div>
            <div style={{fontSize:11, color:C.coral, fontWeight:700}}>{t.nutritionWarning}</div>
          </div>
        </div>
        <div style={{fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:10}}>{getTip()}</div>
        {bmi && (
          <div style={{background:C.card, borderRadius:12, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${C.border}`}}>
            <div style={{fontSize:12, color:C.muted}}>{t.myIMC}</div>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <div style={{fontSize:18, fontWeight:800, color:bmiCat?.color}}>{bmi}</div>
              <div style={{fontSize:11, color:bmiCat?.color, fontWeight:600}}>{bmiCat?.label}</div>
            </div>
          </div>
        )}
      </div>

      {!isPremium && (
        <div>
          <div style={{fontSize:10, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:8, display:"flex", alignItems:"center", gap:6}}>
            <span style={{background:C.gold, color:"#000", padding:"2px 7px", borderRadius:5, fontSize:9, fontWeight:800}}>{t.sponsored}</span>
            <span>{lang==="en"?"Selected nutrition partner":lang==="es"?"Socio de nutrición seleccionado":"Partenaire nutrition sélectionné"}</span>
          </div>
          <div style={{background:C.surface, border:`1px solid ${C.gold}44`, borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12}}>
            <div style={{fontSize:32}}>{ad.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13, color:C.text, fontWeight:600}}>{adText}</div>
              <div style={{fontSize:11, color:C.muted, marginTop:2}}>{ad.brand} · {ad.sub}</div>
            </div>
            <div style={{padding:"9px 14px", borderRadius:10, background:C.gold, color:"#000", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0}}>{adCta}</div>
          </div>
          <div style={{fontSize:10, color:C.muted, marginTop:6, textAlign:"center"}}>{t.sponsorNote}</div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIF PANEL ──────────────────────────────────────────────────────────────
function NotifPanel({perm, requestPerm, send, streak, lang}) {
  const t = T[lang] || T.fr;
  const [sent, setSent] = useState(false);
  const test = () => {
    send({emoji:"🔥", title:t.streakToast(streak, EARN_DAYS-streak).split("!")[0]+"!", body:t.streakToast(streak, EARN_DAYS-streak).split("!").slice(1).join("!")});
    setSent(true); setTimeout(() => setSent(false), 3000);
  };
  return (
    <div style={{background:C.card, borderRadius:20, padding:"18px", border:`1px solid ${C.border}`, marginBottom:14}}>
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:14}}>
        <div style={{fontSize:26}}>🔔</div>
        <div>
          <div style={{fontSize:15, fontWeight:700, color:C.text}}>{t.notifications}</div>
          <div style={{fontSize:12, color:C.muted}}>{t.notifSub}</div>
        </div>
        <div style={{marginLeft:"auto", fontSize:10, fontWeight:700, color:perm==="granted"?C.accent:perm==="denied"?C.coral:C.muted, background:perm==="granted"?`${C.accent}18`:perm==="denied"?`${C.coral}18`:C.border, padding:"3px 8px", borderRadius:8}}>
          {perm==="granted"?t.notifGranted:perm==="denied"?t.notifDenied:t.notifPending}
        </div>
      </div>
      <div style={{display:"flex", gap:8}}>
        {perm !== "granted" && (
          <button onClick={requestPerm} style={{flex:1, padding:"10px", borderRadius:12, background:C.accent, color:"#000", fontWeight:700, fontSize:13, border:"none", cursor:"pointer"}}>
            {t.activateNotif}
          </button>
        )}
        <button onClick={test} disabled={sent} style={{flex:1, padding:"10px", borderRadius:12, background:sent?C.border:C.surface, color:sent?C.muted:C.text, fontWeight:600, fontSize:13, border:`1px solid ${C.border}`, cursor:sent?"default":"pointer"}}>
          {sent ? t.notifSent : t.testNotif}
        </button>
      </div>
    </div>
  );
}

// ─── EARN CARD ────────────────────────────────────────────────────────────────
function EarnCard({perfectDays, daysLeft, progress, habits, lang}) {
  const t = T[lang] || T.fr;
  const today = habits.length >= HABITS_FOR_PERFECT;
  return (
    <div style={{margin:"0 24px 24px", background:`linear-gradient(135deg,${C.gold}12,${C.accent}08)`, border:`1px solid ${C.gold}44`, borderRadius:22, padding:"20px"}}>
      <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:14}}>
        <Ring pct={progress} color={C.gold} size={80} stroke={6}>
          <div style={{fontSize:18, fontWeight:800, color:C.gold}}>{perfectDays}</div>
          <div style={{fontSize:9, color:C.muted, fontWeight:600}}>/{EARN_DAYS}</div>
        </Ring>
        <div style={{flex:1}}>
          <div style={{fontSize:15, fontWeight:800, color:C.text, marginBottom:4}}>{t.earnTitle}</div>
          <div style={{fontSize:13, color:C.muted, lineHeight:1.5}}>
            {daysLeft > 0 ? t.earnDesc(daysLeft) : t.earnDone}
          </div>
          <div style={{fontSize:11, fontWeight:700, color:today?C.accent:C.muted, marginTop:8}}>
            {today ? t.perfectDay : t.earnToday(habits.length, HABITS_FOR_PERFECT)}
          </div>
        </div>
      </div>
      <div style={{fontSize:11, color:C.muted, lineHeight:1.7}}>{t.earnInfo(HABITS_FOR_PERFECT, EARN_DAYS)}</div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function EarnedModal({onClose, onActivate, lang}) {
  const t = T[lang] || T.fr;
  return (
    <div style={{position:"fixed", inset:0, background:"#00000088", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", zIndex:200}} onClick={onClose}>
      <div style={{background:C.card, borderRadius:"28px 28px 0 0", padding:"28px 24px 40px", width:"100%", maxWidth:420, margin:"0 auto", border:`1px solid ${C.border}`}} onClick={e => e.stopPropagation()}>
        <div style={{textAlign:"center", marginBottom:24}}>
          <div style={{fontSize:56, marginBottom:10}}>🏆</div>
          <div style={{fontSize:22, fontWeight:800, color:C.text, marginBottom:6}}>{t.earnedTitle}</div>
          <div style={{fontSize:15, color:C.gold, fontWeight:700, marginBottom:12}}>{t.earnedSub}</div>
          <div style={{fontSize:14, color:C.muted, lineHeight:1.6}}>{t.earnedDesc(EARN_DAYS)}</div>
        </div>
        <div style={{background:C.surface, borderRadius:14, padding:"14px 16px", marginBottom:20, border:`1px solid ${C.border}`}}>
          {t.proFeatures.map((f,i,a) => (
            <div key={i} style={{fontSize:13, color:C.text, padding:"7px 0", borderBottom:i<a.length-1?`1px solid ${C.border}`:"none"}}>{f}</div>
          ))}
        </div>
        <button style={{width:"100%", padding:"16px", borderRadius:16, background:C.gold, color:"#000", fontWeight:800, fontSize:16, border:"none", cursor:"pointer"}} onClick={onActivate}>
          {t.activateFree}
        </button>
        <div style={{textAlign:"center", marginTop:10, fontSize:11, color:C.muted}}>{t.noCard}</div>
      </div>
    </div>
  );
}

function PremiumModal({onClose, lang}) {
  const t = T[lang] || T.fr;
  const [plan, setPlan] = useState("yearly");
  return (
    <div style={{position:"fixed", inset:0, background:"#00000088", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", zIndex:200}} onClick={onClose}>
      <div style={{background:C.card, borderRadius:"28px 28px 0 0", padding:"28px 24px 40px", width:"100%", maxWidth:420, margin:"0 auto", border:`1px solid ${C.border}`}} onClick={e => e.stopPropagation()}>
        <div style={{textAlign:"center", marginBottom:20}}>
          <div style={{fontSize:40, marginBottom:8}}>✨</div>
          <div style={{fontSize:20, fontWeight:800, color:C.text, marginBottom:4}}>{t.premiumTitle}</div>
          <div style={{fontSize:13, color:C.accent, fontWeight:600}}>{t.premiumEarn}</div>
        </div>
        <div style={{display:"flex", gap:12, marginBottom:20}}>
          {[
            {id:"monthly", name:t.monthly, price:t.monthlyPrice, sub:t.monthlySub, color:C.text},
            {id:"yearly",  name:t.yearly,  price:t.yearlyPrice,  sub:t.yearlySub,  color:C.gold, badge:true},
          ].map(p => (
            <div key={p.id} onClick={() => setPlan(p.id)} style={{flex:1, padding:"16px", borderRadius:18, border:`2px solid ${plan===p.id?p.color:C.border}`, background:plan===p.id?`${p.color}12`:C.surface, cursor:"pointer"}}>
              <div style={{display:"flex", alignItems:"center", gap:5, marginBottom:4}}>
                <div style={{fontSize:14, fontWeight:700, color:C.text}}>{p.name}</div>
                {p.badge && <span style={{fontSize:9, background:C.gold, color:"#000", padding:"2px 5px", borderRadius:5, fontWeight:700}}>-40%</span>}
              </div>
              <div style={{fontSize:22, fontWeight:800, color:p.color}}>{p.price}</div>
              <div style={{fontSize:11, color:C.muted}}>{p.sub}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16, fontSize:12, color:C.muted, lineHeight:1.9}}>
          {t.proFeatures.join(" · ")}
        </div>
        <button style={{width:"100%", padding:"16px", borderRadius:16, background:C.gold, color:"#000", fontWeight:800, fontSize:16, border:"none", cursor:"pointer"}} onClick={onClose}>
          {plan === "yearly" ? t.startYearly : t.startMonthly}
        </button>
        <div style={{textAlign:"center", marginTop:12, fontSize:11, color:C.muted}}>{t.trialNote}</div>
      </div>
    </div>
  );
}

// ─── PROFILE FORM ─────────────────────────────────────────────────────────────
function ProfileForm({profile, setProfile, onSave, lang}) {
  const t = T[lang] || T.fr;
  const [local, setLocal] = useState(profile || {height:"", weight:"", gender:"neutral", goals:[]});

  const toggleGoal = (id) => {
    setLocal(p => ({...p, goals: p.goals.includes(id) ? p.goals.filter(g => g !== id) : [...p.goals, id]}));
  };

  const bmi = calcBMI(parseFloat(local.weight), parseFloat(local.height));
  const bmiCat = getBMICategory(parseFloat(bmi), t);
  const idealW = getIdealWeight(parseFloat(local.height), local.gender);

  return (
    <div style={{padding:"52px 24px 100px"}}>
      <div style={{fontSize:22, fontWeight:700, marginBottom:6, color:C.text}}>
        {lang==="en"?"My":"Mon"} <span style={{color:C.accent}}>{lang==="en"?"Profile":lang==="es"?"Perfil":"Profil"}</span>
      </div>
      <div style={{fontSize:13, color:C.muted, marginBottom:24}}>
        {lang==="en"?"This data personalizes your tracking and VitaAI advice":lang==="es"?"Estos datos personalizan tu seguimiento y los consejos de VitaAI":"Ces données personnalisent ton suivi et les conseils de VitaAI"}
      </div>

      <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:12}}>
        {lang==="en"?"Measurements":lang==="es"?"Medidas":"Mensurations"}
      </div>
      <div style={{display:"flex", gap:12, marginBottom:16}}>
        {[
          {label:t.height, key:"height", placeholder:"175"},
          {label:t.weight, key:"weight", placeholder:"70"},
        ].map(f => (
          <div key={f.key} style={{flex:1}}>
            <div style={{fontSize:12, color:C.muted, marginBottom:6}}>{f.label}</div>
            <input type="number" placeholder={f.placeholder} value={local[f.key]}
              onChange={e => setLocal(p => ({...p, [f.key]:e.target.value}))}
              style={{width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px", color:C.text, fontSize:15, fontWeight:600, outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif"}}
            />
          </div>
        ))}
      </div>

      <div style={{fontSize:12, color:C.muted, marginBottom:8}}>{t.gender}</div>
      <div style={{display:"flex", gap:8, marginBottom:20}}>
        {[
          {id:"homme", label:t.male},
          {id:"femme", label:t.female},
          {id:"neutral", label:t.neutral},
        ].map(g => (
          <div key={g.id} onClick={() => setLocal(p => ({...p, gender:g.id}))}
            style={{flex:1, padding:"10px", borderRadius:12, border:`2px solid ${local.gender===g.id?C.accent:C.border}`, background:local.gender===g.id?`${C.accent}18`:C.card, cursor:"pointer", textAlign:"center", fontSize:12, fontWeight:600, color:local.gender===g.id?C.accent:C.muted}}>
            {g.label}
          </div>
        ))}
      </div>

      {bmi && (
        <div style={{background:`linear-gradient(135deg,${bmiCat?.color}18,transparent)`, border:`1px solid ${bmiCat?.color}44`, borderRadius:16, padding:"14px 18px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <div style={{fontSize:12, color:C.muted, marginBottom:2}}>{t.myIMC}</div>
            <div style={{fontSize:26, fontWeight:800, color:bmiCat?.color}}>{bmi}</div>
            <div style={{fontSize:12, color:bmiCat?.color, fontWeight:600}}>{bmiCat?.label}</div>
          </div>
          {idealW && (
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:12, color:C.muted, marginBottom:2}}>{t.idealWeight}</div>
              <div style={{fontSize:20, fontWeight:700, color:C.text}}>{idealW} kg</div>
              <div style={{fontSize:11, color:C.muted}}>±5 kg</div>
            </div>
          )}
        </div>
      )}

      <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:12}}>{t.goals}</div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24}}>
        {GOAL_IDS.map(id => {
          const sel = local.goals.includes(id);
          return (
            <div key={id} onClick={() => toggleGoal(id)}
              style={{padding:"14px", borderRadius:16, border:`2px solid ${sel?C.accent:C.border}`, background:sel?`${C.accent}14`:C.card, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transform:sel?"scale(1.02)":"scale(1)", transition:"all 0.2s"}}>
              <div style={{fontSize:22}}>{GOAL_ICONS[id]}</div>
              <div style={{fontSize:12, fontWeight:600, color:sel?C.accent:C.muted, lineHeight:1.3}}>{t.goalLabels[id]}</div>
              {sel && <div style={{marginLeft:"auto", fontSize:14, color:C.accent}}>✓</div>}
            </div>
          );
        })}
      </div>

      <div style={{background:`linear-gradient(135deg,${C.coral}18,${C.gold}08)`, border:`2px solid ${C.coral}44`, borderRadius:16, padding:"14px 16px", marginBottom:24, display:"flex", gap:12, alignItems:"flex-start"}}>
        <div style={{fontSize:24, flexShrink:0}}>🥦</div>
        <div>
          <div style={{fontSize:13, fontWeight:700, color:C.coral, marginBottom:4}}>{t.nutritionWarning}</div>
          <div style={{fontSize:12, color:C.muted, lineHeight:1.6}}>{t.nutritionBottom()}</div>
        </div>
      </div>

      <button onClick={() => { setProfile(local); onSave(); }}
        style={{width:"100%", padding:"16px", borderRadius:16, background:C.accent, color:"#000", fontWeight:800, fontSize:16, border:"none", cursor:"pointer"}}>
        {t.saveProfile}
      </button>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({mood, setMood, pillars, habits, setHabits, xp, isPremium, streak, perfectDays, daysLeft, earnProgress, onPremium, notif, profile, lang, setTab}) {
  const t = T[lang] || T.fr;
  const hasProfile = profile?.height && profile?.weight;
  const moods = ["energized","calm","tired","stressed"];
  const moodLabels = {energized:t.energized, calm:t.calm, tired:t.tired, stressed:t.stressed};

  return (
    <div style={{position:"relative", zIndex:1}}>
      <div style={{padding:"52px 24px 20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <div style={{fontSize:22, fontWeight:700, letterSpacing:"-0.5px", color:C.text}}>
            Vita<span style={{color:C.accent}}>Zen</span>
          </div>
          <div style={{fontSize:12, color:C.muted, marginTop:2}}>
            {new Date().toLocaleDateString(t.dateLocale, {weekday:"long", day:"numeric", month:"long"})} · {xp} {t.xp}
          </div>
        </div>
        {isPremium
          ? <div style={{background:`${C.gold}22`, border:`1px solid ${C.gold}66`, color:C.gold, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20}}>{t.proActive}</div>
          : <div style={{background:C.border, color:C.muted, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer"}} onClick={onPremium}>{t.goPro}</div>
        }
      </div>

      {!hasProfile && (
        <div style={{margin:"0 24px 20px", background:`${C.gold}14`, border:`1px solid ${C.gold}55`, borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer"}} onClick={() => setTab("profile")}>
          <div style={{fontSize:24}}>👤</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13, fontWeight:700, color:C.gold}}>{t.completeProfile}</div>
            <div style={{fontSize:12, color:C.muted}}>{t.completeProfileSub}</div>
          </div>
          <div style={{color:C.gold}}>›</div>
        </div>
      )}

      <div style={{display:"flex", alignItems:"center", gap:8, padding:"0 24px 20px"}}>
        {t.days.map((d,i) => (
          <div key={i} style={{width:28, height:28, borderRadius:"50%", background:i<streak%7?C.accent:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, boxShadow:i<streak%7?`0 0 12px ${C.accent}66`:"none"}}>
            {i < streak%7 ? <span style={{fontSize:12}}>✓</span> : <span style={{fontSize:11, color:C.muted}}>{d}</span>}
          </div>
        ))}
        <div style={{marginLeft:"auto", fontSize:12, color:C.muted, fontWeight:500}}>🔥 {streak}j</div>
      </div>

      <div style={{padding:"0 24px 8px"}}>
        <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:14}}>{t.howAreYou}</div>
        <div style={{display:"flex", gap:10, marginBottom:24}}>
          {moods.map(m => (
            <div key={m} onClick={() => setMood(mood===m?null:m)}
              style={{flex:1, padding:"12px 0", borderRadius:16, border:mood===m?`2px solid ${MOOD_COLORS[m]}`:`2px solid ${C.border}`, background:mood===m?`${MOOD_COLORS[m]}18`:C.card, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, transform:mood===m?"scale(1.04)":"scale(1)", boxShadow:mood===m?`0 4px 20px ${MOOD_COLORS[m]}33`:"none", transition:"all 0.25s"}}>
              <div style={{fontSize:24}}>{MOOD_EMOJIS[m]}</div>
              <div style={{fontSize:10, fontWeight:600, color:mood===m?MOOD_COLORS[m]:C.muted}}>{moodLabels[m]}</div>
            </div>
          ))}
        </div>
      </div>

      <AICard mood={mood} habits={habits} streak={streak} isPremium={isPremium} profile={profile} lang={lang}/>
      {!isPremium && <EarnCard perfectDays={perfectDays} daysLeft={daysLeft} progress={earnProgress} habits={habits} lang={lang}/>}
      <NutritionSection isPremium={isPremium} profile={profile} lang={lang}/>

      <div style={{padding:"0 24px 8px"}}>
        <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:14}}>{t.pillars}</div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, padding:"0 24px 24px"}}>
        {PILLAR_IDS.map(p => (
          <div key={p} style={{background:C.card, borderRadius:20, padding:"18px 16px", border:`1px solid ${C.border}`, position:"relative", overflow:"hidden"}}>
            <div style={{position:"absolute", top:0, right:0, width:60, height:60, borderRadius:"50%", background:`${PILLAR_COLORS[p]}18`, filter:"blur(20px)"}}/>
            <div style={{fontSize:26, marginBottom:8}}>{PILLAR_ICONS[p]}</div>
            <div style={{fontSize:13, fontWeight:700, color:C.text, marginBottom:6}}>{t[p] || t.serenity}</div>
            <div style={{height:4, background:C.border, borderRadius:4, overflow:"hidden", marginBottom:6}}>
              <div style={{height:"100%", width:`${pillars[p]}%`, background:PILLAR_COLORS[p], borderRadius:4, transition:"width 0.8s"}}/>
            </div>
            <div style={{fontSize:11, color:PILLAR_COLORS[p], fontWeight:600}}>{pillars[p]}%</div>
          </div>
        ))}
      </div>

      <div style={{padding:"0 24px 100px"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
          <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase"}}>{t.habits}</div>
          <div style={{fontSize:12, fontWeight:700, color:habits.length>=HABITS_FOR_PERFECT?C.accent:C.muted}}>
            {habits.length}/5{habits.length>=HABITS_FOR_PERFECT?" 🎯":""}
          </div>
        </div>
        {[1,2,3,4,5].map(id => {
          const done = habits.includes(id);
          return (
            <div key={id} onClick={() => setHabits(done ? habits.filter(x=>x!==id) : [...habits,id])}
              style={{display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:done?`${C.accent}0D`:C.card, borderRadius:16, marginBottom:10, border:`1px solid ${done?C.accent+"44":C.border}`, cursor:"pointer", transition:"all 0.25s"}}>
              <div style={{width:24, height:24, borderRadius:"50%", border:`2px solid ${done?C.accent:C.border}`, background:done?C.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                {done && <span style={{fontSize:12, color:"#000", fontWeight:800}}>✓</span>}
              </div>
              <div style={{fontSize:20}}>{HABIT_ICONS[id]}</div>
              <div>
                <div style={{fontSize:14, fontWeight:600, color:done?C.muted:C.text, textDecoration:done?"line-through":"none"}}>{t.habitTitles[id]}</div>
                <div style={{fontSize:11, color:C.muted, marginTop:2}}>{t.habitTimes[id]}</div>
              </div>
              <div style={{marginLeft:"auto", fontSize:11, color:C.gold, fontWeight:700}}>{HABIT_XP[id]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STATS PAGE ───────────────────────────────────────────────────────────────
function StatsPage({habits, isPremium, onPremium, perfectDays, earnProgress, profile, lang}) {
  const t = T[lang] || T.fr;
  const score = Math.round((WEEK_DATA.reduce((a,b)=>a+b,0) / (WEEK_DATA.length*100)) * 100);
  const bmi = calcBMI(profile?.weight, profile?.height);
  const bmiCat = getBMICategory(parseFloat(bmi), t);
  const achiev = [
    {icon:"🔥",name:"7j de suite",u:true},{icon:"💧",name:"Hydraté x30",u:true},
    {icon:"🧘",name:"Zen Master",u:true},{icon:"🏃",name:"100km",u:false},
    {icon:"⭐",name:"Perfect week",u:false},{icon:"🌙",name:"Sleep King",u:perfectDays>=7},
  ];

  return (
    <div style={{padding:"52px 24px 100px", position:"relative", zIndex:1}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
        <div style={{fontSize:22, fontWeight:700, color:C.text}}>{t.myStats.split(" ")[0]} <span style={{color:C.accent}}>{t.myStats.split(" ")[1]}</span></div>
        {!isPremium && <div style={{background:`${C.gold}22`, border:`1px solid ${C.gold}66`, color:C.gold, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, cursor:"pointer"}} onClick={onPremium}>✦ Pro</div>}
      </div>

      <div style={{background:`linear-gradient(135deg,${C.accent}22,${C.sky}12)`, border:`1px solid ${C.accent}44`, borderRadius:20, padding:"20px", marginBottom:14}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div>
            <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:6}}>{t.thisWeek}</div>
            <div style={{fontSize:28, fontWeight:800, color:C.accent}}>{score}%</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:36}}>📈</div>
            <div style={{fontSize:11, color:C.accent, fontWeight:600}}>+12%</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"flex-end", gap:6, height:52}}>
          {WEEK_DATA.map((v,i) => (
            <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
              <div style={{width:"100%", height:`${v}%`, background:i===6?C.accent:`${C.accent}44`, borderRadius:"4px 4px 0 0", minHeight:4}}/>
              <div style={{fontSize:10, color:i===6?C.accent:C.muted, fontWeight:i===6?700:400}}>{t.days[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {bmi && (
        <div style={{background:`linear-gradient(135deg,${bmiCat?.color}18,transparent)`, border:`1px solid ${bmiCat?.color}44`, borderRadius:20, padding:"18px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <div style={{fontSize:13, color:C.muted, marginBottom:4}}>{t.myIMC}</div>
            <div style={{fontSize:28, fontWeight:800, color:bmiCat?.color}}>{bmi}</div>
            <div style={{fontSize:12, color:bmiCat?.color, fontWeight:600}}>{bmiCat?.label}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12, color:C.muted, marginBottom:4}}>{profile?.height} cm · {profile?.weight} kg</div>
            <div style={{fontSize:36}}>📊</div>
          </div>
        </div>
      )}

      <div style={{background:C.card, borderRadius:20, padding:"20px", border:`1px solid ${C.border}`, marginBottom:14}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <div>
            <div style={{fontSize:13, color:C.muted, marginBottom:4}}>{t.today}</div>
            <div style={{fontSize:28, fontWeight:800, color:C.gold}}>{habits.length} / 5</div>
          </div>
          <div style={{fontSize:36}}>✅</div>
        </div>
        <div style={{display:"flex", gap:8}}>
          {[1,2,3,4,5].map(id => <div key={id} style={{flex:1, height:6, borderRadius:3, background:habits.includes(id)?C.gold:C.border}}/>)}
        </div>
      </div>

      <div style={{background:`linear-gradient(135deg,${C.gold}12,transparent)`, border:`1px solid ${C.gold}33`, borderRadius:20, padding:"18px", marginBottom:14, display:"flex", alignItems:"center", gap:14}}>
        <Ring pct={earnProgress} color={C.gold} size={64} stroke={5}>
          <div style={{fontSize:16, fontWeight:800, color:C.gold}}>{perfectDays}</div>
          <div style={{fontSize:9, color:C.muted}}>/{EARN_DAYS}</div>
        </Ring>
        <div>
          <div style={{fontSize:14, fontWeight:700, color:C.text, marginBottom:4}}>{t.towardsPremium}</div>
          <div style={{fontSize:13, color:C.muted}}>{t.perfectDays}</div>
        </div>
      </div>

      <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:14}}>{t.achievements}</div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10}}>
        {achiev.map((a,i) => (
          <div key={i} style={{background:C.card, borderRadius:16, padding:"14px 10px", textAlign:"center", border:`1px solid ${a.u?C.gold+"44":C.border}`, opacity:a.u?1:0.4}}>
            <div style={{fontSize:26, marginBottom:6}}>{a.icon}</div>
            <div style={{fontSize:10, color:C.muted, fontWeight:600}}>{a.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({xp, habits, isPremium, streak, onPremium, notif, perfectDays, earnProgress, daysLeft, profile, setProfile, onSaved, lang, setLang, onLogout, userEmail}) {
  const t = T[lang] || T.fr;
  const [editMode, setEditMode] = useState(!profile?.height);
  const level = Math.floor(xp/100) + 1;
  const prog = xp % 100;
  const bmi = calcBMI(profile?.weight, profile?.height);
  const bmiCat = getBMICategory(parseFloat(bmi), t);

  if (editMode) {
    return <ProfileForm profile={profile} setProfile={setProfile} onSave={() => { setEditMode(false); onSaved(); }} lang={lang}/>;
  }

  return (
    <div style={{padding:"52px 24px 100px", position:"relative", zIndex:1}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24}}>
        <div style={{fontSize:22, fontWeight:700, color:C.text}}>
          {lang==="en"?"My":"Mon"} <span style={{color:C.accent}}>{lang==="en"?"Profile":lang==="es"?"Perfil":"Profil"}</span>
        </div>
        <button onClick={() => setEditMode(true)} style={{background:C.card, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:10, cursor:"pointer"}}>
          {t.editProfile}
        </button>
      </div>

      {/* Sélecteur de langue */}
      <div style={{background:C.card, borderRadius:16, padding:"14px 16px", border:`1px solid ${C.border}`, marginBottom:16}}>
        <div style={{fontSize:13, fontWeight:600, color:C.text, marginBottom:10}}>🌍 {t.language}</div>
        <div style={{display:"flex", gap:8}}>
          {[{id:"fr",flag:"🇫🇷",label:"Français"},{id:"en",flag:"🇬🇧",label:"English"},{id:"es",flag:"🇪🇸",label:"Español"}].map(l => (
            <div key={l.id} onClick={() => setLang(l.id)}
              style={{flex:1, padding:"10px 6px", borderRadius:12, border:`2px solid ${lang===l.id?C.accent:C.border}`, background:lang===l.id?`${C.accent}18`:C.surface, cursor:"pointer", textAlign:"center"}}>
              <div style={{fontSize:20}}>{l.flag}</div>
              <div style={{fontSize:11, fontWeight:600, color:lang===l.id?C.accent:C.muted, marginTop:4}}>{l.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center", marginBottom:24}}>
        <div style={{width:80, height:80, borderRadius:"50%", margin:"0 auto 12px", background:`linear-gradient(135deg,${C.lavender},${C.accent})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, boxShadow:`0 0 30px ${C.accent}44`}}>🧘</div>
        <div style={{fontSize:18, fontWeight:800, color:C.text}}>{lang==="en"?"Zen User":lang==="es"?"Usuario Zen":"Utilisateur Zen"}</div>
        <div style={{fontSize:13, color:C.accent, fontWeight:600, marginTop:4}}>{t.level} {level} · {xp} {t.xp} {isPremium?"✦":""}</div>
        {userEmail && <div style={{fontSize:12, color:C.muted, marginTop:4}}>📧 {userEmail}</div>}
        <div style={{width:160, height:6, background:C.border, borderRadius:3, margin:"10px auto 0"}}>
          <div style={{width:`${prog}%`, height:"100%", background:C.accent, borderRadius:3}}/>
        </div>
      </div>

      {profile?.height && (
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16}}>
          {[
            {label:t.height.split(" ")[0], value:`${profile.height} cm`, color:C.sky},
            {label:t.weight.split(" ")[0], value:`${profile.weight} kg`, color:C.lavender},
            ...(bmi ? [{label:t.myIMC, value:bmi, color:bmiCat?.color, sub:bmiCat?.label}] : []),
            ...(profile?.height ? [{label:t.idealWeight, value:`${getIdealWeight(profile.height,profile.gender)} kg`, color:C.gold}] : []),
          ].map((s,i) => (
            <div key={i} style={{background:s.sub?`${s.color}14`:C.card, borderRadius:18, padding:"14px", border:`1px solid ${s.sub?s.color+"44":C.border}`, textAlign:"center"}}>
              <div style={{fontSize:20, fontWeight:800, color:s.color}}>{s.value}</div>
              {s.sub && <div style={{fontSize:10, color:s.color, fontWeight:600, marginTop:2}}>{s.sub}</div>}
              <div style={{fontSize:10, color:C.muted, fontWeight:600, marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {profile?.goals?.length > 0 && (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:13, color:C.muted, fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:10}}>{t.goals}</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
            {profile.goals.map(gid => (
              <div key={gid} style={{background:`${C.accent}18`, border:`1px solid ${C.accent}44`, borderRadius:20, padding:"6px 12px", display:"flex", alignItems:"center", gap:6}}>
                <span style={{fontSize:14}}>{GOAL_ICONS[gid]}</span>
                <span style={{fontSize:12, color:C.accent, fontWeight:600}}>{t.goalLabels[gid]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{display:"flex", gap:12, marginBottom:16}}>
        {[
          {l:t.streak, v:`${streak}🔥`, c:C.gold},
          {l:t.habitsDone, v:`${habits.length}✓`, c:C.accent},
          {l:lang==="en"?"Perfect days":lang==="es"?"Días perfectos":"Jours parfaits", v:`${perfectDays}`, c:C.lavender},
        ].map((s,i) => (
          <div key={i} style={{flex:1, background:C.card, borderRadius:18, padding:"14px 8px", textAlign:"center", border:`1px solid ${C.border}`}}>
            <div style={{fontSize:18, fontWeight:800, color:s.c}}>{s.v}</div>
            <div style={{fontSize:10, color:C.muted, fontWeight:600, marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>

      <NotifPanel perm={notif.perm} requestPerm={notif.requestPerm} send={notif.send} streak={streak} lang={lang}/>

      {isPremium ? (
        <div style={{background:`linear-gradient(135deg,${C.gold}18,${C.coral}08)`, border:`1px solid ${C.gold}44`, borderRadius:20, padding:"18px", marginBottom:14}}>
          <div style={{fontSize:17, fontWeight:800, color:C.gold, marginBottom:6}}>✦ {t.proActive}</div>
          <div style={{fontSize:13, color:C.muted, lineHeight:1.6}}>{t.proRenew}<br/>{t.renewIn}</div>
        </div>
      ) : (
        <div style={{background:`linear-gradient(135deg,${C.gold}12,${C.coral}08)`, border:`1px solid ${C.gold}44`, borderRadius:20, padding:"18px", marginBottom:14}}>
          <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:14}}>
            <Ring pct={earnProgress} color={C.gold} size={52} stroke={4}>
              <div style={{fontSize:13, fontWeight:800, color:C.gold}}>{perfectDays}</div>
            </Ring>
            <div>
              <div style={{fontSize:15, fontWeight:800, color:C.text, marginBottom:4}}>{t.goPro} ✨</div>
              <div style={{fontSize:12, color:C.muted, lineHeight:1.5}}>
                {daysLeft > 0 ? t.moreLeft(daysLeft) : t.activateFreeNow}
              </div>
            </div>
          </div>
          <button style={{width:"100%", padding:"11px", borderRadius:12, background:C.gold, color:"#000", fontWeight:800, fontSize:14, border:"none", cursor:"pointer"}} onClick={onPremium}>
            {t.seePlans}
          </button>
          <div style={{textAlign:"center", marginTop:8, fontSize:11, color:C.accent, fontWeight:600}}>{t.autoEarn(EARN_DAYS)}</div>
        </div>
      )}

      {[t.darkMode, t.exportData, t.feedback, t.help].map((item,i) => (
        <div key={i} style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:C.card, borderRadius:14, marginBottom:8, border:`1px solid ${C.border}`, cursor:"pointer"}}>
          <div style={{fontSize:14, fontWeight:500}}>{item}</div>
          <div style={{color:C.muted}}>›</div>
        </div>
      ))}

      {/* Bouton déconnexion */}
      <button onClick={onLogout}
        style={{width:"100%", padding:"14px", borderRadius:14, background:"transparent", border:`1px solid ${C.coral}55`, color:C.coral, fontWeight:700, fontSize:14, cursor:"pointer", marginTop:8}}>
        🚪 {lang==="en"?"Log out":lang==="es"?"Cerrar sesión":"Se déconnecter"}
      </button>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function VitaZen({ session }) {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("fr");
  const [mood, setMood] = useState(null);
  const [habits, setHabits] = useState([1]);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showEarned, setShowEarned] = useState(false);
  const [profile, setProfile] = useState({height:"", weight:"", gender:"neutral", goals:[]});
  const [profileLoading, setProfileLoading] = useState(true);
  const STREAK = 18;
  const t = T[lang] || T.fr;

  // Charge le profil depuis Supabase au démarrage
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setProfile({
          height: data.height || "",
          weight: data.weight || "",
          gender: data.gender || "neutral",
          goals: data.goals || [],
        });
        if (data.lang) setLang(data.lang);
      }
      setProfileLoading(false);
    };
    loadProfile();
  }, [session]);

  // Sauvegarde le profil dans Supabase
  const saveProfile = async (newProfile) => {
    setProfile(newProfile);
    if (!session?.user) return;
    await supabase.from("profiles").upsert({
      id: session.user.id,
      height: newProfile.height,
      weight: newProfile.weight,
      gender: newProfile.gender,
      goals: newProfile.goals,
      lang: lang,
      updated_at: new Date().toISOString(),
    });
  };

  // Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const xp = habits.length * 20 + 140;
  const pillars = {
    sleep:       habits.includes(5) ? 80 : 55,
    hydration:   habits.includes(1) ? 90 : 40,
    movement:    habits.includes(3) ? 70 : 35,
    serenity:    habits.includes(2) ? 85 : 50,
  };

  const perfectDays = STREAK;
  const daysLeft = Math.max(0, EARN_DAYS - perfectDays);
  const earnProgress = Math.min(100, (perfectDays / EARN_DAYS) * 100);
  const notif = useNotif();

  useEffect(() => {
    const timer = setTimeout(() => {
      notif.send({emoji:"🔥", title:t.streakToast(STREAK, daysLeft).split("!")[0]+"!", body:""});
    }, 1800);
    return () => clearTimeout(timer);
  }, [lang]);

  useEffect(() => {
    if (perfectDays >= EARN_DAYS && !isPremium) setShowEarned(true);
  }, []);

  if (profileLoading) {
    return (
      <div style={{background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16}}>
        <div style={{fontSize:48}}>🌿</div>
        <div style={{color:C.accent, fontSize:22, fontWeight:700, fontFamily:"sans-serif"}}>Vita<span style={{color:C.text}}>Zen</span></div>
        <div style={{color:C.muted, fontSize:14, fontFamily:"sans-serif"}}>Chargement de ton profil...</div>
      </div>
    );
  }

  const navItems = [
    {id:"home",  icon:"🏠", label:t.home},
    {id:"stats", icon:"📊", label:t.stats},
    {id:"profile",icon:"👤",label:t.profile},
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", color:C.text, maxWidth:420, margin:"0 auto", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0}}>
          <div style={{position:"absolute", top:-80, left:-60, width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle,${C.lavender}18 0%,transparent 70%)`}}/>
          <div style={{position:"absolute", top:300, right:-80, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle,${C.accent}14 0%,transparent 70%)`}}/>
        </div>

        <Toast msg={notif.toast}/>

        <div style={{overflowY:"auto", height:"100vh"}}>
          {tab === "home"    && <HomePage    mood={mood} setMood={setMood} pillars={pillars} habits={habits} setHabits={setHabits} xp={xp} isPremium={isPremium} streak={STREAK} perfectDays={perfectDays} daysLeft={daysLeft} earnProgress={earnProgress} onPremium={() => setShowPremium(true)} notif={notif} profile={profile} lang={lang} setTab={setTab}/>}
          {tab === "stats"   && <StatsPage   habits={habits} isPremium={isPremium} onPremium={() => setShowPremium(true)} perfectDays={perfectDays} earnProgress={earnProgress} profile={profile} lang={lang}/>}
          {tab === "profile" && <ProfilePage xp={xp} habits={habits} isPremium={isPremium} streak={STREAK} onPremium={() => setShowPremium(true)} notif={notif} perfectDays={perfectDays} earnProgress={earnProgress} daysLeft={daysLeft} profile={profile} setProfile={saveProfile} onSaved={() => notif.showToast({emoji:"✅", title:t.profileSaved, body:t.profileSavedBody})} lang={lang} setLang={setLang} onLogout={handleLogout} userEmail={session?.user?.email}/>}
        </div>

        <div style={{position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:`${C.surface}EE`, backdropFilter:"blur(20px)", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"12px 0 20px", zIndex:100}}>
          {navItems.map(n => (
            <div key={n.id} onClick={() => setTab(n.id)} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", opacity:tab===n.id?1:0.4, transition:"opacity 0.2s"}}>
              <div style={{fontSize:22}}>{n.icon}</div>
              <div style={{fontSize:10, fontWeight:tab===n.id?700:500, color:tab===n.id?C.accent:C.muted}}>{n.label}</div>
            </div>
          ))}
        </div>

        {showPremium && <PremiumModal onClose={() => setShowPremium(false)} lang={lang}/>}
        {showEarned  && <EarnedModal  onClose={() => setShowEarned(false)} lang={lang} onActivate={() => { setIsPremium(true); setShowEarned(false); notif.showToast({emoji:"✨", title:t.proActivated, body:t.proActivatedBody}); }}/>}
      </div>
    </>
  );
}
