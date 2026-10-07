(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const presets = {
    gentle: { dimension: 1024, quality: 0.82 },
    balanced: { dimension: 640, quality: 0.64 },
    small: { dimension: 160, quality: 0.25 },
  };
  const results = new Map();
  let language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ru';
  let selected = 'balanced';
  let sourceSize = 0;
  const formatSize = (bytes) => `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(bytes / 1000)} kB`;

  function updateDemoText() {
    const result = results.get(selected);
    if (!result) return;
    $('#original-size').textContent = formatSize(sourceSize);
    $('#compressed-size').textContent = formatSize(result.size);
    const reduction = Math.round((1 - result.size / sourceSize) * 100);
    $('#saving-percent').textContent = `${reduction > 0 ? '−' : '+'}${Math.abs(reduction)}%`;
    const { dimension, quality } = presets[selected];
    $('#demo-note').textContent = language === 'ru'
      ? `Демо в браузере · ${dimension} × ${dimension} px · JPEG ${Math.round(quality * 100)}%. Результат в приложении может отличаться.`
      : `Browser demo · ${dimension} × ${dimension} px · JPEG ${Math.round(quality * 100)}%. App results may differ.`;
    $('#comparison-range').setAttribute('aria-valuetext', language === 'ru'
      ? `${$('#comparison-range').value}% оригинала`
      : `${$('#comparison-range').value}% original`);
  }

  function setLanguage(next, updateURL = false) {
    language = next;
    document.documentElement.lang = next;
    document.querySelectorAll('[data-ru]').forEach((element) => { element.textContent = element.dataset[next]; });
    document.querySelectorAll('[data-alt-ru]').forEach((element) => { element.alt = element.dataset[next === 'ru' ? 'altRu' : 'altEn']; });
    document.querySelectorAll('[data-label-ru]').forEach((element) => { element.setAttribute('aria-label', element.dataset[next === 'ru' ? 'labelRu' : 'labelEn']); });
    document.querySelectorAll('[data-language]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.language === next)); });
    document.title = next === 'ru' ? '7 of 10 — меньше вес, больше свободы' : '7 of 10 — lighter photos, more possibilities';
    $('meta[name="description"]').content = next === 'ru'
      ? '7 of 10 — сжимайте фотографии на iPhone и iPad. Настройте размер, сравните детали и сохраните JPEG-копию. Всё на вашем устройстве.'
      : '7 of 10 — compress photos on iPhone and iPad. Choose a size, compare the details, and save a JPEG copy. All on your device.';
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      history.replaceState(null, '', url);
    }
    updateDemoText();
  }

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language, true));
  });
  $('#comparison-range').addEventListener('input', (event) => {
    $('#comparison').style.setProperty('--split', `${event.target.value}%`);
    updateDemoText();
  });
  function selectPreset(name) {
    const result = results.get(name);
    if (!result) return;
    selected = name;
    $('#demo-compressed').src = result.url;
    document.querySelectorAll('[data-preset]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.preset === name));
    });
    updateDemoText();
  }
  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => selectPreset(button.dataset.preset));
  });
  setLanguage(language);

  async function prepareDemo() {
    const original = $('#demo-original');
    await original.decode();
    const response = await fetch(original.currentSrc, { cache: 'force-cache' });
    if (!response.ok) throw new Error('Demo image unavailable');
    sourceSize = (await response.blob()).size;
    for (const [name, preset] of Object.entries(presets)) {
      const canvas = document.createElement('canvas');
      canvas.width = preset.dimension;
      canvas.height = preset.dimension;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(original, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', preset.quality));
      if (!blob) throw new Error('JPEG encoding unavailable');
      results.set(name, { size: blob.size, url: URL.createObjectURL(blob) });
    }
    selectPreset(selected);
    await $('#demo-compressed').decode();
    ['#demo-compressed', '.image-label-result', '.comparison-divider', '#comparison-range', '.saving', '.demo-controls'].forEach((selector) => { $(selector).hidden = false; });
  }
  prepareDemo().catch(() => {
    // Keep the original photograph and readable page when the demo is unavailable.
    for (const result of results.values()) URL.revokeObjectURL(result.url);
    results.clear();
    $('#demo-note').textContent = language === 'ru'
      ? 'Интерактивное сравнение недоступно. Посмотрите реальные экраны приложения ниже.'
      : 'Interactive comparison is unavailable. Explore the real app screens below.';
  });
})();
