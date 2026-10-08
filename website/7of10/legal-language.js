(() => {
  'use strict';
  const languages = ['ru', 'en'];
  const links = document.querySelectorAll('.language a');
  const articles = document.querySelectorAll('.legal-page article[lang]');
  const navigationLinks = document.querySelectorAll('a[href="../"], a[href^="../privacy/"], a[href^="../support/"]');
  const initialLanguage = document.documentElement.lang;
  const pageTitle = document.title;

  function preferredLanguage() {
    const hash = location.hash.slice(1);
    if (languages.includes(hash)) return hash;
    const query = new URLSearchParams(location.search).get('lang');
    if (languages.includes(query)) return query;
    try {
      const saved = localStorage.getItem('7of10-lang');
      if (languages.includes(saved)) return saved;
    } catch (error) { /* Browser storage can be unavailable. */ }
    return initialLanguage;
  }

  function renderLanguage(language) {
    document.documentElement.lang = language;
    articles.forEach((article) => { article.hidden = article.lang !== language; });
    links.forEach((link) => {
      if (link.lang === language) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-ru][data-en]').forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.title = language === 'ru'
      ? `${document.querySelector('h1').textContent} — 7 из 10`
      : pageTitle;
    navigationLinks.forEach((link) => {
      const base = link.getAttribute('href').split(/[?#]/)[0];
      link.setAttribute('href', base === '../' ? `../?lang=${language}` : `${base}#${language}`);
    });
  }

  links.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    try { localStorage.setItem('7of10-lang', link.lang); } catch (error) { /* Optional preference. */ }
    renderLanguage(link.lang);
  }));
  window.addEventListener('popstate', () => renderLanguage(preferredLanguage()));
  window.addEventListener('hashchange', () => renderLanguage(preferredLanguage()));
  // Legacy language anchors select content rather than a scroll destination.
  const hashLanguage = location.hash.slice(1);
  if (languages.includes(hashLanguage)) {
    const url = new URL(location.href);
    url.hash = '';
    url.searchParams.set('lang', hashLanguage);
    history.replaceState(null, '', url);
  }
  renderLanguage(preferredLanguage());
})();
