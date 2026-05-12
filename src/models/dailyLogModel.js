import { supabase } from "../supabase.js";

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export async function fetchTodayLog(userId) {
  const { data } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", todayStr())
    .single();
  return data || null;
}

export async function upsertLog(userId, logId, payload) {
  const data = {
    user_id:    userId,
    date:       todayStr(),
    habits:     payload.habits,
    steps:      payload.steps,
    mood:       payload.mood,
    updated_at: new Date().toISOString(),
  };

  if (logId) {
    const { error } = await supabase
      .from("daily_logs")
      .update(data)
      .eq("id", logId);
    return { id: logId, error };
  } else {
    const { data: inserted, error } = await supabase
      .from("daily_logs")
      .insert(data)
      .select()
      .single();
    return { id: inserted?.id || null, error };
  }
}

export async function fetchRecentLogs(userId, limit = 60) {
  const { data } = await supabase
    .from("daily_logs")
    .select("date, habits, steps")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);
  return data || [];
}
