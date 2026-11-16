import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('public/assets/aistudio');
const OUT_DIR = path.resolve('public/site');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanHashName(filename) {
  const m = filename.match(/^(.+)_[0-9a-f]{8}(\.[^.]+)$/);
  return m ? `${m[1]}${m[2]}` : filename;
}

function buildSvgMaskRule(selector, svgPathD, unitsPerEm = 1024, ascent = 960) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${unitsPerEm} ${unitsPerEm}"><g transform="translate(0,${ascent}) scale(1,-1)"><path d="${svgPathD}"/></g></svg>`;
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return `${selector} {
  content: "" !important;
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask-image: url("${dataUri}");
  mask-image: url("${dataUri}");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}`;
}

function extractGlyphByUnicode(svgContent, hexCode) {
  const re = new RegExp(`<glyph[^>]*unicode="&#x${hexCode};"[^>]*d="([^"]+)"`, 'i');
  const m = svgContent.match(re);
  return m ? m[1] : null;
}

function extractGlyphByName(svgContent, glyphName) {
  const re = new RegExp(`<glyph[^>]*glyph-name="${glyphName}"[^>]*d="([^"]+)"`, 'i');
  const m = svgContent.match(re);
  return m ? m[1] : null;
}

const ENHANCEMENTS_CSS = `/* OrgANice Responsive Parity, Uncropped Image Aspect Ratios & Motion Enhancements */
html, body {
  overflow-x: hidden;
  max-width: 100%;
}

/* Smooth page load & hero entrance */
@keyframes organiceFadeUp {
  from {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes organiceNavDrop {
  from {
    opacity: 0;
    transform: translate3d(0, -14px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes organiceBannerZoom {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

section.menu nav.navbar {
  animation: organiceNavDrop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

section.menu .navbar-brand .navbar-logo img {
  width: auto !important;
  object-fit: contain !important;
}

section.header09 .content-wrap h1,
section.header16 .content-wrap h1 {
  animation: organiceFadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}

section.header09 .content-wrap p,
section.header16 .content-wrap p {
  animation: organiceFadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

section.header16:not(:has(h1, h2, h3, p)) {
  animation: organiceBannerZoom 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Ensure all images preserve full visibility, rounded corners, and natural aspect ratio without cropping */
section.features4 .item-wrapper,
section.features13 .item-wrapper,
section.people01 .item-wrapper,
section.people03 .item-wrapper,
section.social06 .item-wrapper,
section.gallery1 .item-wrapper {
  border-radius: 2rem !important;
  overflow: hidden !important;
}

section.features4 .item-img,
section.features13 .item-img {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 1 / 1;
  flex: 0 0 auto !important;
  flex-shrink: 0 !important;
  background-color: #ffffff;
  border-radius: 2rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden !important;
}

section.features4 .item-content,
section.features13 .item-content {
  flex: 1 1 auto !important;
  height: auto !important;
}

section.features4 .item-img img,
section.features13 .item-img img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  border-radius: 2rem !important;
  display: block;
}

section.people03 .item-img,
section.gallery1 .item-wrapper {
  height: auto !important;
  border-radius: 2rem !important;
  overflow: hidden !important;
}

section.people03 .item-img img,
section.gallery1 .item-wrapper img,
.image-wrapper img {
  width: 100% !important;
  height: auto !important;
  max-height: none !important;
  object-fit: contain !important;
  border-radius: 2rem !important;
  display: block;
}

/* Home page Community Gallery: preserve scroll-gallery horizontal motion with uncropped 4:3 rounded photos */
section.gallery4 .container,
section.gallery4 .container-fluid {
  overflow: hidden !important;
}

section.gallery4 .grid-item {
  aspect-ratio: 4 / 3;
  border-radius: 2rem !important;
  overflow: hidden !important;
}

section.gallery4 .grid-item img {
  width: 100% !important;
  height: 100% !important;
  min-width: 30vw;
  object-fit: contain !important;
  border-radius: 2rem !important;
  display: block;
}

/* Keep 16:9 club banners fully visible without horizontal/vertical cropping on all viewports */
section.header16.mbr-fullscreen:not(:has(h1, h2, h3, p)) {
  min-height: 0 !important;
  height: auto !important;
  aspect-ratio: 16 / 9;
  width: 100%;
  margin-top: 5.5rem;
  padding: 0 !important;
  background-size: contain !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
}

/* Hide empty spacer sections above banners so there is no awkward white gap */
section.article11:has(.title:empty),
section.article11:has(.title:not(:has(h1, h2, h3, h4, p, a))) {
  display: none !important;
}

/* Scroll-triggered reveal elements */
.organice-reveal {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition:
    opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.organice-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Feature card hover scale-up, shadow elevation & picture micro-interactions */
.features4 .item-wrapper,
.features13 .item-wrapper,
.people01 .item-wrapper,
.people03 .item-wrapper,
.social06 .item-wrapper,
.gallery1 .item-wrapper {
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

.features4 .item-wrapper:hover,
.features13 .item-wrapper:hover,
.people01 .item-wrapper:hover,
.people03 .item-wrapper:hover,
.social06 .item-wrapper:hover,
.gallery1 .item-wrapper:hover {
  transform: translateY(-6px) scale(1.025) !important;
  box-shadow: 0 24px 48px -12px rgba(12, 44, 104, 0.32) !important;
}

.features4 .item-img,
.features13 .item-img,
.people03 .item-img,
.gallery1 .item-img,
.gallery4 .grid-item {
  overflow: hidden !important;
}

.features4 .item-img img,
.features13 .item-img img,
.people03 .item-img img,
.gallery1 .item-wrapper img,
.gallery4 .grid-item img {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

.features4 .item-wrapper:hover .item-img img,
.features13 .item-wrapper:hover .item-img img,
.people03 .item-wrapper:hover .item-img img,
.gallery1 .item-wrapper:hover img,
.gallery4 .grid-item:hover img {
  transform: scale(1.06) !important;
}

.btn {
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.25s ease,
    border-color 0.25s ease !important;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -8px rgba(0, 0, 0, 0.28);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

.btn .mobi-mbri-right {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  display: inline-block;
}

.btn:hover .mobi-mbri-right {
  transform: translateX(4px);
}

.navbar .icons-menu .iconfont-wrapper,
.footer3 .soc-item a {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.navbar .icons-menu .iconfont-wrapper:hover,
.footer3 .soc-item a:hover {
  transform: translateY(-2px) scale(1.08);
}

/* Mobile Layout Parity (matching desktop visual clarity & proportions) */
@media (max-width: 767px) {
  section.header16.mbr-fullscreen:not(:has(h1, h2, h3, p)) {
    margin-top: 4.5rem;
  }

  section.gallery4 .grid-item img {
    min-width: 55vw;
  }

  /* Balanced mobile hero for Home & About Us (which have text overlays) */
  section.header09.mbr-fullscreen,
  section.header16.mbr-fullscreen:has(h1, h2, h3, p) {
    min-height: 58vh !important;
    padding: 6rem 1rem 3rem !important;
    background-position: center center !important;
  }

  section.header09 .content-wrap,
  section.header16 .content-wrap {
    padding: 1.5rem 0.75rem !important;
    text-align: center;
  }

  section.header09 .display-2,
  section.header16 .display-1 {
    font-size: clamp(1.85rem, 7.2vw, 2.6rem) !important;
    line-height: 1.15 !important;
  }

  /* Avoid cramped 2-up col-6 organization cards on narrow mobile screens */
  section.features13 .item.features-image {
    flex: 0 0 100% !important;
    max-width: 100% !important;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-bottom: 1.5rem;
  }

  section.features13 .item-wrapper,
  section.features4 .item-wrapper {
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Clean mobile spacing for people01 link cards */
  section.people01 .col-lg-5:not(:has(h1, h2, h3, h4, p, img, a)) {
    display: none !important;
  }

  section.people01 .item-wrapper {
    padding: 1.25rem !important;
  }

  section.people01 .item-wrapper .row {
    row-gap: 0.75rem;
  }

  section.people01 .mbr-section-btn.align-right {
    text-align: left !important;
  }

  /* Prevent community gallery or slider overflow on mobile */
  section.gallery4,
  section.gallery1,
  section.people03 {
    overflow-x: hidden !important;
  }

  section.gallery4 .grid-container {
    overflow: hidden !important;
  }

  /* Clean navbar alignment on mobile */
  section.menu nav.navbar {
    min-height: 64px !important;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }

  section.menu .navbar-brand .navbar-logo img {
    height: 2.75rem !important;
  }

  section.menu .navbar-caption {
    font-size: 1.35rem !important;
  }
}

@media (max-width: 575px) {
  section.gallery4 .grid-container-1,
  section.gallery4 .grid-container-2 {
    grid-template-columns: 1fr !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .organice-reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
`;

const ENHANCEMENTS_JS = `(() => {
  const initReveals = () => {
    const selectors = [
      'section.features4 .item',
      'section.features13 .item',
      'section.people01 .item',
      'section.people03 .item',
      'section.social06 .item',
      'section.gallery1 .item',
      'section.article11 .title',
      'section.article13 .card',
      'section.article8 .card',
      'section.list07 .item',
      'section.gallery4 .mbr-section-head',
      'section.gallery4 .grid-item',
    ];
    const targets = Array.from(document.querySelectorAll(selectors.join(', ')));
    if (!targets.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    targets.forEach((el, idx) => {
      // Remove Mobirise default .hidden if present so our unified reveal owns visibility
      el.classList.remove('hidden');
      const siblingIndex = el.parentElement
        ? Array.from(el.parentElement.children).indexOf(el)
        : idx;
      const delay = Math.min(Math.max(siblingIndex, 0) * 65, 320);
      el.style.setProperty('--reveal-delay', delay + 'ms');
      el.classList.add('organice-reveal');
      if (reduceMotion) {
        el.classList.add('is-visible');
      }
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveals);
  } else {
    initReveals();
  }
})();
`;

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    throw new Error(`Source directory not found: ${SRC_DIR}`);
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  ensureDir(OUT_DIR);
  ensureDir(path.join(OUT_DIR, 'assets/images'));
  ensureDir(path.join(OUT_DIR, 'assets/animatecss'));
  ensureDir(path.join(OUT_DIR, 'assets/bootstrap/css'));
  ensureDir(path.join(OUT_DIR, 'assets/bootstrap/js'));
  ensureDir(path.join(OUT_DIR, 'assets/custom'));
  ensureDir(path.join(OUT_DIR, 'assets/dropdown/css'));
  ensureDir(path.join(OUT_DIR, 'assets/dropdown/js'));
  ensureDir(path.join(OUT_DIR, 'assets/mobirise/css'));
  ensureDir(path.join(OUT_DIR, 'assets/parallax'));
  ensureDir(path.join(OUT_DIR, 'assets/scrollgallery'));
  ensureDir(path.join(OUT_DIR, 'assets/smoothscroll'));
  ensureDir(path.join(OUT_DIR, 'assets/socicon/css'));
  ensureDir(path.join(OUT_DIR, 'assets/socicon/fonts'));
  ensureDir(path.join(OUT_DIR, 'assets/theme/css'));
  ensureDir(path.join(OUT_DIR, 'assets/theme/js'));
  ensureDir(path.join(OUT_DIR, 'assets/web/assets/mobirise-icons2'));
  ensureDir(path.join(OUT_DIR, 'assets/ytplayer'));

  fs.writeFileSync(path.join(OUT_DIR, 'assets/custom/enhancements.css'), ENHANCEMENTS_CSS, 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'assets/custom/enhancements.js'), ENHANCEMENTS_JS, 'utf8');

  const files = fs.readdirSync(SRC_DIR);
  const pages = [];

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const clean = cleanHashName(file);

    if (file.endsWith('.html')) {
      let html = fs.readFileSync(srcPath, 'utf8');
      html = html.replace(
        '</head>',
        '  <link rel="stylesheet" href="assets/custom/enhancements.css">\n</head>'
      );
      html = html.replace(
        '</body>',
        '  <script src="assets/custom/enhancements.js"></script>\n</body>'
      );
      fs.writeFileSync(path.join(OUT_DIR, clean), html, 'utf8');
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      pages.push({
        file: clean,
        title: (titleMatch ? titleMatch[1] : clean).trim(),
      });
      continue;
    }

    if (/\.(webp|jpg|jpeg|png|gif|ico)$/i.test(file)) {
      fs.copyFileSync(srcPath, path.join(OUT_DIR, 'assets/images', clean));
      continue;
    }
  }

  const directCopies = [
    ['animate_2500feea.css', 'assets/animatecss/animate.css'],
    ['bootstrap.min_df104340.css', 'assets/bootstrap/css/bootstrap.min.css'],
    ['bootstrap.bundle.min_1f5b2786.js', 'assets/bootstrap/js/bootstrap.bundle.min.js'],
    ['style_180d8ca6.css', 'assets/dropdown/css/style.css'],
    ['navbar-dropdown_d769f394.js', 'assets/dropdown/js/navbar-dropdown.js'],
    ['mbr-additional_31f58bcf.css', 'assets/mobirise/css/mbr-additional.css'],
    ['jarallax_a80fcab3.css', 'assets/parallax/jarallax.css'],
    ['jarallax_960013fb.js', 'assets/parallax/jarallax.js'],
    ['scroll-gallery_2c148e46.js', 'assets/scrollgallery/scroll-gallery.js'],
    ['smooth-scroll_997ce966.js', 'assets/smoothscroll/smooth-scroll.js'],
    ['style_81f24a03.css', 'assets/theme/css/style.css'],
    ['script_ffc5e01c.js', 'assets/theme/js/script.js'],
    ['index_f7add31c.js', 'assets/ytplayer/index.js'],
    ['mobirise2_f19cba98.svg', 'assets/web/assets/mobirise-icons2/mobirise2.svg'],
    ['socicon_e433cb23.svg', 'assets/socicon/fonts/socicon.svg'],
  ];

  for (const [srcName, destRel] of directCopies) {
    fs.copyFileSync(path.join(SRC_DIR, srcName), path.join(OUT_DIR, destRel));
  }

  const mobiSvg = fs.readFileSync(path.join(SRC_DIR, 'mobirise2_f19cba98.svg'), 'utf8');
  const mobiCssOrig = fs.readFileSync(path.join(SRC_DIR, 'mobirise2_af781231.css'), 'utf8')
    .replace(/@font-face\s*\{[\s\S]*?\}/m, '/* font-face replaced with inline SVG vector masks */');

  const mobiMap = {
    'mobi-mbri-arrow-down': 'e908',
    'mobi-mbri-arrow-next': 'e909',
    'mobi-mbri-arrow-prev': 'e90a',
    'mobi-mbri-left': 'e944',
    'mobi-mbri-letter': 'e945',
    'mobi-mbri-right': 'e96b',
    'mobi-mbri-search': 'e970',
  };
  const mobiOverrides = Object.entries(mobiMap)
    .map(([cls, hex]) => {
      const d = extractGlyphByUnicode(mobiSvg, hex);
      return d ? buildSvgMaskRule(`.${cls}:before`, d, 1024, 960) : '';
    })
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync(
    path.join(OUT_DIR, 'assets/web/assets/mobirise-icons2/mobirise2.css'),
    `${mobiCssOrig}\n${mobiOverrides}\n`,
    'utf8'
  );

  const socSvg = fs.readFileSync(path.join(SRC_DIR, 'socicon_e433cb23.svg'), 'utf8');
  const socCssOrig = fs.readFileSync(path.join(SRC_DIR, 'styles_5c6011a2.css'), 'utf8')
    .replace(/@font-face\s*\{[\s\S]*?\}/m, '/* font-face replaced with inline SVG vector masks */');

  const socMap = {
    'socicon-fundable': 'fundable',
    'socicon-instagram': 'instagram',
    'socicon-mail': 'mail',
    'socicon-tiktok': 'tiktok',
    'socicon-viber': 'viber',
  };
  const socOverrides = Object.entries(socMap)
    .map(([cls, name]) => {
      const d = extractGlyphByName(socSvg, name);
      return d ? buildSvgMaskRule(`.${cls}:before`, d, 1024, 960) : '';
    })
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync(
    path.join(OUT_DIR, 'assets/socicon/css/styles.css'),
    `${socCssOrig}\n${socOverrides}\n`,
    'utf8'
  );

  pages.sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
  console.log(`Restored ${pages.length} HTML pages with responsive & animation enhancements into ${OUT_DIR}`);
}

main();
