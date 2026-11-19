// Demo scenes for the screenshots. Each ?shot= value sets one fixed view so the
// same address always renders the same screen: cover, roadmap, tracker or guide.
// Scenes run on demo progress (13 of 55, in memory only) and never touch saved progress.
import { demoEarnedSet } from './store.js';

export const SHOT_SCENES = {
  cover: { view: 'checklist', kind: 'all', grade: 'all', spoiler: false, selectId: 28 },
  roadmap: { view: 'roadmap', kind: 'all', grade: 'all', spoiler: false, selectId: null },
  tracker: { view: 'checklist', kind: 'missable', grade: 'all', spoiler: true, selectId: 28 },
  guide: { view: 'checklist', kind: 'all', grade: 'all', spoiler: false, selectId: 17 },
};

export function readShotScene() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const demo = params.get('demo') === '1' || (shot !== null && shot in SHOT_SCENES);
  const scene = SHOT_SCENES[shot] || null;
  const trophyId = params.get('trophy');
  const kind = params.get('kind');
  return { shot, demo, scene, trophyId: trophyId ? Number(trophyId) : null, kind };
}

export function applyShotScene(state, trophies, shotInfo) {
  if (shotInfo.demo) {
    state.demo = true;
    state.earned = demoEarnedSet(trophies);
  }
  if (shotInfo.scene) {
    state.view = shotInfo.scene.view;
    state.kind = shotInfo.scene.kind;
    state.grade = shotInfo.scene.grade;
    state.spoiler = shotInfo.scene.spoiler;
    state.selectedId = shotInfo.scene.selectId;
  }
  if (shotInfo.trophyId) state.selectedId = shotInfo.trophyId;
  if (shotInfo.kind) state.kind = shotInfo.kind;
}
