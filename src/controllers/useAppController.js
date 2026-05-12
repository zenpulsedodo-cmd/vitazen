import { useState, useEffect, useCallback } from "react";
import { fetchProfile, saveProfile, setPremium, defaultProfile } from "../models/profileModel.js";
import { fetchTodayLog, upsertLog, fetchRecentLogs } from "../models/dailyLogModel.js";
import { computeStreak, computePerfectDays, computeWeekData } from "../models/streakModel.js";
import { signOut } from "../models/authModel.js";
import { HABITS_FOR_PERFECT, STEPS_FOR_PERFECT, EARN_DAYS } from "../constants/config.js";

export function useAppController(session) {
  // ── UI state ───────────────────────────────────────────────────────────────
  const [tab,          setTab]          = useState("home");
  const [lang,         setLang]         = useState("fr");
  const [editProfile,  setEditProfile]  = useState(false);
  const [showPremium,  setShowPremium]  = useState(false);
  const [showEarned,   setShowEarned]   = useState(false);
  const [loading,      setLoading]      = useState(true);

  // ── User data ──────────────────────────────────────────────────────────────
  const [profile,      setProfile]      = useState(defaultProfile);
  const [isPremium,    setIsPremium]    = useState(false);
  const [mood,         setMoodState]    = useState(null);
  const [habits,       setHabitsState]  = useState([]);
  const [steps,        setStepsState]   = useState(0);

  // ── Analytics ──────────────────────────────────────────────────────────────
  const [streak,       setStreak]       = useState(0);
  const [perfectDays,  setPerfectDays]  = useState(0);
  const [weekData,     setWeekData]     = useState([0,0,0,0,0,0,0]);
  const [todayLogId,   setTodayLogId]   = useState(null);

  // ── Computed ───────────────────────────────────────────────────────────────
  const xp          = habits.length * 20 + Math.floor((steps || 0) / 200);
  const daysLeft    = Math.max(0, EARN_DAYS - perfectDays);
  const earnProgress= Math.min(100, (perfectDays / EARN_DAYS) * 100);
  const pillars     = {
    sleep:     habits.includes(5) ? Math.min(100, 60 + streak * 2) : 10,
    hydration: habits.includes(1) ? 90 : 10,
    movement:  habits.includes(3) || steps >= 5000 ? Math.min(100, Math.round((steps / 10000) * 100)) : 10,
    serenity:  habits.includes(2) ? 85 : 10,
  };

  // ── Load on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    const load = async () => {
      // Profile
      const pd = await fetchProfile(session.user.id);
      if (pd) {
        setProfile({ height: pd.height || "", weight: pd.weight || "", gender: pd.gender || "neutral", goals: pd.goals || [] });
        if (pd.lang)       setLang(pd.lang);
        if (pd.is_premium) setIsPremium(true);
      }
      // Today log
      const tl = await fetchTodayLog(session.user.id);
      if (tl) {
        setHabitsState(tl.habits || []);
        setStepsState(tl.steps   || 0);
        setMoodState(tl.mood     || null);
        setTodayLogId(tl.id);
      }
      // Recent logs → streak + week
      const logs = await fetchRecentLogs(session.user.id);
      setStreak(computeStreak(logs));
      setPerfectDays(computePerfectDays(logs));
      setWeekData(computeWeekData(logs));

      setLoading(false);
    };
    load();
  }, [session]);

  // ── Save log helper ────────────────────────────────────────────────────────
  const persistLog = useCallback(async (h, s, m) => {
    if (!session?.user) return;
    const { id, error } = await upsertLog(session.user.id, todayLogId, { habits: h, steps: s, mood: m });
    if (!error && !todayLogId && id) setTodayLogId(id);

    const isPerfect = h.length >= HABITS_FOR_PERFECT && s >= STEPS_FOR_PERFECT;
    if (isPerfect && !isPremium && perfectDays >= EARN_DAYS - 1) setShowEarned(true);
  }, [session, todayLogId, perfectDays, isPremium]);

  // ── Public actions ─────────────────────────────────────────────────────────
  const handleHabits = useCallback(async (h) => { setHabitsState(h); await persistLog(h, steps, mood); }, [steps, mood, persistLog]);
  const handleSteps  = useCallback(async (s) => { setStepsState(s);  await persistLog(habits, s, mood); }, [habits, mood, persistLog]);
  const handleMood   = useCallback((m) => { setMoodState(m); persistLog(habits, steps, m); }, [habits, steps, persistLog]);

  const handleSaveProfile = useCallback(async (p) => {
    setProfile(p);
    setEditProfile(false);
    await saveProfile(session.user.id, p, lang);
  }, [session, lang]);

  const handleActivatePremium = useCallback(async () => {
    setIsPremium(true);
    setShowEarned(false);
    await setPremium(session.user.id);
  }, [session]);

  const handleLogout = useCallback(() => signOut(), []);

  return {
    // UI
    tab, setTab, lang, setLang, editProfile, setEditProfile,
    showPremium, setShowPremium, showEarned, setShowEarned, loading,
    // Data
    profile, isPremium, mood, habits, steps,
    // Analytics
    streak, perfectDays, weekData, xp, daysLeft, earnProgress, pillars,
    // Actions
    handleHabits, handleSteps, handleMood,
    handleSaveProfile, handleActivatePremium, handleLogout,
    userEmail: session?.user?.email,
  };
}
