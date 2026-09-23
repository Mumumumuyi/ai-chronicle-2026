import React from 'react';

/**
 * Self-drawn epoch line-art specimens — ported verbatim from
 * design/prototype-v2.generator.cjs (champagne strokes on obsidian).
 * One drawing per EPOCHS entry, indexed by epoch position.
 */

const G = 'fill="none" stroke="#C9A86A" stroke-width="1.2"';

function buildSpecimens(): string[] {
  // 0 · McCulloch-Pitts neuron
  const neuron =
    `<g ${G}><circle cx="110" cy="100" r="26"/>` +
    `<text x="103" y="106" fill="#C9A86A" stroke="none" font-family="Cormorant Garamond" font-size="20">θ</text>` +
    [40, 70, 100, 130, 160]
      .map((y) => `<line x1="20" y1="${y}" x2="86" y2="${100 + (y - 100) * 0.25}"/><circle cx="20" cy="${y}" r="3"/>`)
      .join('') +
    `<line x1="136" y1="100" x2="186" y2="100"/><polyline points="178,94 186,100 178,106"/></g>`;

  // 1 · search tree
  let tree = '<circle cx="100" cy="30" r="5"/>';
  [50, 100, 150].forEach((x) => {
    tree += `<line x1="100" y1="35" x2="${x}" y2="85"/><circle cx="${x}" cy="90" r="5"/>`;
    [-18, 0, 18].forEach((d) => {
      tree += `<line x1="${x}" y1="95" x2="${x + d}" y2="145"/><circle cx="${x + d}" cy="150" r="3"/>`;
    });
  });
  const searchTree = `<g ${G}>${tree}</g>`;

  // 2 · multilayer network
  const layers: [number, number[]][] = [
    [40, [50, 90, 130, 170]],
    [100, [40, 80, 120, 160]],
    [160, [70, 130]],
  ];
  let net = '';
  for (let i = 0; i < layers.length - 1; i++) {
    layers[i][1].forEach((a) =>
      layers[i + 1][1].forEach((b) => {
        net += `<line x1="${layers[i][0]}" y1="${a}" x2="${layers[i + 1][0]}" y2="${b}" stroke-opacity=".45"/>`;
      })
    );
  }
  layers.forEach(([x, ys]) => ys.forEach((y) => {
    net += `<circle cx="${x}" cy="${y}" r="6" fill="#0C0A09"/>`;
  }));
  const multiLayer = `<g ${G}>${net}</g>`;

  // 3 · SVM margin
  const svm =
    `<g ${G}><line x1="30" y1="170" x2="170" y2="30"/>` +
    `<line x1="10" y1="150" x2="150" y2="10" stroke-dasharray="4 5"/>` +
    `<line x1="50" y1="190" x2="190" y2="50" stroke-dasharray="4 5"/>` +
    [[40, 60], [60, 40], [70, 80], [45, 100], [90, 50]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`)
      .join('') +
    [[130, 150], [150, 120], [110, 170], [160, 160], [140, 100]]
      .map(([x, y]) => `<path d="M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}"/>`)
      .join('') +
    `</g>`;

  // 4 · convolution stacks
  const conv =
    `<g ${G}>` +
    [0, 1, 2, 3]
      .map((i) => `<rect x="${30 + i * 32}" y="${40 + i * 14}" width="${90 - i * 16}" height="${90 - i * 16}" transform="skewY(-12)" fill="#0C0A09"/>`)
      .join('') +
    `<rect x="44" y="62" width="18" height="18" transform="skewY(-12)" stroke-opacity=".6"/></g>`;

  // 5 · attention matrix
  let matrix = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const v = Math.max(0.06, Math.exp(-Math.abs(r - c) / 1.6) * (0.4 + (0.6 * ((r * 7 + c * 3) % 5)) / 4));
      matrix += `<rect x="${36 + c * 16}" y="${36 + r * 16}" width="14" height="14" fill="#C9A86A" fill-opacity="${v.toFixed(2)}"/>`;
    }
  }
  const attention = `<g>${matrix}</g>`;

  // 6 · agent loop
  const agent =
    `<g ${G}><circle cx="100" cy="100" r="60" stroke-dasharray="3 6"/><circle cx="100" cy="100" r="14" fill="#0C0A09"/>` +
    ['计划', '行动', '观察', '反思']
      .map((t, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 2;
        const x = 100 + 60 * Math.cos(a);
        const y = 100 + 60 * Math.sin(a);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#0C0A09"/>` +
          `<text x="${(x + (Math.cos(a) >= 0 ? 12 : -38)).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="#A8A29E" stroke="none" font-size="11" font-family="Noto Serif SC">${t}</text>`;
      })
      .join('') +
    `</g>`;

  return [neuron, searchTree, multiLayer, svm, conv, attention, agent];
}

export const SPECIMENS = buildSpecimens();

/** The shared sand-dissolve filter; mount once per page that uses it. */
export const SandFilterDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <filter id="sand" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
      <feDisplacementMap id="sand-disp" in="SourceGraphic" in2="n" scale={0} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

interface EpochSpecimenProps {
  index: number;
  /** Apply the sand-dissolve filter (requires SandFilterDefs mounted). */
  sand?: boolean;
  className?: string;
}

export const EpochSpecimen: React.FC<EpochSpecimenProps> = ({ index, sand = false, className }) => {
  const html = SPECIMENS[Math.max(0, Math.min(SPECIMENS.length - 1, index))];
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={sand ? { filter: 'url(#sand)' } : undefined}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
