import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { getSitePageInfo, normalizeSitePage } from './utils/sitePages';
import {
  injectPreviewImageStyles,
  shouldSkipSplash,
} from './utils/previewHelpers';

function readInitialPage(): string {
  if (typeof window === 'undefined') return 'index.html';
  const params = new URLSearchParams(window.location.search);
  return normalizeSitePage(params.get('page'));
}

function readInitialSplash(): boolean {
  if (typeof window === 'undefined') return true;
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !shouldSkipSplash(window.location.search, reducedMotion);
}

export default function App() {
  const [initialPage] = useState<string>(readInitialPage);
  const [currentPage, setCurrentPage] = useState<string>(initialPage);
  const [showSplash, setShowSplash] = useState<boolean>(readInitialSplash);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const syncUrlPage = useCallback((file: string) => {
    const normalized = normalizeSitePage(file);
    setCurrentPage(normalized);
    const info = getSitePageInfo(normalized);
    document.title = info ? `OrgANice — ${info.title}` : 'OrgANice';

    const url = new URL(window.location.href);
    if (normalized === 'index.html') {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', normalized);
    }
    window.history.replaceState(null, '', url.toString());
  }, []);

  const handleIframeLoad = useCallback(() => {
    try {
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      if (doc) {
        injectPreviewImageStyles(doc);
      }

      const loc = iframe?.contentWindow?.location;
      if (!loc) return;
      const pathname = loc.pathname || '';
      if (pathname.startsWith('/site/')) {
        const file = normalizeSitePage(pathname.slice('/site/'.length));
        syncUrlPage(file);
      }
    } catch {
      // Cross-origin navigation guard
    }
  }, [syncUrlPage]);

  useEffect(() => {
    const info = getSitePageInfo(currentPage);
    document.title = info ? `OrgANice — ${info.title}` : 'OrgANice';
  }, [currentPage]);

  return (
    <div
      data-state={showSplash ? 'splash' : 'ready'}
      className="relative h-screen w-screen overflow-hidden bg-[#0c2c68]"
    >
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="organice-splash"
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full overflow-hidden bg-white"
        >
          <iframe
            ref={iframeRef}
            src={`/site/${initialPage}`}
            onLoad={handleIframeLoad}
            title="OrgANice Website"
            className="block h-full w-full border-0 bg-white"
          />
        </motion.main>
      )}
    </div>
  );
}
