export const EARN_DAYS         = 30;
export const HABITS_FOR_PERFECT = 4;
export const STEPS_FOR_PERFECT  = 5000;
export const STEPS_GOAL         = 10000;
export const XP_PER_HABIT       = { 1: 10, 2: 20, 3: 30, 4: 15, 5: 25 };

export const HABIT_ICONS = { 1:"💧", 2:"🧘", 3:"🚶", 4:"📓", 5:"🌙" };

export const MOOD_IDS    = ["energized", "calm", "tired", "stressed"];
export const MOOD_EMOJIS = { energized:"⚡", calm:"🌊", tired:"😴", stressed:"🌪️" };
export const MOOD_COLORS = {
  energized: "#F5C842",
  calm:      "#5BC4FF",
  tired:     "#B69EFF",
  stressed:  "#FF6B6B",
};

export const PILLAR_IDS    = ["sleep", "hydration", "movement", "serenity"];
export const PILLAR_ICONS  = { sleep:"🌙", hydration:"💧", movement:"🏃", serenity:"🧘" };
export const PILLAR_COLORS = {
  sleep:     "#B69EFF",
  hydration: "#5BC4FF",
  movement:  "#FF6B6B",
  serenity:  "#7EE8A2",
};

export const GOAL_IDS   = ["weightloss","muscle","endurance","sleep","stress","energy"];
export const GOAL_ICONS = {
  weightloss:"⚖️", muscle:"💪", endurance:"🏃",
  sleep:"🌙",      stress:"🧘", energy:"⚡",
};

export const NUTRITION_ADS = [
  {
    icon:"🥗", brand:"NutriBox",
    text:{ fr:"Livraison repas équilibrés", en:"Balanced meal delivery", es:"Entrega de comidas equilibradas" },
    sub:"–30% • Code VITAZEN",
    cta:{ fr:"Voir", en:"View", es:"Ver" },
  },
  {
    icon:"🧃", brand:"FreshMeal",
    text:{ fr:"Meal prep santé clé en main", en:"Ready-made healthy meal prep", es:"Meal prep saludable" },
    sub:"7 repas livrés frais",
    cta:{ fr:"Commander", en:"Order", es:"Pedir" },
  },
  {
    icon:"🌾", brand:"GreenPlate",
    text:{ fr:"Menus végétaux personnalisés", en:"Personalized plant-based menus", es:"Menús vegetales personalizados" },
    sub:"Adapté à ton IMC",
    cta:{ fr:"Essayer", en:"Try", es:"Probar" },
  },
];
