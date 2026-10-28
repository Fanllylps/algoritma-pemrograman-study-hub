import { course, courseMeta } from './courseData.js';
import { getTraceSteps, renderInlineVisual, renderVisuals as renderAlgorithmVisuals } from './visualizations.js';

const app = document.querySelector('#app-main');
const nav = document.querySelector('#module-nav');
const overlay = document.querySelector('#search-overlay');
const searchInput = document.querySelector('#global-search');
const searchResults = document.querySelector('#search-results');
const readKey = 'algo-study-progress-v1';
const themeKey = 'algo-study-theme-v1';

const savedRead = JSON.parse(localStorage.getItem(readKey) || '[]');
const state = {
  active: null,
  cheat: false,
  readingMode: localStorage.getItem('algo-reading-mode-v1') === 'true',
  readingSize: Math.min(1.3, Math.max(1, Number(localStorage.getItem('algo-reading-size-v1')) || 1)),
  activeSection: 0,
  read: new Set(savedRead),
  theme: localStorage.getItem(themeKey) || 'light',
  ui: { coffeeStep: 0, characteristic: 'input', scenario: 'nasi', decompositionStep: 0, pillar: 'decomposition', stage: 0, dataType: 'int', variableName: 'umur', variableValue: '20', variableNext: '21', left: 7, right: 2, operator: '%', operatorFamily: 'arithmetic', example: 'sequence', flowNode: 0, symbol: 'terminator', price: 200000, quantity: 2, discount: 10, ipoRun: false, ipoStage: 0, pblStage: 0, ifValue: 75, ifThreshold: 60, condition: 'simple', boolA: true, boolB: false, boolOperator: 'and', branchType: 'elif', branchTotal: 250000, member: true, gradeValue: 76, traceStep: 0 },
  flash: {}, quiz: {}, searchItems: [], searchCursor: -1,
};

const $ = (selector, root = document) => root.querySelector(selector);
const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const currentModule = () => course.find(item => item.id === state.active);
const icon = name => {
  const paths = {
    sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    moon: '<path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.6 8.6 0 1 0 20.4 15.2Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.check}</svg>`;
};

function progressFor(mod) {
  const count = mod.sections.length;
  const done = mod.sections.reduce((n, _, i) => n + (state.read.has(`${mod.id}:${i}`) ? 1 : 0), 0);
  return Math.round(done / count * 100);
}

function overallProgress() {
  const total = course.reduce((sum, mod) => sum + mod.sections.length, 0);
  const done = state.read.size;
  return Math.round(done / total * 100);
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('#theme-icon').innerHTML = icon(state.theme === 'light' ? 'moon' : 'sun');
  document.querySelector('meta[name="theme-color"]').content = state.theme === 'light' ? '#f8f7f4' : '#0f1012';
}

function renderNav() {
  nav.innerHTML = course.map(mod => {
    const percent = progressFor(mod);
    return `<button class="module-link ${state.active === mod.id ? 'active' : ''}" data-action="module" data-module="${mod.id}" aria-current="${state.active === mod.id ? 'page' : 'false'}">
      <span class="module-number">${mod.no}</span><span class="module-name"><strong>${esc(mod.title)}</strong><span>${esc(mod.short)}</span></span><span class="module-percent">${percent}%</span>
      <span class="module-progress"><span style="width:${percent}%"></span></span>
    </button>`;
  }).join('');
  const overall = overallProgress();
  $('#overall-progress-label').textContent = `${overall}%`;
  $('#overall-progress-bar').style.width = `${overall}%`;
}

function setBreadcrumb() {
  const crumb = $('#breadcrumbs');
  const mod = currentModule();
  crumb.innerHTML = `<span>RUANG BELAJAR</span><i>/</i><span>${mod ? `${mod.no} · ${esc(mod.title).toUpperCase()}` : 'OVERVIEW'}</span>`;
}

function renderDashboard() {
  document.querySelector('.side-home')?.classList.add('active');
  const overall = overallProgress();
  const next = course.find(mod => progressFor(mod) < 100) || course[0];
  const completed = course.filter(mod => progressFor(mod) === 100).length;
  app.innerHTML = `
    <section class="dashboard-head">
      <div><div class="eyebrow">${esc(courseMeta.title).toUpperCase()} <span>·</span> 7 PERTEMUAN</div><h1>Ruang belajar</h1><p>Tujuh pertemuan materi, visualisasi interaktif, dan perangkat uji pemahaman untuk belajar algoritma secara bertahap.</p></div>
      <div class="course-code"><strong>${courseMeta.author}</strong>Materi perkuliahan<br/>7 modul pembelajaran</div>
    </section>
    <section class="dashboard-bento" aria-label="Ringkasan progres">
      <div class="overview-panel"><div class="overview-copy"><div class="mono-label">PROGRES BELAJAR</div><h2>${completed ? `${completed} dari 7 modul selesai` : 'Progres Anda tersimpan di sini'}</h2><p>Bagian yang Anda tandai selesai disimpan otomatis pada perangkat ini. Buka modul untuk membaca materi dan mencoba simulasinya.</p></div><div class="overall-ring" style="--progress:${overall}%"><strong>${overall}%</strong></div></div>
      <div class="overview-side"><div><div class="mono-label">LANJUTKAN BELAJAR</div><strong>${esc(next.title)}</strong><p>Pertemuan ${next.no} · ${progressFor(next)}% selesai dibaca</p></div><button class="text-link" data-action="module" data-module="${next.id}">Buka materi <span>↗</span></button></div>
    </section>
    <section aria-labelledby="module-list-title"><div class="module-index-head"><h2 id="module-list-title">Daftar materi</h2><span>01 — 07 / PERTEMUAN</span></div><ol class="dashboard-module-list">${course.map(mod => {
      const percent = progressFor(mod);
      return `<li class="dashboard-module" role="button" tabindex="0" data-action="module" data-module="${mod.id}"><span class="dash-number">${mod.no}</span><span class="dash-title"><strong>${esc(mod.title)}</strong><span>${mod.sections.length} topik · visualisasi, flashcards & kuis</span></span><span class="dash-outcome">${esc(mod.outcome)}</span><span class="dash-progress">${percent}%<i><span style="width:${percent}%"></span></i></span><span class="dash-arrow">↗</span></li>`;
    }).join('')}</ol></section>
    <div class="dashboard-note"><span><strong>Cara memakai ruang belajar</strong> — pilih topik, tandai bagian yang selesai dibaca, coba simulasi, lalu uji ingatan melalui flashcards dan kuis.</span><span>Materi lengkap <strong>${course.reduce((n, mod) => n + mod.sections.length, 0)} subbab</strong></span></div>`;
}

function renderModule() {
  const mod = currentModule();
  if (!mod) return renderDashboard();
  const percent = progressFor(mod);
  const quick = state.cheat;
  app.innerHTML = `
    <article class="module-page accent-${mod.accent} ${state.readingMode ? 'reading-mode' : ''}">
      <header class="module-head">
        <div class="module-head-top"><div class="eyebrow">PERTEMUAN ${mod.no} <span>·</span> ${mod.sections.length} TOPIK</div><div class="visual-label">${percent}% SELESAI DIBACA</div></div>
        <h1>${esc(mod.title)}</h1><p class="module-outcome"><b>CAPAIAN</b><span>${esc(mod.outcome)}</span></p><div class="module-source">${esc(mod.source)}</div>
      </header>
      <div class="module-toolbar"><div class="view-toggle" role="group" aria-label="Tampilan materi"><button class="${!quick ? 'active' : ''}" data-action="view-full">Materi lengkap</button><button class="${quick ? 'active' : ''}" data-action="view-cheat">Ringkasan ujian</button></div><div class="module-toolbar-tools"><div class="reading-controls" role="group" aria-label="Kontrol keterbacaan"><button class="reading-size-button" data-action="reading-size-down" aria-label="Kecilkan teks" ${state.readingSize <= 1 ? 'disabled' : ''}>A−</button><span class="reading-size-label">${Math.round(state.readingSize * 100)}%</span><button class="reading-size-button" data-action="reading-size-up" aria-label="Besarkan teks" ${state.readingSize >= 1.3 ? 'disabled' : ''}>A+</button><button class="focus-mode-button ${state.readingMode ? 'active' : ''}" data-action="reading-mode" aria-pressed="${state.readingMode}">Baca fokus</button></div><button class="complete-button ${percent === 100 ? 'done' : ''}" data-action="complete-module" data-module="${mod.id}">${icon('check')}<span>${percent === 100 ? 'Tandai belum selesai' : 'Tandai modul selesai'}</span></button></div></div>
      ${quick ? `<section class="quick-sheet"><div class="quick-sheet-title"><div class="mono-label">RINGKASAN CEPAT</div><h2>Yang perlu diingat.</h2><p>Inti materi ${mod.no} dalam poin ringkas.</p></div><ul class="quick-list">${mod.summary.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>` : `${renderSectionNav(mod)}<section class="module-visuals" id="module-visuals"><div class="section-kicker">VISUALISASI & EKSPLORASI</div><div class="visual-reading-key" aria-label="Kunci membaca diagram"><span><i class="legend-dot input"></i>Masukan</span><span><i class="legend-dot process"></i>Proses</span><span><i class="legend-dot decision"></i>Keputusan</span><span><i class="legend-dot output"></i>Hasil</span><span class="key-arrow">→ urutan alur</span></div>${renderVisuals(mod)}</section>
      <section class="reading-content" aria-label="Materi lengkap">${mod.sections.map((section, i) => renderSection(mod, section, i)).join('')}</section>
      ${mod.references?.length ? `<details class="references"><summary>Rujukan materi · ${mod.references.length} sumber</summary><ol>${mod.references.map(item => `<li>${esc(item)}</li>`).join('')}</ol></details>` : ''}
        ${renderRecall(mod)}`}
    </article>`;
  app.style.setProperty('--reading-scale', state.readingSize);
  setupSectionNavigation();
}

function renderSectionNav(mod) {
  return `<nav class="section-navigator" aria-label="Navigasi topik dalam modul"><div class="section-nav-top"><span class="mono-label">JALUR MATERI</span><span class="section-nav-position" id="section-nav-position">01 / ${String(mod.sections.length).padStart(2, '0')}</span></div><div class="section-nav-items">${mod.sections.map((section, i) => `<button class="section-nav-item ${i === state.activeSection ? 'active' : ''} ${state.read.has(`${mod.id}:${i}`) ? 'done' : ''}" data-action="jump-section" data-index="${i}" aria-current="${i === state.activeSection ? 'location' : 'false'}"><span>${String(i + 1).padStart(2, '0')}</span><strong>${esc(section.title)}</strong><i aria-hidden="true">${state.read.has(`${mod.id}:${i}`) ? '✓' : ''}</i></button>`).join('')}</div><div class="section-progress-track" role="progressbar" aria-label="Progres membaca modul" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="section-progress-fill"></span></div></nav>`;
}

function renderSection(mod, section, i) {
  const key = `${mod.id}:${i}`;
  const done = state.read.has(key);
  return `<section class="content-section" id="${mod.id}-section-${i}">
    <header class="content-section-head"><div><span class="section-number">${mod.no}.${String(i + 1).padStart(2, '0')}</span><h2>${esc(section.title)}</h2></div><span class="slides">SLIDE ${esc(section.slides)}</span></header>
    <p class="section-intro">${esc(section.intro)}</p>
    ${renderInlineVisual(mod, i)}
    <div class="concept-list">${section.concepts.map(concept => `<div class="concept-item"><div class="concept-title"><h3>${esc(concept.name)}</h3><span>Konsep inti</span></div><div class="concept-body">${[
      ['Definisi inti', concept.definition, ''], ['Cara kerja / mekanisme', concept.mechanism, ''], ['Contoh nyata', concept.example, ''], ['Poin kunci ujian', concept.takeaway, 'takeaway']
    ].map(([label, text, cls]) => `<div class="concept-detail ${cls}"><strong>${label}</strong><p>${esc(text)}</p></div>`).join('')}</div></div>`).join('')}</div>
    ${section.exercise ? `<div class="section-exercise"><strong>Latihan dari materi</strong>${esc(section.exercise)}</div>` : ''}
    <div class="section-complete-line"><button class="mark-section ${done ? 'done' : ''}" data-action="mark-section" data-key="${key}">${done ? '✓ Selesai dibaca' : '+ Tandai selesai dibaca'}</button></div>
  </section>`;
}

function setActiveSection(index) {
  const mod = currentModule();
  if (!mod) return;
  state.activeSection = Math.max(0, Math.min(mod.sections.length - 1, index));
  document.querySelectorAll('.section-nav-item').forEach((button, i) => {
    const active = i === state.activeSection;
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'location' : 'false');
  });
  const position = $('#section-nav-position');
  if (position) position.textContent = `${String(state.activeSection + 1).padStart(2, '0')} / ${String(mod.sections.length).padStart(2, '0')}`;
}

function updateSectionNavigation() {
  const sections = [...document.querySelectorAll('.content-section')];
  if (!sections.length) return;
  const nav = $('.section-navigator');
  const line = ($('.topbar')?.offsetHeight || 60) + (nav?.offsetHeight || 65) + 24;
  let current = sections.findIndex(section => {
    const box = section.getBoundingClientRect();
    return box.top <= line && box.bottom > line;
  });
  if (current < 0) {
    const passed = sections.map(section => section.getBoundingClientRect().top <= line);
    current = passed.lastIndexOf(true);
    if (current < 0) current = 0;
  }
  if (current !== state.activeSection) setActiveSection(current);
  const start = sections[0].getBoundingClientRect().top + window.scrollY;
  const end = sections.at(-1).getBoundingClientRect().bottom + window.scrollY;
  const progress = Math.max(0, Math.min(100, ((window.scrollY + line - start) / Math.max(1, end - start)) * 100));
  const fill = $('#section-progress-fill');
  const track = $('.section-progress-track');
  if (fill) fill.style.width = `${progress}%`;
  if (track) track.setAttribute('aria-valuenow', String(Math.round(progress)));
}

function setupSectionNavigation() {
  if (!document.querySelector('.content-section')) return;
  updateSectionNavigation();
  requestAnimationFrame(updateSectionNavigation);
}

let sectionScrollQueued = false;
window.addEventListener('scroll', () => {
  if (sectionScrollQueued) return;
  sectionScrollQueued = true;
  requestAnimationFrame(() => {
    sectionScrollQueued = false;
    updateSectionNavigation();
  });
}, { passive: true });

function renderRecall(mod) {
  return `<section class="recall-section" id="recall"><div class="recall-head"><div><div class="eyebrow">ACTIVE RECALL · PERTEMUAN ${mod.no}</div><h2>Uji pemahaman</h2></div><p>Ingat kembali sebelum membuka jawaban.</p></div>
    <div class="flashcard-row">${mod.flashcards.map(([front, back], i) => {
      const flipped = Boolean(state.flash[`${mod.id}:${i}`]);
      return `<button class="flashcard ${flipped ? 'flipped' : ''}" data-action="flashcard" data-index="${i}"><span class="flash-label">${flipped ? 'JAWABAN · KLIK UNTUK BALIK' : `FLASHCARD ${String(i + 1).padStart(2, '0')} · KLIK UNTUK BUKA`}</span><span class="flash-content">${esc(flipped ? back : front)}</span></button>`;
    }).join('')}</div>
    <div class="quiz-wrap"><div class="quiz-heading"><h3>Mini quiz</h3><span>${mod.quiz.length} SOAL · PILIHAN GANDA</span></div>${mod.quiz.map((item, qi) => {
      const answer = state.quiz[`${mod.id}:${qi}`];
      return `<div class="quiz-item"><span class="quiz-num">${String(qi + 1).padStart(2, '0')}</span><div><p class="quiz-question">${esc(item.q)}</p><div class="quiz-options">${item.options.map((option, oi) => {
        const selected = answer === oi;
        const cls = selected ? (oi === item.answer ? 'selected-correct' : 'selected-wrong') : '';
        return `<button class="quiz-option ${cls}" data-action="quiz-answer" data-q="${qi}" data-option="${oi}"><span class="option-marker">${String.fromCharCode(65 + oi)}</span><span>${esc(option)}</span></button>`;
      }).join('')}</div>${answer !== undefined ? `<div class="quiz-feedback ${answer === item.answer ? 'correct' : 'incorrect'}"><strong>${answer === item.answer ? 'Tepat.' : `Belum tepat. Jawaban: ${String.fromCharCode(65 + item.answer)}.`}</strong> ${esc(item.why)}</div>` : ''}</div></div>`;
    }).join('')}</div></section>`;
}

function renderVisuals(mod) {
  return renderAlgorithmVisuals(mod, state.ui);
}

// Search indexes the source-derived teaching material, not only module headings.
function buildSearchIndex() {
  const items = [];
  for (const mod of course) {
    items.push({ module: mod.id, section: null, title: mod.title, text: mod.outcome, kind: `PERTEMUAN ${mod.no}` });
    (mod.references || []).forEach(reference => items.push({ module: mod.id, section: null, title: reference, text: `Rujukan materi ${mod.title}`, kind: `RUJUKAN · ${mod.no}` }));
    mod.sections.forEach((section, i) => {
      items.push({ module: mod.id, section: i, title: section.title, text: section.intro, kind: `SUBBAB · SLIDE ${section.slides}` });
      section.concepts.forEach(concept => items.push({ module: mod.id, section: i, title: concept.name, text: `${concept.definition} ${concept.mechanism} ${concept.example}`, kind: `DEFINISI · ${mod.no}` }));
    });
    for (const key of ['types', 'operatorSets', 'characteristics', 'pillars', 'stages', 'examples', 'symbols', 'conditions', 'branches', 'discountTiers']) {
      (mod[key] || []).forEach(item => items.push({ module: mod.id, section: 0, title: item.name || item.label || item.title || item.id, text: Object.values(item).filter(value => typeof value === 'string').join(' '), kind: `LATIHAN · ${mod.no}` }));
    }
  }
  return items;
}
state.searchItems = buildSearchIndex();

function showSearch() {
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false');
  searchInput.value = ''; searchResults.innerHTML = '<p class="search-hint">Ketik untuk mencari di seluruh materi.</p>'; state.searchCursor = -1;
  requestAnimationFrame(() => searchInput.focus());
}
function hideSearch() { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true'); }
function doSearch(query) {
  const term = query.trim().toLocaleLowerCase('id');
  if (!term) { searchResults.innerHTML = '<p class="search-hint">Ketik untuk mencari di seluruh materi.</p>'; return; }
  const results = state.searchItems.filter(item => `${item.title} ${item.text} ${item.kind}`.toLocaleLowerCase('id').includes(term)).slice(0, 24);
  if (!results.length) { searchResults.innerHTML = '<p class="search-hint">Tidak ditemukan. Coba “pseudocode”, “operator”, “IPO”, atau “percabangan”.</p>'; return; }
  searchResults.innerHTML = results.map((item, i) => {
    const mod = course.find(m => m.id === item.module);
    return `<button class="search-result ${i === 0 ? 'active' : ''}" data-action="search-result" data-module="${mod.id}" data-section="${item.section ?? ''}"><span class="result-number">${mod.no}</span><span class="result-text"><strong>${esc(item.title)}</strong><span>${esc(item.kind)} · ${esc(item.text.slice(0, 145))}</span></span></button>`;
  }).join('');
  state.searchCursor = 0;
}

function updateNavAndDashboard() {
  renderNav();
  if (!state.active) renderDashboard();
  else if (currentModule()) {
    const headProgress = $('.module-head-top .visual-label');
    if (headProgress) headProgress.textContent = `${progressFor(currentModule())}% SELESAI DIBACA`;
    const complete = $('.complete-button');
    if (complete) {
      const percent = progressFor(currentModule());
      complete.classList.toggle('done', percent === 100);
      complete.innerHTML = `${icon('check')}<span>${percent === 100 ? 'Tandai belum selesai' : 'Tandai modul selesai'}</span>`;
    }
  }
}

function openModule(moduleId, section = null) {
  if (!course.some(mod => mod.id === moduleId)) return;
  if (state.active !== moduleId) state.ui.traceStep = 0;
  state.active = moduleId; state.cheat = false;
  state.activeSection = section === null || section === '' ? 0 : Number(section);
  renderNav(); setBreadcrumb(); renderModule();
  document.querySelectorAll('.side-home').forEach(el => el.classList.remove('active'));
  closeSidebar();
  if (section !== null && section !== '') {
    requestAnimationFrame(() => document.getElementById(`${moduleId}-section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  } else window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openDashboard() {
  state.active = null; state.cheat = false;
  document.querySelectorAll('.side-home').forEach(el => el.classList.add('active'));
  renderNav(); setBreadcrumb(); renderDashboard(); closeSidebar(); window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateVisuals() {
  const mod = currentModule();
  const root = $('#module-visuals');
  if (mod && root) root.innerHTML = `<div class="section-kicker">VISUALISASI & EKSPLORASI</div>${renderVisuals(mod)}`;
}

function applyReadingSize() {
  app.style.setProperty('--reading-scale', state.readingSize);
  const label = $('.reading-size-label');
  if (label) label.textContent = `${Math.round(state.readingSize * 100)}%`;
  const down = $('[data-action="reading-size-down"]');
  const up = $('[data-action="reading-size-up"]');
  if (down) down.disabled = state.readingSize <= 1;
  if (up) up.disabled = state.readingSize >= 1.3;
  requestAnimationFrame(updateSectionNavigation);
}

function closeSidebar() {
  $('#sidebar').classList.remove('open'); $('#sidebar-scrim').classList.remove('open');
}
function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 1700);
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'dashboard') { openDashboard(); return; }
  if (action === 'module') { openModule(button.dataset.module); return; }
  if (action === 'open-sidebar') { $('#sidebar').classList.add('open'); $('#sidebar-scrim').classList.add('open'); return; }
  if (action === 'close-sidebar') { closeSidebar(); return; }
  if (action === 'open-search') { showSearch(); return; }
  if (action === 'close-search') { hideSearch(); return; }
  if (action === 'theme') { state.theme = state.theme === 'light' ? 'dark' : 'light'; localStorage.setItem(themeKey, state.theme); applyTheme(); return; }
  if (action === 'view-full') { state.cheat = false; renderModule(); return; }
  if (action === 'view-cheat') { state.cheat = true; renderModule(); return; }
  if (action === 'reading-mode') {
    state.readingMode = !state.readingMode;
    localStorage.setItem('algo-reading-mode-v1', String(state.readingMode));
    $('.module-page')?.classList.toggle('reading-mode', state.readingMode);
    button.classList.toggle('active', state.readingMode);
    button.setAttribute('aria-pressed', String(state.readingMode));
    requestAnimationFrame(updateSectionNavigation);
    return;
  }
  if (action === 'reading-size-down' || action === 'reading-size-up') {
    state.readingSize = Math.min(1.3, Math.max(1, Math.round((state.readingSize + (action === 'reading-size-up' ? 0.1 : -0.1)) * 10) / 10));
    localStorage.setItem('algo-reading-size-v1', String(state.readingSize));
    applyReadingSize();
    return;
  }
  if (action === 'jump-section') {
    const index = Number(button.dataset.index);
    setActiveSection(index);
    document.getElementById(`${state.active}-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (action === 'mark-section') {
    const key = button.dataset.key;
    state.read.has(key) ? state.read.delete(key) : state.read.add(key);
    localStorage.setItem(readKey, JSON.stringify([...state.read]));
    button.classList.toggle('done', state.read.has(key));
    button.innerHTML = state.read.has(key) ? '✓ Selesai dibaca' : '+ Tandai selesai dibaca';
    $(`.section-nav-item[data-index="${key.split(':')[1]}"]`)?.classList.toggle('done', state.read.has(key));
    updateNavAndDashboard(); return;
  }
  if (action === 'complete-module') {
    const mod = course.find(item => item.id === button.dataset.module);
    if (!mod) return;
    const allDone = progressFor(mod) === 100;
    mod.sections.forEach((_, i) => allDone ? state.read.delete(`${mod.id}:${i}`) : state.read.add(`${mod.id}:${i}`));
    localStorage.setItem(readKey, JSON.stringify([...state.read]));
    renderNav(); renderModule(); toast(allDone ? 'Progres modul diatur ulang.' : 'Modul ditandai selesai.'); return;
  }
  if (action === 'coffee-step') { state.ui.coffeeStep = Number(button.dataset.value); updateVisuals(); return; }
  if (action === 'coffee-next') { state.ui.coffeeStep = Math.min(4, Number(state.ui.coffeeStep) + 1); updateVisuals(); return; }
  if (action === 'coffee-prev') { state.ui.coffeeStep = Math.max(0, Number(state.ui.coffeeStep) - 1); updateVisuals(); return; }
  if (action === 'characteristic') { state.ui.characteristic = button.dataset.value; updateVisuals(); return; }
  if (action === 'scenario') { state.ui.scenario = button.dataset.value; state.ui.decompositionStep = 0; updateVisuals(); return; }
  if (action === 'decomposition-step') { state.ui.decompositionStep = Number(button.dataset.value); updateVisuals(); return; }
  if (action === 'pillar') { state.ui.pillar = button.dataset.value; updateVisuals(); return; }
  if (action === 'stage') { state.ui.stage = Number(button.dataset.value); updateVisuals(); return; }
  if (action === 'data-type') { state.ui.dataType = button.dataset.value; updateVisuals(); return; }
  if (action === 'assign-variable') { state.ui.variableValue = state.ui.variableNext; updateVisuals(); return; }
  if (action === 'operator-family') {
    state.ui.operatorFamily = button.dataset.value;
    state.ui.operator = { arithmetic: '%', relational: '>=', logical: 'and' }[button.dataset.value];
    updateVisuals(); return;
  }
  if (action === 'operator') { state.ui.operator = button.dataset.value; updateVisuals(); return; }
  if (action === 'bool-toggle') { const key = button.dataset.value; state.ui[key] = !state.ui[key]; updateVisuals(); return; }
  if (action === 'flow-example') { state.ui.example = button.dataset.value; state.ui.flowNode = 0; updateVisuals(); return; }
  if (action === 'flow-node') { state.ui.flowNode = Number(button.dataset.value); updateVisuals(); return; }
  if (action === 'flow-symbol') { state.ui.symbol = button.dataset.value; updateVisuals(); return; }
  if (action === 'run-ipo') { state.ui.ipoRun = true; updateVisuals(); return; }
  if (action === 'ipo-stage') { state.ui.ipoStage = Number(button.dataset.value); updateVisuals(); return; }
  if (action === 'pbl-stage') { state.ui.pblStage = Number(button.dataset.value); updateVisuals(); return; }
  if (action === 'simulate-if') { updateVisuals(); return; }
  if (action === 'condition') { state.ui.condition = button.dataset.value; updateVisuals(); return; }
  if (action === 'bool-operator') { state.ui.boolOperator = button.dataset.value; updateVisuals(); return; }
  if (action === 'branch-type') { state.ui.branchType = button.dataset.value; updateVisuals(); return; }
  if (action === 'member-toggle') { state.ui.member = !state.ui.member; updateVisuals(); return; }
  if (action === 'simulate-branch' || action === 'simulate-grade' || action === 'calculate-operator') { updateVisuals(); return; }
  if (action === 'trace-reset' || action === 'trace-prev' || action === 'trace-next' || action === 'trace-set') {
    const mod = currentModule();
    const steps = mod ? getTraceSteps(mod, state.ui) : [];
    const current = Math.max(0, Math.min(steps.length - 1, Number(state.ui.traceStep) || 0));
    if (action === 'trace-reset') state.ui.traceStep = 0;
    if (action === 'trace-prev') state.ui.traceStep = Math.max(0, current - 1);
    if (action === 'trace-next') state.ui.traceStep = Math.min(steps.length - 1, current + 1);
    if (action === 'trace-set') state.ui.traceStep = Math.max(0, Math.min(steps.length - 1, Number(button.dataset.value)));
    updateVisuals(); return;
  }
  if (action === 'flashcard') {
    const key = `${state.active}:${button.dataset.index}`;
    state.flash[key] = !state.flash[key];
    const recall = $('#recall'); if (recall) recall.innerHTML = renderRecall(currentModule()).replace(/^<section[^>]*>|<\/section>$/g, '');
    return;
  }
  if (action === 'quiz-answer') {
    const key = `${state.active}:${button.dataset.q}`;
    state.quiz[key] = Number(button.dataset.option);
    const quizWrap = $('.quiz-wrap');
    if (quizWrap) {
      const mod = currentModule();
      const fresh = renderRecall(mod);
      const temp = document.createElement('div'); temp.innerHTML = fresh;
      const newQuiz = $('.quiz-wrap', temp); quizWrap.innerHTML = newQuiz.innerHTML;
    }
    return;
  }
  if (action === 'search-result') {
    const moduleId = button.dataset.module;
    const section = button.dataset.section;
    hideSearch(); openModule(moduleId, section === '' ? null : section); return;
  }
});

document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); showSearch(); return; }
  if (event.key === 'Escape') { hideSearch(); closeSidebar(); return; }
  if (event.key === 'Enter' && event.target.matches('.dashboard-module')) { openModule(event.target.dataset.module); }
  if (overlay.classList.contains('open') && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    const list = [...searchResults.querySelectorAll('.search-result')];
    if (!list.length) return;
    state.searchCursor = (state.searchCursor + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
    list.forEach((item, i) => item.classList.toggle('active', i === state.searchCursor));
    list[state.searchCursor].scrollIntoView({ block: 'nearest' });
  }
  if (overlay.classList.contains('open') && event.key === 'Enter') {
    const active = searchResults.querySelector('.search-result.active'); if (active) active.click();
  }
});
searchInput.addEventListener('input', event => doSearch(event.target.value));
document.addEventListener('input', event => {
  const field = event.target.closest('[data-state]');
  if (field) state.ui[field.dataset.state] = field.value;
});

applyTheme(); renderNav(); setBreadcrumb(); renderDashboard();
