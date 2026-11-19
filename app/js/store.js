// Progress store: earned trophies live in localStorage, export to a file, import back.
// Demo progress (13 of 55) is kept in memory only, so a screenshot scene never
// overwrites a real player's saved progress.
export const STORAGE_KEY = 'leonida-ledger-progress-v1';

// The demo set shown in the ?shot= scenes: 13 early, plausible trophies, 24%.
export const DEMO_EARNED_IDS = [2, 16, 20, 21, 33, 36, 37, 44, 45, 46, 49, 50, 51];

export function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    return new Set(Array.isArray(names) ? names.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveProgress(earnedNames) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedNames]));
  } catch {
    // Storage full or unavailable: progress still works for this session.
  }
}

export function clearSavedProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

export function exportProgressFile(earnedNames) {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earnedNames] }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-ledger-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parseProgressImport(text, knownNames) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  const known = new Set(knownNames);
  const kept = names.filter((n) => typeof n === 'string' && known.has(n));
  return new Set(kept);
}

export function demoEarnedSet(trophies) {
  const byId = new Map(trophies.map((t) => [t.id, t.name]));
  return new Set(DEMO_EARNED_IDS.map((id) => byId.get(id)).filter(Boolean));
}
