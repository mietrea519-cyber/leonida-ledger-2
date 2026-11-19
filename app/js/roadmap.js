// The 7-stage roadmap to the platinum, built from the official descriptions:
// story first, then side strands, robberies, collectibles, activities, and the
// money and cleanup that close the list.
export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Chapter 1: learn Leonida',
    blurb: 'Play the opening and finish Chapter 1. Meditate at every spot offered from the start — Positive Mental Attitude is first offered here and is the one trophy flagged possibly missable.',
    ids: [2, 3],
  },
  {
    n: 2,
    title: 'Finish the story',
    blurb: 'Chapters 2 to 4 and the final mission, with the named missions along the way. Every trophy in this stage pops by playing the story in order.',
    ids: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    n: 3,
    title: 'Side characters and strangers',
    blurb: 'The final mission of each side character — Andy, Kenton, Billy, Randy, Tyrone — plus Bret\u2019s hunt and eight stranger strands across the state.',
    ids: [22, 23, 24, 26, 27, 29, 25],
  },
  {
    n: 4,
    title: 'Robberies, heat and one-off moments',
    blurb: 'Vaults, trucks, jewelry and gang operations, the partner heat trophies, and the one-off moments at VCIA, the showroom and Ocean Beach.',
    ids: [33, 34, 39, 40, 41, 43, 37, 38, 45, 44],
  },
  {
    n: 5,
    title: 'Collect the state',
    blurb: 'The long counters that fill as you explore: meditation spots, card sets, WAiNK locations, vehicles, the 52 areas, garages and the Scooter Bros app.',
    ids: [28, 30, 31, 35, 42, 54, 55],
  },
  {
    n: 6,
    title: 'Activities and skill',
    blurb: 'Stunts, the shooting range at gold, drone races, races, fishing, the arcade, challenges, Combat Focus, bowling and the melee drive-by.',
    ids: [15, 16, 17, 18, 19, 20, 21, 32, 36, 46, 51],
  },
  {
    n: 7,
    title: 'Money, choices and the platinum',
    blurb: 'Launder $250,000, spend $100,000, let the 500 choices fill up, catch the cryptic story moments, then 100% completion — and the platinum with it.',
    ids: [52, 53, 48, 47, 49, 50, 14, 1],
  },
];

export function stageEarnedCount(stage, earnedNames, trophiesById) {
  return stage.ids.filter((id) => earnedNames.has(trophiesById.get(id).name)).length;
}

export function renderRoadmap(stagesEl, trophies, earnedNames) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  stagesEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const done = stageEarnedCount(stage, earnedNames, byId);
    const card = document.createElement('article');
    card.className = 'stage';
    const head = document.createElement('h3');
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${stage.n} — `;
    head.append(num, document.createTextNode(stage.title));
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    const prog = document.createElement('div');
    prog.className = 'stage-progress';
    prog.textContent = `${done} / ${stage.ids.length} earned`;
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('span');
    fill.style.width = `${Math.round((done / stage.ids.length) * 100)}%`;
    bar.append(fill);
    const chips = document.createElement('div');
    chips.className = 'stage-trophies';
    for (const id of stage.ids) {
      const t = byId.get(id);
      const chip = document.createElement('span');
      chip.className = 'stage-trophy' + (earnedNames.has(t.name) ? ' done' : '');
      chip.textContent = t.name;
      chips.append(chip);
    }
    card.append(head, blurb, prog, bar, chips);
    stagesEl.append(card);
  }
}
