export interface SitePage {
  file: string;
  title: string;
  group: string;
}

export const SITE_PAGES: SitePage[] = [
  { file: 'index.html', title: 'Home', group: 'Main' },
  { file: 'page6.html', title: 'Organizations', group: 'Main' },
  { file: 'page7.html', title: 'About Us', group: 'Main' },

  { file: 'page4.html', title: 'Matatag Production', group: 'Matatag Production' },
  { file: 'page10.html', title: 'MP - About', group: 'Matatag Production' },
  { file: 'page1.html', title: 'MP - People Behind', group: 'Matatag Production' },
  { file: 'page12.html', title: 'MP - Photo Gallery', group: 'Matatag Production' },
  { file: 'page13.html', title: 'MP - Be a Member', group: 'Matatag Production' },

  { file: 'page17.html', title: 'Deep Limits', group: 'Deep Limits' },
  { file: 'page18.html', title: 'DL - About', group: 'Deep Limits' },
  { file: 'page19.html', title: 'DL - Activities', group: 'Deep Limits' },
  { file: 'page20.html', title: 'DL - Be a Member', group: 'Deep Limits' },

  { file: 'page50.html', title: 'SSLG', group: 'SSLG' },
  { file: 'page55.html', title: 'SSLG - About', group: 'SSLG' },
  { file: 'page54.html', title: 'SSLG - People Behind', group: 'SSLG' },
  { file: 'page56.html', title: 'SSLG - Activities', group: 'SSLG' },
  { file: 'page57.html', title: 'SSLG - Photo Gallery', group: 'SSLG' },
  { file: 'page51.html', title: 'SSLG - Be a Member', group: 'SSLG' },

  { file: 'page11.html', title: 'Yes-O', group: 'Yes-O' },
  { file: 'page14.html', title: 'Yes-O - About', group: 'Yes-O' },
  { file: 'page3.html', title: 'Yes-O - People Behind', group: 'Yes-O' },
  { file: 'page16.html', title: 'Yes-O - Activities', group: 'Yes-O' },
  { file: 'page15.html', title: 'Yes-O - Be a Member', group: 'Yes-O' },

  { file: 'page21.html', title: 'Filipino', group: 'Filipino Club' },
  { file: 'page22.html', title: 'Fil - About', group: 'Filipino Club' },
  { file: 'page2.html', title: 'Fil - People Behind', group: 'Filipino Club' },
  { file: 'page23.html', title: 'Fil - Activities', group: 'Filipino Club' },
  { file: 'page24.html', title: 'Fil - Be a Member', group: 'Filipino Club' },

  { file: 'page25.html', title: 'Sci-Math', group: 'Sci-Math' },
  { file: 'page26.html', title: 'SM - About', group: 'Sci-Math' },
  { file: 'page27.html', title: 'SM - People Behind', group: 'Sci-Math' },
  { file: 'page28.html', title: 'SM - Activities', group: 'Sci-Math' },
  { file: 'page59.html', title: 'SM - Photo Gallery', group: 'Sci-Math' },
  { file: 'page29.html', title: 'SM - Be a Member', group: 'Sci-Math' },

  { file: 'page32.html', title: 'Red Cross', group: 'Red Cross' },
  { file: 'page45.html', title: 'RC - About', group: 'Red Cross' },
  { file: 'page44.html', title: 'RC - People Behind', group: 'Red Cross' },
  { file: 'page47.html', title: 'RC - Activities', group: 'Red Cross' },
  { file: 'page46.html', title: 'RC - Be a Member', group: 'Red Cross' },

  { file: 'page33.html', title: 'Sports Club', group: 'Sports Club' },
  { file: 'page41.html', title: 'Sports - About', group: 'Sports Club' },
  { file: 'page40.html', title: 'Sports - People Behind', group: 'Sports Club' },
  { file: 'page43.html', title: 'Sports - Activities', group: 'Sports Club' },
  { file: 'page42.html', title: 'Sports - Be a Member', group: 'Sports Club' },

  { file: 'page34.html', title: 'Theater', group: 'Theater' },
  { file: 'page36.html', title: 'Theater - About', group: 'Theater' },
  { file: 'page38.html', title: 'Theater - People Behind', group: 'Theater' },
  { file: 'page37.html', title: 'Theater - Activities', group: 'Theater' },
  { file: 'page58.html', title: 'Theater - Photo Gallery', group: 'Theater' },
  { file: 'page39.html', title: 'Theater - Be a Member', group: 'Theater' },

  { file: 'page35.html', title: 'PCM', group: 'PCM' },
  { file: 'page48.html', title: 'PCM - About', group: 'PCM' },
  { file: 'page49.html', title: 'PCM - People Behind', group: 'PCM' },
  { file: 'page53.html', title: 'PCM - Activities', group: 'PCM' },
  { file: 'page52.html', title: 'PCM - Be a Member', group: 'PCM' },
];

const PAGE_SET = new Set(SITE_PAGES.map((p) => p.file));

export function normalizeSitePage(raw: string | null | undefined): string {
  if (!raw) return 'index.html';
  const cleaned = raw.trim().replace(/^\/+/, '').split(/[?#]/)[0];
  const base = cleaned.startsWith('site/') ? cleaned.slice(5) : cleaned;
  if (!base || base.includes('/') || base.includes('\\') || base.includes('..')) {
    return 'index.html';
  }
  return PAGE_SET.has(base) ? base : 'index.html';
}

export function getSitePageInfo(file: string): SitePage | undefined {
  const normalized = normalizeSitePage(file);
  return SITE_PAGES.find((p) => p.file === normalized);
}

export function getSiteGroups(): string[] {
  return Array.from(new Set(SITE_PAGES.map((p) => p.group)));
}

export function filterSitePages(query: string, group?: string): SitePage[] {
  const q = query.trim().toLowerCase();
  return SITE_PAGES.filter((page) => {
    if (group && group !== 'All' && page.group !== group) {
      return false;
    }
    if (!q) return true;
    return (
      page.title.toLowerCase().includes(q) ||
      page.group.toLowerCase().includes(q) ||
      page.file.toLowerCase().includes(q)
    );
  });
}

export function getOrganizationHomePages(): SitePage[] {
  const seen = new Set<string>();
  const result: SitePage[] = [];
  for (const page of SITE_PAGES) {
    if (page.group === 'Main') continue;
    if (!seen.has(page.group)) {
      seen.add(page.group);
      result.push(page);
    }
  }
  return result;
}
