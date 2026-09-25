/**
 * Single source of truth for every prerendered route segment.
 *
 * The build scripts are CommonJS and cannot import the TypeScript data module,
 * so milestone slugs are extracted from src/data/timelineData.ts with a regex.
 * `slug:` exists only on Milestone objects, so every match is a dossier page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function milestoneSlugs() {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'data', 'timelineData.ts'), 'utf8');
  const slugs = [...src.matchAll(/^\s*slug:\s*'([a-z0-9-]+)'\s*,/gm)].map((m) => m[1]);
  const unique = [...new Set(slugs)];
  if (unique.length === 0) {
    throw new Error('site_segments: no milestone slugs found in src/data/timelineData.ts');
  }
  if (unique.length !== slugs.length) {
    throw new Error(`site_segments: duplicate milestone slugs in timelineData.ts: ${slugs.join(', ')}`);
  }
  return unique;
}

/**
 * All route segments: '' (home), the three tab routes, then milestone/<slug> and
 * its English twin en/milestone/<slug> for each dossier.
 */
function getSegments() {
  const slugs = milestoneSlugs();
  return [
    '',
    'reader',
    'lab',
    'ecosystem',
    ...slugs.map((s) => `milestone/${s}`),
    ...slugs.map((s) => `en/milestone/${s}`),
  ];
}

module.exports = { getSegments, milestoneSlugs };
