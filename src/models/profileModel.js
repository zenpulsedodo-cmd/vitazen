import { supabase } from "../supabase.js";

export function calcBMI(weight, height) {
  if (!weight || !height) return null;
  return (weight / ((height / 100) ** 2)).toFixed(1);
}

export function getBMICategory(bmi, imcLabels) {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: imcLabels.u, color: "#5BC4FF" };
  if (bmi < 25)   return { label: imcLabels.n, color: "#7EE8A2" };
  if (bmi < 30)   return { label: imcLabels.o, color: "#F5C842" };
  return           { label: imcLabels.ob,       color: "#FF6B6B" };
}

export function getIdealWeight(height, gender) {
  if (!height) return null;
  if (gender === "homme") return Math.round(height - 100 - (height - 150) / 4);
  if (gender === "femme") return Math.round(height - 100 - (height - 150) / 2.5);
  return Math.round(height - 100 - (height - 150) / 3.5);
}

export const defaultProfile = {
  height: "",
  weight: "",
  gender: "neutral",
  goals: [],
};

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function saveProfile(userId, profile, lang) {
  const { error } = await supabase.from("profiles").upsert({
    id:         userId,
    height:     profile.height,
    weight:     profile.weight,
    gender:     profile.gender,
    goals:      profile.goals,
    lang:       lang,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

export async function setPremium(userId) {
  await supabase.from("profiles").upsert({
    id:         userId,
    is_premium: true,
    updated_at: new Date().toISOString(),
  });
}
