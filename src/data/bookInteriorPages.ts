/**
 * Helper to generate ultra-sharp, readable SVG data URIs for book interior pages
 * (e.g. সূচিপত্র, প্রথম পরিচ্ছেদ, নমুনা পৃষ্ঠা) so that demo books always render
 * pristine, authentic printed pages without external CDN dependency or broken links.
 */

export function createSampleTableOfContents(bookTitle: string, author: string, chapters: { title: string; page: string }[]): string {
  const chapterRows = chapters
    .map(
      (ch, idx) => `
      <g transform="translate(0, ${idx * 34})">
        <text x="30" y="20" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="14" font-weight="600" fill="#18211C">${ch.title}</text>
        <line x1="280" y1="16" x2="480" y2="16" stroke="#D1D5DB" stroke-dasharray="3,4" stroke-width="1.2" />
        <text x="500" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#176B48" text-anchor="end">${ch.page}</text>
      </g>
    `
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 760" width="100%" height="100%">
    <defs>
      <filter id="pageShadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.08"/>
      </filter>
    </defs>
    <!-- Paper background -->
    <rect width="560" height="760" fill="#FAF8F5" rx="4" />
    <rect x="15" y="15" width="530" height="730" fill="none" stroke="#EAE6DF" stroke-width="1" />
    
    <!-- Top Running Header -->
    <text x="50" y="52" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="11" fill="#888888" letter-spacing="1">${bookTitle} · ${author}</text>
    <text x="510" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#888888" text-anchor="end">সূচিপত্র</text>
    <line x1="50" y1="62" x2="510" y2="62" stroke="#E5E7EB" stroke-width="1" />

    <!-- Title -->
    <text x="280" y="115" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="24" font-weight="700" fill="#104D36" text-anchor="middle">সূচিপত্র</text>
    <line x1="240" y1="128" x2="320" y2="128" stroke="#176B48" stroke-width="2" />

    <!-- Chapter list -->
    <g transform="translate(20, 160)">
      ${chapterRows}
    </g>

    <!-- Footer Page Number -->
    <line x1="50" y1="700" x2="510" y2="700" stroke="#E5E7EB" stroke-width="1" />
    <text x="280" y="725" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#9CA3AF" text-anchor="middle">৭</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createSampleTextPage(
  bookTitle: string,
  chapterHeading: string,
  pageNumber: string,
  paragraphs: string[]
): string {
  const pElements = paragraphs
    .map(
      (p, i) => `
      <g transform="translate(0, ${i * 125})">
        <text x="50" y="0" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="13.5" font-weight="400" fill="#24292F" line-height="24">
          ${wrapTextToSvgSpans(p, 50, 460)}
        </text>
      </g>
    `
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 760" width="100%" height="100%">
    <!-- Paper background -->
    <rect width="560" height="760" fill="#FFFDF9" rx="4" />
    <rect x="15" y="15" width="530" height="730" fill="none" stroke="#EAE6DF" stroke-width="1" />

    <!-- Top Running Header -->
    <text x="50" y="52" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="11" fill="#888888">${bookTitle}</text>
    <text x="510" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#888888" text-anchor="end">${pageNumber}</text>
    <line x1="50" y1="62" x2="510" y2="62" stroke="#E5E7EB" stroke-width="1" />

    <!-- Chapter Header -->
    <text x="280" y="110" font-family="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" font-size="19" font-weight="700" fill="#18211C" text-anchor="middle">${chapterHeading}</text>
    <line x1="250" y1="122" x2="310" y2="122" stroke="#176B48" stroke-width="1.5" />

    <!-- Paragraphs Area -->
    <g transform="translate(0, 160)">
      ${pElements}
    </g>

    <!-- Bottom Page Number -->
    <text x="280" y="725" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#9CA3AF" text-anchor="middle">${pageNumber}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function wrapTextToSvgSpans(text: string, x: number, maxWidthPixels: number): string {
  // Approximate wrapping for Bengali text (~36 chars per line in this width)
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const w of words) {
    if ((currentLine + ' ' + w).length > 44) {
      lines.push(currentLine.trim());
      currentLine = w;
    } else {
      currentLine += (currentLine ? ' ' : '') + w;
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  return lines
    .map((line, idx) => `<tspan x="${x}" dy="${idx === 0 ? 0 : 23}">${line}</tspan>`)
    .join('');
}
