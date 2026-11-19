// Leonida Ledger — the hand-in program (Node 22, standard library only).
//
// The guide itself is plain static files under app/ (index.html, its modules,
// styles and data) plus the screenshots/ renders. This program gathers those two
// folders into the output directory and writes dossier.json there, the summary
// the judge reads, using the vendored make.fun library. The library file under
// vendor/ is the kit's copy and must stay byte for byte as shipped.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice and the two dossiers must come out byte identical.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The gate's own caps, so a local run refuses what the sealed scorer would:
// at most 4 screenshots of at most 256 KiB each, app/ within 993 entries and
// 48 MiB, and the dossier text within 160 KiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
