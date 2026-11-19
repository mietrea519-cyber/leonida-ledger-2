// Renders the checklist rows and the guide panel from the trophy data and the
// current filter state. The spoiler shield masks story trophies until earned.
export const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
export const KIND_LABELS = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online', platinum: 'Platinum' };

function isMasked(trophy, spoilerOn, earnedNames) {
  return spoilerOn && trophy.kind === 'story' && !earnedNames.has(trophy.name);
}

function targetText(trophy, earnedNames) {
  if (trophy.target == null) return null;
  const done = earnedNames.has(trophy.name) ? trophy.target : 0;
  const unit = trophy.target_unit ? ` ${trophy.target_unit}` : '';
  return `${done} / ${trophy.target}${unit}`;
}

export function visibleTrophies(trophies, state) {
  const query = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kind === 'missable' && !t.missable) return false;
    if (state.kind === 'online') return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && t.kind !== state.kind) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (query && !(t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))) return false;
    return true;
  });
}

export function renderChecklist(listEl, emptyEl, showingEl, trophies, state, callbacks) {
  const shown = visibleTrophies(trophies, state);
  listEl.replaceChildren();
  if (state.kind === 'online') {
    emptyEl.hidden = false;
    emptyEl.textContent = 'No online trophies — all 55 are offline single-player, so this filter is empty by design.';
  } else if (shown.length === 0) {
    emptyEl.hidden = false;
    emptyEl.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
  } else {
    emptyEl.hidden = true;
  }
  showingEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${state.earned.size} earned`;
  for (const t of shown) {
    const masked = isMasked(t, state.spoiler, state.earned);
    const row = document.createElement('li');
    row.className = 'trophy-row' + (state.earned.has(t.name) ? ' earned' : '') + (state.selectedId === t.id ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('change', () => callbacks.onToggle(t, box.checked));
    const main = document.createElement('div');
    main.className = 'trophy-main';
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = masked ? 'Hidden trophy — earn it to reveal its name' : t.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = masked ? 'A story trophy. Turn the spoiler shield off, or earn it, to see its official description.' : t.description;
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const gradeTag = document.createElement('span');
    gradeTag.className = `tag grade-${t.grade}`;
    gradeTag.textContent = GRADE_LABELS[t.grade];
    meta.append(gradeTag);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag kind';
    kindTag.textContent = KIND_LABELS[t.kind] || t.kind;
    meta.append(kindTag);
    if (t.hidden) {
      const hiddenTag = document.createElement('span');
      hiddenTag.className = 'tag hidden';
      hiddenTag.textContent = 'Hidden on PSN';
      meta.append(hiddenTag);
    }
    if (t.missable) {
      const missTag = document.createElement('span');
      missTag.className = 'tag missable';
      missTag.textContent = 'Possibly missable';
      meta.append(missTag);
    }
    const target = targetText(t, state.earned);
    if (target) {
      const targetEl = document.createElement('span');
      targetEl.className = 'target';
      targetEl.textContent = target;
      meta.append(targetEl);
    }
    main.append(name, desc, meta);
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'open-btn';
    open.textContent = 'Guide';
    open.addEventListener('click', () => callbacks.onSelect(t.id));
    row.append(box, main, open);
    listEl.append(row);
  }
}

export function renderGuidePanel(panelEl, trophy, earnedNames, spoilerOn) {
  panelEl.replaceChildren();
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'guide-empty';
    p.textContent = 'Pick a trophy\u2019s Guide button to read its steps, where to do it and its sources. The guide opens beside the checklist.';
    panelEl.append(p);
    return;
  }
  if (isMasked(trophy, spoilerOn, earnedNames)) {
    const wrap = document.createElement('div');
    wrap.className = 'guide-panel';
    const title = document.createElement('h2');
    title.textContent = 'Hidden story trophy';
    const note = document.createElement('p');
    note.className = 'guide-text';
    note.textContent = 'The spoiler shield is on: this story trophy stays masked until you earn it. Turn the shield off, or earn the trophy, to read its guide.';
    wrap.append(title, note);
    panelEl.append(wrap);
    return;
  }
  const wrap = document.createElement('div');
  wrap.className = 'guide-panel';
  const title = document.createElement('h2');
  title.textContent = trophy.name;
  const gradeRow = document.createElement('div');
  gradeRow.className = 'guide-grade';
  const gradeTag = document.createElement('span');
  gradeTag.className = `tag grade-${trophy.grade}`;
  gradeTag.textContent = GRADE_LABELS[trophy.grade];
  const status = document.createElement('span');
  status.className = 'tag';
  status.textContent = earnedNames.has(trophy.name) ? 'Earned' : 'Not earned yet';
  gradeRow.append(gradeTag, status);
  const official = document.createElement('p');
  official.className = 'guide-official';
  const officialLabel = document.createElement('strong');
  officialLabel.textContent = 'Official description (PlayStation): ';
  official.append(officialLabel, document.createTextNode(`\u201c${trophy.description}\u201d`));
  wrap.append(title, gradeRow, official);
  if (trophy.missable && trophy.missable_note) {
    const banner = document.createElement('div');
    banner.className = 'missable-banner';
    banner.textContent = `\u26a0 Possibly missable — ${trophy.missable_note}`;
    wrap.append(banner);
  }
  const target = targetText(trophy, earnedNames);
  if (target) {
    const counter = document.createElement('div');
    counter.className = 'guide-counter';
    counter.textContent = target;
    const note = document.createElement('small');
    note.textContent = ' — PSN progress target';
    counter.append(note);
    wrap.append(counter);
  }
  const guideHead = document.createElement('h3');
  guideHead.textContent = 'Guide';
  const guideText = document.createElement('p');
  guideText.className = 'guide-text';
  guideText.textContent = trophy.guide;
  wrap.append(guideHead, guideText);
  const stepsHead = document.createElement('h3');
  stepsHead.textContent = 'Steps';
  const steps = document.createElement('ol');
  steps.className = 'steps';
  for (const step of trophy.steps) {
    const li = document.createElement('li');
    li.textContent = step;
    steps.append(li);
  }
  wrap.append(stepsHead, steps);
  const whereBox = document.createElement('div');
  whereBox.className = 'where-box';
  const whereHead = document.createElement('h3');
  whereHead.textContent = 'Where / How';
  const whereText = document.createElement('p');
  whereText.textContent = trophy.where;
  whereBox.append(whereHead, whereText);
  wrap.append(whereBox);
  const sourcesHead = document.createElement('h3');
  sourcesHead.textContent = 'Sources';
  const sources = document.createElement('ul');
  sources.className = 'sources';
  for (const source of trophy.sources) {
    const li = document.createElement('li');
    li.textContent = source;
    sources.append(li);
  }
  wrap.append(sourcesHead, sources);
  panelEl.append(wrap);
}
