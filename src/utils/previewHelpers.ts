export function shouldSkipSplash(
  search: string,
  prefersReducedMotion: boolean
): boolean {
  if (prefersReducedMotion) return true;
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(normalized);
  return params.get('autostart') === '1';
}

export const PREVIEW_IMAGE_STYLE_ID = 'organice-preview-image-fix';

/**
 * Ensures all image elements preserve their natural aspect ratios and rounded corners
 * without cropping, keeps the Home page scroll-gallery animation active, and adds
 * subtle scale-up + shadow elevation on feature card hover.
 */
export const PREVIEW_IMAGE_CONTAINMENT_CSS = `
  section.features4 .item-wrapper,
  section.features13 .item-wrapper,
  section.people01 .item-wrapper,
  section.people03 .item-wrapper,
  section.social06 .item-wrapper,
  section.gallery1 .item-wrapper {
    border-radius: 2rem !important;
    overflow: hidden !important;
    transition:
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1) !important;
  }

  section.features4 .item-wrapper:hover,
  section.features13 .item-wrapper:hover,
  section.people01 .item-wrapper:hover,
  section.people03 .item-wrapper:hover,
  section.social06 .item-wrapper:hover,
  section.gallery1 .item-wrapper:hover {
    transform: translateY(-6px) scale(1.025) !important;
    box-shadow: 0 24px 48px -12px rgba(12, 44, 104, 0.32) !important;
  }

  section.features4 .item-img,
  section.features13 .item-img {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1 / 1 !important;
    flex: 0 0 auto !important;
    flex-shrink: 0 !important;
    background-color: #ffffff;
    border-radius: 2rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
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
    display: block !important;
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
    display: block !important;
  }

  section.gallery4 .container,
  section.gallery4 .container-fluid {
    overflow: hidden !important;
  }

  section.gallery4 .grid-item {
    aspect-ratio: 4 / 3 !important;
    border-radius: 2rem !important;
    overflow: hidden !important;
  }

  section.gallery4 .grid-item img {
    width: 100% !important;
    height: 100% !important;
    min-width: 30vw;
    object-fit: contain !important;
    border-radius: 2rem !important;
    display: block !important;
  }

  section.features4 .item-img img,
  section.features13 .item-img img,
  section.people03 .item-img img,
  section.gallery1 .item-wrapper img,
  section.gallery4 .grid-item img {
    transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) !important;
  }

  section.features4 .item-wrapper:hover .item-img img,
  section.features13 .item-wrapper:hover .item-img img,
  section.people03 .item-wrapper:hover .item-img img,
  section.gallery1 .item-wrapper:hover img,
  section.gallery4 .grid-item:hover img {
    transform: scale(1.06) !important;
  }

  section.header16.mbr-fullscreen:not(:has(h1, h2, h3, p)) {
    min-height: 0 !important;
    height: auto !important;
    aspect-ratio: 16 / 9 !important;
    width: 100% !important;
    background-size: contain !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
  }

  @media (max-width: 767px) {
    section.gallery4 .grid-item img {
      min-width: 55vw;
    }
  }
`;

export function injectPreviewImageStyles(doc: Document | null | undefined): void {
  if (!doc || !doc.head) return;
  let styleEl = doc.getElementById(PREVIEW_IMAGE_STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.id = PREVIEW_IMAGE_STYLE_ID;
    doc.head.appendChild(styleEl);
  }
  styleEl.textContent = PREVIEW_IMAGE_CONTAINMENT_CSS;
}
