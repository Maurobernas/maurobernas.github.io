const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const languageButton = document.querySelector('.language-toggle');

const flags = {
  en: '<svg viewBox="0 0 30 20" focusable="false"><rect width="30" height="20" fill="#fff"/><path d="M0 0h30v2H0zm0 4h30v2H0zm0 4h30v2H0zm0 4h30v2H0zm0 4h30v2H0z" fill="#c83b45"/><rect width="13" height="11" fill="#23447d"/><path d="M3 2h1v1H3zm3 0h1v1H6zm3 0h1v1H9zM4 4h1v1H4zm3 0h1v1H7zm3 0h1v1h-1zM3 7h1v1H3zm3 0h1v1H6zm3 0h1v1H9z" fill="#fff"/></svg>',
  es: '<svg viewBox="0 0 30 20" focusable="false"><rect width="30" height="20" fill="#fff"/><path d="M0 0h30v6H0zm0 14h30v6H0z" fill="#78adf8"/><circle cx="15" cy="10" r="2" fill="#f4c542"/></svg>'
};

function setLanguage(language) {
  document.documentElement.lang = language;
  try { localStorage.setItem('mauro-portfolio-language', language); } catch (_) {}
  try {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('lang', language);
    window.history.replaceState(null, '', pageUrl);
  } catch (_) {}
  if (navigation) {
    navigation.setAttribute('aria-label', language === 'en' ? navigation.dataset.enLabel : navigation.dataset.esLabel);
  }
  document.querySelectorAll('[data-en-label][data-es-label]').forEach((element) => {
    element.setAttribute('aria-label', language === 'en' ? element.dataset.enLabel : element.dataset.esLabel);
  });

  document.querySelectorAll('[data-en-src][data-es-src]').forEach((element) => {
    element.src = element.dataset[`${language}Src`];
  });
  document.querySelectorAll('[data-en-alt][data-es-alt]').forEach((element) => {
    element.alt = element.dataset[`${language}Alt`];
  });

  document.querySelectorAll('[data-en][data-es]').forEach((element) => {
    const value = element.dataset[language];
    const richValue = element.dataset[`${language}Html`];
    if (richValue !== undefined) {
      element.innerHTML = richValue;
    } else if (element.matches('h1, h2') && value.includes('|')) {
      const [firstLine, secondLine] = value.split('|');
      element.innerHTML = `${firstLine}<br><span class="accent">${secondLine}</span>`;
    } else if (value.includes('|')) {
      element.innerHTML = value.replace('|', '<br>');
    } else {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-en-title][data-es-title]').forEach((element) => {
    element.title = element.dataset[`${language}Title`];
  });

  const title = document.querySelector('title[data-en][data-es]');
  if (title) title.textContent = title.dataset[language];

  if (languageButton) {
    const targetLanguage = language === 'en' ? 'es' : 'en';
    languageButton.querySelector('.language-flag').innerHTML = flags[targetLanguage];
    languageButton.querySelector('.language-code').textContent = targetLanguage.toUpperCase();
    languageButton.setAttribute('aria-label', targetLanguage === 'es' ? 'Cambiar idioma a español' : 'Switch language to English');
  }
}

if (languageButton) {
  languageButton.addEventListener('click', () => {
    setLanguage(document.documentElement.lang === 'en' ? 'es' : 'en');
    if (menuButton && navigation) {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    }
  });
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  let savedLanguage = null;
  try { savedLanguage = localStorage.getItem('mauro-portfolio-language'); } catch (_) {}
  const initialLanguage = ['en', 'es'].includes(requestedLanguage) ? requestedLanguage : (['en', 'es'].includes(savedLanguage) ? savedLanguage : (document.documentElement.lang || 'en'));
  setLanguage(initialLanguage);
}

// Keep the selected language when navigating between the portfolio pages,
// including when opened from file:// where localStorage can be unavailable.
document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', () => {
    try {
      const target = new URL(link.href, window.location.href);
      const localNavigation = target.origin === window.location.origin || (target.protocol === 'file:' && window.location.protocol === 'file:');
      if (localNavigation && target.pathname !== window.location.pathname) {
        target.searchParams.set('lang', document.documentElement.lang || 'en');
        link.href = target.href;
      }
    } catch (_) {}
  });
});

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.project-gallery').forEach((gallery) => {
  const viewport = gallery.querySelector('.gallery-viewport');
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const controls = gallery.querySelector('.gallery-controls');
  const previous = gallery.querySelector('[data-gallery-prev]');
  const next = gallery.querySelector('[data-gallery-next]');
  const counter = gallery.querySelector('.gallery-count');
  if (!viewport || slides.length < 2 || !controls || !previous || !next) return;

  controls.hidden = false;
  const formatCount = (index) => `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  let currentIndex = 0;
  if (counter) counter.textContent = formatCount(currentIndex);
  const goTo = (index) => {
    const safeIndex = (index + slides.length) % slides.length;
    currentIndex = safeIndex;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({ left: slides[safeIndex].offsetLeft - slides[0].offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
    if (counter) counter.textContent = formatCount(safeIndex);
  };

  previous.addEventListener('click', () => goTo(currentIndex - 1));
  next.addEventListener('click', () => goTo(currentIndex + 1));
  viewport.addEventListener('scroll', () => {
    const nearestIndex = slides.reduce((closest, slide, index) => {
      const currentDistance = Math.abs(slide.offsetLeft - slides[0].offsetLeft - viewport.scrollLeft);
      const closestDistance = Math.abs(slides[closest].offsetLeft - slides[0].offsetLeft - viewport.scrollLeft);
      return currentDistance < closestDistance ? index : closest;
    }, 0);
    currentIndex = nearestIndex;
    if (counter) counter.textContent = formatCount(nearestIndex);
  }, { passive: true });
});
