// Leonida Ledger boot: load the trophy data, wire the tracker, filters, spoiler
// shield and roadmap, then render. Progress saves to localStorage; demo scenes
// from shots.js run in memory and never overwrite saved progress.
import { loadSavedProgress, saveProgress, clearSavedProgress, exportProgressFile, parseProgressImport } from './store.js';
import { renderChecklist, renderGuidePanel, renderRoadmap, GRADE_LABELS } from './render.js';
import { readShotScene, applyShotScene } from './shots.js';

const state = {
  trophies: [],
  earned: new Set(),
  kind: 'all',
  grade: 'all',
  query: '',
  spoiler: false,
  view: 'checklist',
  selectedId: null,
  demo: false,
};

const els = {
  earnedCount: document.getElementById('earnedCount'),
  pctLine: document.getElementById('pctLine'),
  barFill: document.getElementById('barFill'),
  gradeCounts: document.getElementById('gradeCounts'),
  search: document.getElementById('search'),
  grade: document.getElementById('grade'),
  spoiler: document.getElementById('spoiler'),
  kindChips: document.getElementById('kindChips'),
  list: document.getElementById('trophyList'),
  empty: document.getElementById('emptyNote'),
  showing: document.getElementById('showingLine'),
  guide: document.getElementById('guidePanel'),
  listCol: document.getElementById('listCol'),
  guideCol: document.getElementById('guideCol'),
  roadmapSection: document.getElementById('roadmapSection'),
  stages: document.getElementById('stages'),
  viewChecklist: document.getElementById('viewChecklist'),
  viewRoadmap: document.getElementById('viewRoadmap'),
  exportBtn: document.getElementById('exportBtn'),
  importFile: document.getElementById('importFile'),
  resetBtn: document.getElementById('resetBtn'),
};

function selectedTrophy() {
  return state.trophies.find((t) => t.id === state.selectedId) || null;
}

function persist() {
  if (!state.demo) saveProgress(state.earned);
}

function renderProgress() {
  const total = state.trophies.length;
  const earned = state.earned.size;
  els.earnedCount.textContent = String(earned);
  const pct = total ? Math.round((earned / total) * 100) : 0;
  els.pctLine.textContent = `${pct}% to platinum`;
  els.barFill.style.width = `${pct}%`;
  const counts = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const ofGrade = state.trophies.filter((t) => t.grade === g);
      const got = ofGrade.filter((t) => state.earned.has(t.name)).length;
      return `${got}/${ofGrade.length} ${GRADE_LABELS[g].toLowerCase()}`;
    })
    .join(' · ');
  els.gradeCounts.textContent = counts;
}

function renderAll() {
  renderProgress();
  renderChecklist(els.list, els.empty, els.showing, state.trophies, state, {
    onToggle: (trophy, checked) => {
      if (checked) state.earned.add(trophy.name);
      else state.earned.delete(trophy.name);
      persist();
      renderAll();
    },
    onSelect: (id) => {
      state.selectedId = id;
      renderAll();
      els.guide.scrollIntoView({ block: 'nearest' });
    },
  });
  renderGuidePanel(els.guide, selectedTrophy(), state.earned, state.spoiler);
  renderRoadmap(els.stages, state.trophies, state.earned);
  const roadmapOn = state.view === 'roadmap';
  els.roadmapSection.hidden = !roadmapOn;
  els.listCol.hidden = roadmapOn;
  els.guideCol.hidden = roadmapOn;
  els.viewChecklist.classList.toggle('active', !roadmapOn);
  els.viewRoadmap.classList.toggle('active', roadmapOn);
}

function syncControls() {
  els.search.value = state.query;
  els.grade.value = state.grade;
  els.spoiler.checked = state.spoiler;
  for (const chip of els.kindChips.querySelectorAll('.chip')) {
    chip.classList.toggle('active', chip.dataset.kind === state.kind);
  }
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const doc = await response.json();
  state.trophies = doc.trophies;
  state.earned = loadSavedProgress();
  const shotInfo = readShotScene();
  applyShotScene(state, state.trophies, shotInfo);

  els.search.addEventListener('input', () => {
    state.query = els.search.value;
    renderAll();
  });
  els.grade.addEventListener('change', () => {
    state.grade = els.grade.value;
    renderAll();
  });
  els.spoiler.addEventListener('change', () => {
    state.spoiler = els.spoiler.checked;
    renderAll();
  });
  els.kindChips.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    state.kind = chip.dataset.kind;
    syncControls();
    renderAll();
  });
  els.viewChecklist.addEventListener('click', () => {
    state.view = 'checklist';
    renderAll();
  });
  els.viewRoadmap.addEventListener('click', () => {
    state.view = 'roadmap';
    renderAll();
  });
  els.exportBtn.addEventListener('click', () => exportProgressFile(state.earned));
  els.importFile.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const next = parseProgressImport(await file.text(), state.trophies.map((t) => t.name));
      state.earned = next;
      state.demo = false;
      persist();
      renderAll();
    } catch {
      els.empty.hidden = false;
      els.empty.textContent = 'That file is not a Leonida Ledger progress export. Nothing was changed.';
    }
    event.target.value = '';
  });
  els.resetBtn.addEventListener('click', () => {
    state.earned = new Set();
    state.demo = false;
    clearSavedProgress();
    renderAll();
  });

  syncControls();
  renderAll();
}

boot();
