import { HABITS_FOR_PERFECT, STEPS_FOR_PERFECT } from "../constants/config.js";
import { todayStr } from "./dailyLogModel.js";

function isPerfectLog(log) {
  return (
    log &&
    (log.habits || []).length >= HABITS_FOR_PERFECT &&
    (log.steps  || 0)        >= STEPS_FOR_PERFECT
  );
}

function buildLogMap(logs) {
  const map = {};
  logs.forEach((l) => { map[l.date] = l; });
  return map;
}

function offsetDate(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/** Calcule le streak courant (jours consécutifs parfaits jusqu'à aujourd'hui inclus) */
export function computeStreak(logs) {
  const map  = buildLogMap(logs);
  const today = todayStr();
  let streak  = 0;

  for (let i = 0; i <= 365; i++) {
    const ds  = offsetDate(today, -i);
    const log = map[ds];
    if (isPerfectLog(log)) {
      streak++;
    } else if (ds !== today) {
      break; // on permet un aujourd'hui encore incomplet
    }
  }
  return streak;
}

/** Calcule le nombre de jours parfaits consécutifs (pour la progression vers Premium) */
export function computePerfectDays(logs) {
  const map   = buildLogMap(logs);
  const today = todayStr();
  let   count = 0;

  // Commence par vérifier aujourd'hui
  if (isPerfectLog(map[today])) count++;

  // Puis remonte dans le passé
  for (let i = 1; i <= 365; i++) {
    const ds = offsetDate(today, -i);
    if (isPerfectLog(map[ds])) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

/** Construit les données de la semaine (0-100%) pour le graphique */
export function computeWeekData(logs) {
  const map  = buildLogMap(logs);
  const today = new Date();
  const data  = [];

  for (let i = 6; i >= 0; i--) {
    const d  = new Date(today);
    d.setDate(d.getDate() - i);
    const ds  = d.toISOString().split("T")[0];
    const log = map[ds];
    const habPct  = log ? ((log.habits || []).length / 5) * 50 : 0;
    const stepPct = log ? (Math.min((log.steps || 0) / 10000, 1)) * 50 : 0;
    data.push(Math.round(habPct + stepPct));
  }
  return data;
}
