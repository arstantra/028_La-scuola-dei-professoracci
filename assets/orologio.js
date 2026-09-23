/* ============================================================
   LA SCUOLA DEI PROFESSORACCI — orologio da parete a lancette
   Script classico (no module): funziona anche da file://
   Espone window.Orologio.monta(elemento)

   Tre modalità, tutte rigorosamente a lancette:
   - ORA         ore, minuti e secondi veri
   - CRONOMETRO  lancetta blu dei secondi dalle 12 + quadrantino
                 dei minuti (0-60) in basso
   - TIMER       conto alla rovescia visivo: lo spicchio rosso
                 è il tempo che resta e si restringe verso le 12
                 (come i timer visivi usati per il sostegno)
   Lo stato resta in sessionStorage: passando dal registro e
   tornando in aula il cronometro/timer continua.
   ============================================================ */
(function () {
'use strict';

var SS = 'professoracci_orologio';
var LS_PREF = 'professoracci_timer';   // { auto: bool, dur: ms } — preferenza che resta
function pref() {
  try { var p = JSON.parse(localStorage.getItem(LS_PREF) || 'null'); if (p && p.dur) return p; } catch (e) {}
  return { auto: false, dur: 120000 };
}
function salvaPref(p) { try { localStorage.setItem(LS_PREF, JSON.stringify(p)); } catch (e) {} }
var NS = 'http://www.w3.org/2000/svg';
var C = 100, R_FACE = 86;
var TIMER_MIN = [1, 2, 3, 5, 10];

function el(tag, attrs, parent) {
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function polar(r, deg) {
  var a = (deg - 90) * Math.PI / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}
/* spicchio dalle 12 in senso orario fino a deg */
function spicchio(r, deg) {
  if (deg <= 0.05) return '';
  if (deg >= 359.95) return 'M' + C + ',' + (C - r) + ' A' + r + ',' + r + ' 0 1 1 ' + (C - 0.01) + ',' + (C - r) + ' Z';
  var p = polar(r, deg);
  return 'M' + C + ',' + C + ' L' + C + ',' + (C - r) +
    ' A' + r + ',' + r + ' 0 ' + (deg > 180 ? 1 : 0) + ' 1 ' + p[0].toFixed(2) + ',' + p[1].toFixed(2) + ' Z';
}
function calma() { return document.body.classList.contains('calma'); }

/* ---------- stato ---------- */
function stato0() { return { modo: 'ora', corre: false, acc: 0, t0: 0, dur: 120000, finito: false }; }
function leggi() {
  try { var s = JSON.parse(sessionStorage.getItem(SS) || 'null'); if (s && s.modo) return s; } catch (e) {}
  return stato0();
}
function scrivi(s) { try { sessionStorage.setItem(SS, JSON.stringify(s)); } catch (e) {} }
function trascorso(s) { return s.acc + (s.corre ? Date.now() - s.t0 : 0); }

/* ---------- campanella di fine timer ---------- */
var actx = null;
function campanella() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    actx = actx || new AC();
    if (actx.state === 'suspended') actx.resume();
    var vol = calma() ? 0.12 : 0.3;
    [0, 0.45, 0.9].forEach(function (d) {
      [880, 1320].forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + d;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol / (i + 1), t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 1.2);
      });
    });
  } catch (e) {}
}

/* ---------- disegno del quadrante ---------- */
function quadrante(svg) {
  var defs = el('defs', {}, svg);
  var lg = el('linearGradient', { id: 'orl-legno', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  el('stop', { offset: '0', 'stop-color': '#a8773f' }, lg);
  el('stop', { offset: '.55', 'stop-color': '#6b4423' }, lg);
  el('stop', { offset: '1', 'stop-color': '#84582e' }, lg);
  var rg = el('radialGradient', { id: 'orl-vetro', cx: '.35', cy: '.3', r: '.8' }, defs);
  el('stop', { offset: '0', 'stop-color': '#fff', 'stop-opacity': '.55' }, rg);
  el('stop', { offset: '.5', 'stop-color': '#fff', 'stop-opacity': '0' }, rg);

  el('circle', { cx: C, cy: C + 3, r: 97, fill: 'rgba(0,0,0,.22)' }, svg);          // ombra sul muro
  el('circle', { cx: C, cy: C, r: 97, fill: 'url(#orl-legno)' }, svg);               // cornice
  el('circle', { cx: C, cy: C, r: R_FACE + 2, fill: '#4a2d15' }, svg);
  el('circle', { cx: C, cy: C, r: R_FACE, fill: '#fffcf2' }, svg);                   // quadrante

  var o = {};
  o.settore = el('path', { d: '', fill: '#e2574c', 'fill-opacity': '.85' }, svg);

  var tacche = el('g', {}, svg);
  for (var i = 0; i < 60; i++) {
    var ora = i % 5 === 0;
    var a = polar(R_FACE - 3, i * 6), b = polar(R_FACE - (ora ? 15 : 8), i * 6);
    el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#3a2c18',
      'stroke-width': ora ? 4 : 1.6, 'stroke-linecap': ora ? 'butt' : 'round' }, tacche);
  }
  o.numeri = el('g', { 'font-family': 'Fredoka, Nunito, sans-serif', 'font-weight': 600, 'font-size': 17,
    fill: '#3a2c18', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, svg);
  for (var n = 1; n <= 12; n++) {
    var p = polar(R_FACE - 27, n * 30);
    el('text', { x: p[0].toFixed(1), y: (p[1] + 0.5).toFixed(1) }, o.numeri).textContent = n;
  }
  o.etichetta = el('text', { x: C, y: 64, 'text-anchor': 'middle', 'font-family': 'Fredoka, sans-serif',
    'font-weight': 700, 'font-size': 9, 'letter-spacing': 1.5, fill: '#b8923f' }, svg);

  /* quadrantino dei minuti del cronometro (0-60) */
  o.sub = el('g', {}, svg);
  el('circle', { cx: C, cy: 138, r: 17, fill: '#eef3f9', stroke: '#3b6ea5', 'stroke-width': 1.6 }, o.sub);
  for (var k = 0; k < 12; k++) {
    var a1 = (k * 30 - 90) * Math.PI / 180;
    el('line', { x1: C + 13.5 * Math.cos(a1), y1: 138 + 13.5 * Math.sin(a1), x2: C + (k % 3 ? 16 : 11) * Math.cos(a1),
      y2: 138 + (k % 3 ? 16 : 11) * Math.sin(a1), stroke: '#3b6ea5', 'stroke-width': k % 3 ? 1 : 1.8 }, o.sub);
  }
  o.subSettore = el('path', { d: '', fill: '#3b6ea5', 'fill-opacity': '.22' }, o.sub);
  o.subLancetta = el('line', { x1: C, y1: 138, x2: C, y2: 124, stroke: '#2c4f78', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, o.sub);
  el('circle', { cx: C, cy: 138, r: 2.4, fill: '#2c4f78' }, o.sub);

  /* lancette dell'ora */
  o.ore = el('g', {}, svg);
  el('path', { d: 'M96.5,112 L97.5,56 Q100,50 102.5,56 L103.5,112 Z', fill: '#2a2014' }, o.ore);
  o.minuti = el('g', {}, svg);
  el('path', { d: 'M97.5,114 L98.3,28 Q100,23 101.7,28 L102.5,114 Z', fill: '#2a2014' }, o.minuti);
  o.secondi = el('g', {}, svg);                                                       // "a paletta", da orologio di scuola
  el('line', { x1: C, y1: 124, x2: C, y2: 34, stroke: '#e2574c', 'stroke-width': 2, 'stroke-linecap': 'round' }, o.secondi);
  el('circle', { cx: C, cy: 34, r: 6, fill: '#e2574c' }, o.secondi);

  /* lancetta del cronometro / timer */
  o.crono = el('g', {}, svg);
  el('line', { x1: C, y1: 122, x2: C, y2: 20, stroke: '#3b6ea5', 'stroke-width': 3, 'stroke-linecap': 'round' }, o.crono);
  el('path', { d: 'M100,16 L95,27 L105,27 Z', fill: '#3b6ea5' }, o.crono);
  el('circle', { cx: C, cy: 118, r: 5, fill: '#3b6ea5' }, o.crono);

  o.perno = el('circle', { cx: C, cy: C, r: 5.5, fill: '#2a2014', stroke: '#e2574c', 'stroke-width': 2 }, svg);
  el('circle', { cx: C, cy: C, r: R_FACE, fill: 'url(#orl-vetro)', 'pointer-events': 'none' }, svg);   // riflesso del vetro
  return o;
}

function ruota(g, deg) { g.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ' ' + C + ' ' + C + ')'); }
function vis(g, on, opacita) { g.style.display = on ? '' : 'none'; if (opacita != null) g.style.opacity = opacita; }

/* ---------- montaggio ---------- */
function monta(box) {
  if (!box) return;
  var s = leggi();
  box.classList.add('orologio');
  box.innerHTML = '';

  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'orl-btn';
  btn.title = 'Orologio: clicca per cronometro e timer';
  var svg = el('svg', { viewBox: '0 0 200 200', class: 'orl-svg', role: 'img', 'aria-label': 'Orologio' });
  btn.appendChild(svg);
  box.appendChild(btn);
  var o = quadrante(svg);

  /* pannello comandi */
  var pan = document.createElement('div');
  pan.className = 'orl-pan';
  pan.innerHTML =
    '<div class="orl-row"><button data-m="ora">🕐 Ora</button><button data-m="crono">⏱ Cronometro</button></div>' +
    '<div class="orl-row"><span class="orl-lab">⏳ Timer</span>' +
      TIMER_MIN.map(function (m) { return '<button data-t="' + m + '">' + m + '′</button>'; }).join('') + '</div>' +
    '<label class="orl-auto"><input type="checkbox"> parte da solo quando il prof ha finito di scrivere</label>' +
    '<div class="orl-row orl-go"><button class="orl-play" data-a="play">▶ VIA</button><button data-a="reset">↺ azzera</button></div>';
  box.appendChild(pan);

  var fineCb = [];
  var chk = pan.querySelector('.orl-auto input');
  chk.checked = pref().auto;
  chk.addEventListener('change', function () {
    var p = pref(); p.auto = chk.checked;
    if (chk.checked && s.modo !== 'timer') { s = stato0(); s.modo = 'timer'; s.dur = p.dur; salva(); }
    salvaPref(p); aggiornaPannello();
  });
  function salva() { scrivi(s); aggiornaPannello(); }
  function aggiornaPannello() {
    pan.querySelectorAll('[data-m]').forEach(function (b) { b.classList.toggle('on', s.modo === b.dataset.m); });
    pan.querySelectorAll('[data-t]').forEach(function (b) { b.classList.toggle('on', s.modo === 'timer' && s.dur === b.dataset.t * 60000); });
    pan.querySelector('.orl-go').style.display = s.modo === 'ora' ? 'none' : '';
    var play = pan.querySelector('.orl-play');
    play.textContent = s.corre ? '⏸ PAUSA' : (trascorso(s) > 0 && !s.finito ? '▶ RIPRENDI' : '▶ VIA');
    play.classList.toggle('pausa', s.corre);
    box.classList.toggle('attivo', s.modo !== 'ora');
    box.classList.toggle('corre', s.corre);
    pan.querySelector('.orl-auto').style.display = s.modo === 'timer' ? '' : 'none';
  }

  btn.addEventListener('click', function (e) { e.stopPropagation(); box.classList.toggle('aperto'); });
  document.addEventListener('click', function (e) { if (!box.contains(e.target)) box.classList.remove('aperto'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('aperto'); });

  pan.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.m) { s = stato0(); s.modo = b.dataset.m; }
    else if (b.dataset.t) {
      s = stato0(); s.modo = 'timer'; s.dur = b.dataset.t * 60000;
      var p = pref(); p.dur = s.dur; salvaPref(p);
    }
    else if (b.dataset.a === 'play') {
      if (s.corre) { s.acc = trascorso(s); s.corre = false; }
      else {
        if (s.finito) { s.acc = 0; s.finito = false; }
        s.t0 = Date.now(); s.corre = true;
      }
    } else if (b.dataset.a === 'reset') { s.acc = 0; s.corre = false; s.finito = false; box.classList.remove('squilla'); }
    salva();
  });

  function disegna() {
    var d = new Date();
    var sec = d.getSeconds() + (calma() ? 0 : d.getMilliseconds() / 1000);
    var min = d.getMinutes() + sec / 60, ore = (d.getHours() % 12) + min / 60;
    ruota(o.ore, ore * 30); ruota(o.minuti, min * 6); ruota(o.secondi, sec * 6);

    if (s.modo === 'ora') {
      vis(o.ore, true, 1); vis(o.minuti, true, 1); vis(o.secondi, true);
      vis(o.crono, false); vis(o.sub, false); vis(o.numeri, true);
      o.settore.setAttribute('d', '');
      o.etichetta.textContent = '';
    } else if (s.modo === 'crono') {
      var t = trascorso(s) / 1000;
      if (calma() && s.corre) t = Math.floor(t);
      vis(o.ore, true, .18); vis(o.minuti, true, .18); vis(o.secondi, false);
      vis(o.crono, true); vis(o.sub, true); vis(o.numeri, true);
      ruota(o.crono, (t % 60) * 6);
      var m = (t / 60) % 60;
      o.subLancetta.setAttribute('transform', 'rotate(' + (m * 6).toFixed(2) + ' ' + C + ' 138)');
      o.subSettore.setAttribute('d', spicchioSub(m * 6));
      o.settore.setAttribute('d', spicchio(R_FACE - 1, (t % 60) * 6));
      o.settore.setAttribute('fill', '#3b6ea5'); o.settore.setAttribute('fill-opacity', '.14');
      o.etichetta.textContent = 'CRONOMETRO';
    } else {
      var rest = Math.max(0, s.dur - trascorso(s));
      if (s.corre && rest <= 0) {
        s.acc = s.dur; s.corre = false; s.finito = true; scrivi(s); aggiornaPannello();
        box.classList.remove('squilla'); void box.offsetWidth; box.classList.add('squilla');
        campanella();
        fineCb.forEach(function (cb) { try { cb(); } catch (e) {} });
      }
      var f = rest / s.dur;
      vis(o.ore, true, .18); vis(o.minuti, true, .18); vis(o.secondi, false);
      vis(o.crono, true); vis(o.sub, false); vis(o.numeri, false);
      ruota(o.crono, f * 360);
      o.settore.setAttribute('d', spicchio(R_FACE - 1, f * 360));
      o.settore.setAttribute('fill', '#e2574c'); o.settore.setAttribute('fill-opacity', '.85');
      o.etichetta.textContent = 'TIMER ' + Math.round(s.dur / 60000) + '′';
    }
    requestAnimationFrame(disegna);
  }
  function spicchioSub(deg) {   // spicchio del quadrantino (centro 100,138 r 14)
    if (deg <= 0.05) return '';
    var r = 14, a = (deg - 90) * Math.PI / 180, x = C + r * Math.cos(a), y = 138 + r * Math.sin(a);
    if (deg >= 359.95) return 'M' + C + ',124 A14,14 0 1 1 ' + (C - 0.01) + ',124 Z';
    return 'M' + C + ',138 L' + C + ',124 A14,14 0 ' + (deg > 180 ? 1 : 0) + ' 1 ' + x.toFixed(2) + ',' + y.toFixed(2) + ' Z';
  }

  aggiornaPannello();
  requestAnimationFrame(disegna);

  return {
    /* il gioco chiede di far partire il timer (solo se l'insegnante l'ha scelto) */
    avviaAuto: function () {
      var p = pref(); if (!p.auto) return;
      s = stato0(); s.modo = 'timer'; s.dur = p.dur; s.t0 = Date.now(); s.corre = true;
      box.classList.remove('squilla'); salva();
    },
    /* errori tutti trovati o nuova spiegazione: il timer si ferma */
    ferma: function () {
      if (s.modo === 'timer' && s.corre) { s.acc = trascorso(s); s.corre = false; salva(); }
    },
    onFine: function (cb) { fineCb.push(cb); }
  };
}

window.Orologio = { monta: monta };
})();
