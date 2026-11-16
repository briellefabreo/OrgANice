(() => {
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
