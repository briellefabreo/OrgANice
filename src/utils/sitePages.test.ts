import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SITE_PAGES,
  normalizeSitePage,
  getSitePageInfo,
  getSiteGroups,
  filterSitePages,
  getOrganizationHomePages,
} from './sitePages';
import {
  PREVIEW_IMAGE_CONTAINMENT_CSS,
  shouldSkipSplash,
} from './previewHelpers';

test('SITE_PAGES contains all 55 restored HTML pages', () => {
  assert.equal(SITE_PAGES.length, 55);
  assert.equal(SITE_PAGES[0].file, 'index.html');
});

test('normalizeSitePage validates known pages and blocks unsafe paths', () => {
  assert.equal(normalizeSitePage(undefined), 'index.html');
  assert.equal(normalizeSitePage(''), 'index.html');
  assert.equal(normalizeSitePage('page6.html'), 'page6.html');
  assert.equal(normalizeSitePage('/site/page34.html?foo=1#top'), 'page34.html');
  assert.equal(normalizeSitePage('../secret.html'), 'index.html');
  assert.equal(normalizeSitePage('nonexistent.html'), 'index.html');
});

test('getSitePageInfo resolves page metadata', () => {
  const orgs = getSitePageInfo('page6.html');
  assert.deepEqual(orgs, { file: 'page6.html', title: 'Organizations', group: 'Main' });
});

test('getSiteGroups returns all 11 organization groups', () => {
  const groups = getSiteGroups();
  assert.equal(groups.length, 11);
  assert.equal(groups[0], 'Main');
  assert.ok(groups.includes('Theater'));
});

test('filterSitePages filters by query and group', () => {
  const theaterPages = filterSitePages('', 'Theater');
  assert.equal(theaterPages.length, 6);

  const searchTheater = filterSitePages('theater');
  assert.equal(searchTheater.length, 6);
  assert.ok(searchTheater.some((p) => p.file === 'page34.html'));

  const combined = filterSitePages('gallery', 'Matatag Production');
  assert.deepEqual(combined.map((p) => p.file), ['page12.html']);
});

test('getOrganizationHomePages returns one landing page per club', () => {
  const clubs = getOrganizationHomePages();
  assert.equal(clubs.length, 10);
  assert.ok(clubs.some((c) => c.group === 'Red Cross' && c.file === 'page32.html'));
});

test('shouldSkipSplash respects autostart query and reduced motion', () => {
  assert.equal(shouldSkipSplash('', false), false);
  assert.equal(shouldSkipSplash('?page=page6.html', false), false);
  assert.equal(shouldSkipSplash('?autostart=1', false), true);
  assert.equal(shouldSkipSplash('?page=page6.html&autostart=1', false), true);
  assert.equal(shouldSkipSplash('', true), true);
});

test('PREVIEW_IMAGE_CONTAINMENT_CSS enforces uncropped contain rules, rounded corners, and card hover scale/shadow', () => {
  assert.match(PREVIEW_IMAGE_CONTAINMENT_CSS, /section\.features4 \.item-img img[\s\S]*object-fit:\s*contain/);
  assert.match(PREVIEW_IMAGE_CONTAINMENT_CSS, /section\.gallery4 \.grid-item img[\s\S]*object-fit:\s*contain/);
  assert.match(PREVIEW_IMAGE_CONTAINMENT_CSS, /section\.header16\.mbr-fullscreen[\s\S]*aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(PREVIEW_IMAGE_CONTAINMENT_CSS, /section\.features4 \.item-wrapper:hover[\s\S]*scale\(1\.025\)/);
  assert.match(PREVIEW_IMAGE_CONTAINMENT_CSS, /section\.features4 \.item-img[\s\S]*border-radius:\s*2rem/);
});
