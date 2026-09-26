/* ============================================================
   LA SCUOLA DEI PROFESSORACCI — registro delle classi
   Script classico (no module): funziona anche da file://
   Espone window.Classi

   Tutto resta SOLO su questo computer (localStorage).
   I nomi degli alunni NON vengono mai inviati all'intelligenza
   artificiale: servono solo a contare i punti.

   Struttura dati (localStorage 'professoracci_classi'):
   {
     v: 1,
     attiva: 'k_…' | null,
     classi: [{
       id, nome, punti, perMateria:{ profId: punti },
       alunni:  [{ id, nome, assente, punti, perMateria:{} }],
       gruppi:  [{ id, nome, emoji, membri:[alunnoId], punti }]
     }]
   }
   Un alunno che non sta in nessun gruppo gioca come
   "gruppo da uno": il suo punteggio di squadra è il suo totale.
   ============================================================ */
(function () {
'use strict';

var LS = 'professoracci_classi';
var PUNTI_GIUSTO = 10;

var NOMI_GRUPPI = [
  ['Volpi','🦊'], ['Gufi','🦉'], ['Delfini','🐬'], ['Tigri','🐯'], ['Pinguini','🐧'],
  ['Castori','🦫'], ['Lupi','🐺'], ['Koala','🐨'], ['Polpi','🐙'], ['Api','🐝'],
  ['Ricci','🦔'], ['Leoni','🦁'], ['Rane','🐸'], ['Panda','🐼'], ['Aquile','🦅'], ['Tartarughe','🐢']
];

function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function vuoto() { return { v: 1, attiva: null, livelloLibero: 'facile', classi: [] }; }

/* livelli di gioco (stesse chiavi di cfg.livelli nei professori) */
var LIVELLI = [
  { id: 'facile',    nome: '1ª – 2ª',     info: '6-7 anni' },
  { id: 'media',     nome: '3ª – 4ª',     info: '8-9 anni' },
  { id: 'difficile', nome: '5ª e medie',  info: '10-13 anni' }
];
function livelloValido(l) {
  for (var i = 0; i < LIVELLI.length; i++) if (LIVELLI[i].id === l) return l;
  return 'facile';
}

/* ---------- lettura / scrittura ---------- */
function load() {
  try {
    var db = JSON.parse(localStorage.getItem(LS) || 'null');
    if (!db || !Array.isArray(db.classi)) return vuoto();
    db.classi.forEach(normalizza);
    return db;
  } catch (e) { return vuoto(); }
}
function save(db) {
  try { localStorage.setItem(LS, JSON.stringify(db)); return true; }
  catch (e) { return false; }
}
function normalizza(c) {
  c.punti = +c.punti || 0;
  c.livello = livelloValido(c.livello);
  c.perMateria = c.perMateria || {};
  c.alunni = Array.isArray(c.alunni) ? c.alunni : [];
  c.gruppi = Array.isArray(c.gruppi) ? c.gruppi : [];
  c.alunni.forEach(function (a) {
    a.punti = +a.punti || 0; a.perMateria = a.perMateria || {}; a.assente = !!a.assente;
  });
  c.gruppi.forEach(function (g) { g.punti = +g.punti || 0; g.membri = g.membri || []; });
  return c;
}
/* modifica atomica: carica, applica, salva */
function modifica(fn) {
  var db = load();
  var r = fn(db);
  save(db);
  return r;
}
function trova(db, classeId) {
  for (var i = 0; i < db.classi.length; i++) if (db.classi[i].id === classeId) return db.classi[i];
  return null;
}

/* ---------- classi ---------- */
function elenco() { return load().classi; }
function getClasse(id) { return trova(load(), id); }
function getAttiva() {
  var db = load();
  return db.attiva ? trova(db, db.attiva) : null;
}
function setAttiva(id) {
  modifica(function (db) { db.attiva = id && trova(db, id) ? id : null; });
}
/* livello della classe in gioco (o del gioco libero se nessuna classe) */
function getLivello() {
  var db = load();
  var c = db.attiva ? trova(db, db.attiva) : null;
  return c ? c.livello : livelloValido(db.livelloLibero);
}
/* classeId null = gioco libero */
function setLivello(classeId, livello) {
  livello = livelloValido(livello);
  modifica(function (db) {
    var c = classeId ? trova(db, classeId) : null;
    if (c) c.livello = livello; else db.livelloLibero = livello;
  });
}
function nomeLivello(id) {
  for (var i = 0; i < LIVELLI.length; i++) if (LIVELLI[i].id === id) return LIVELLI[i].nome;
  return id;
}
function creaClasse(nome) {
  nome = String(nome || '').trim().slice(0, 30);
  if (!nome) return null;
  return modifica(function (db) {
    var c = normalizza({ id: uid('k_'), nome: nome });
    db.classi.push(c);
    db.classi.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'it', { numeric: true }); });
    db.attiva = c.id;
    return c;
  });
}
function rinominaClasse(id, nome) {
  nome = String(nome || '').trim().slice(0, 30);
  if (!nome) return;
  modifica(function (db) { var c = trova(db, id); if (c) c.nome = nome; });
}
function eliminaClasse(id) {
  modifica(function (db) {
    db.classi = db.classi.filter(function (c) { return c.id !== id; });
    if (db.attiva === id) db.attiva = null;
  });
}

/* ---------- alunni ---------- */
function aggiungiAlunni(classeId, nomi) {
  return modifica(function (db) {
    var c = trova(db, classeId); if (!c) return 0;
    var esistenti = c.alunni.map(function (a) { return a.nome.toLowerCase(); });
    var n = 0;
    nomi.forEach(function (x) {
      x = String(x || '').trim().slice(0, 24);
      if (!x || esistenti.indexOf(x.toLowerCase()) >= 0) return;
      c.alunni.push({ id: uid('a_'), nome: x, assente: false, punti: 0, perMateria: {} });
      esistenti.push(x.toLowerCase()); n++;
    });
    return n;
  });
}
function rinominaAlunno(classeId, alunnoId, nome) {
  nome = String(nome || '').trim().slice(0, 24);
  if (!nome) return;
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    c.alunni.forEach(function (a) { if (a.id === alunnoId) a.nome = nome; });
  });
}
function rimuoviAlunno(classeId, alunnoId) {
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    c.alunni = c.alunni.filter(function (a) { return a.id !== alunnoId; });
    c.gruppi.forEach(function (g) { g.membri = g.membri.filter(function (m) { return m !== alunnoId; }); });
    c.gruppi = c.gruppi.filter(function (g) { return g.membri.length; });
  });
}
function setAssente(classeId, alunnoId, assente) {
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    c.alunni.forEach(function (a) { if (a.id === alunnoId) a.assente = !!assente; });
  });
}

/* ---------- gruppi (cambiano ogni volta) ---------- */
function mescola(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}
function nomeGruppo(i) {
  var n = NOMI_GRUPPI[i % NOMI_GRUPPI.length];
  var giro = Math.floor(i / NOMI_GRUPPI.length);
  return { nome: n[0] + (giro ? ' ' + (giro + 1) : ''), emoji: n[1] };
}
/* gruppi casuali da `dim` (1 = tutti singoli). Solo i presenti.
   I resti vengono distribuiti: nessun gruppo resta più piccolo di dim-1 */
function gruppiCasuali(classeId, dim) {
  dim = Math.max(1, Math.min(8, +dim || 1));
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    if (dim === 1) { c.gruppi = []; return; }
    var presenti = mescola(c.alunni.filter(function (a) { return !a.assente; }).map(function (a) { return a.id; }));
    var nGruppi = Math.max(1, Math.round(presenti.length / dim));
    var gruppi = [];
    for (var i = 0; i < nGruppi; i++) {
      var ng = nomeGruppo(i);
      gruppi.push({ id: uid('g_'), nome: ng.nome, emoji: ng.emoji, membri: [], punti: 0 });
    }
    presenti.forEach(function (id, k) { gruppi[k % nGruppi].membri.push(id); });
    c.gruppi = gruppi.filter(function (g) { return g.membri.length; });
  });
}
function tuttiSingoli(classeId) { gruppiCasuali(classeId, 1); }
/* sposta un alunno: gruppoId = id esistente, 'nuovo' o null (= da solo) */
function spostaAlunno(classeId, alunnoId, gruppoId) {
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    c.gruppi.forEach(function (g) { g.membri = g.membri.filter(function (m) { return m !== alunnoId; }); });
    if (gruppoId === 'nuovo') {
      var usati = c.gruppi.map(function (g) { return g.nome; });
      var i = 0, ng;
      do { ng = nomeGruppo(i++); } while (usati.indexOf(ng.nome) >= 0);
      c.gruppi.push({ id: uid('g_'), nome: ng.nome, emoji: ng.emoji, membri: [alunnoId], punti: 0 });
    } else if (gruppoId) {
      c.gruppi.forEach(function (g) { if (g.id === gruppoId) g.membri.push(alunnoId); });
    }
    c.gruppi = c.gruppi.filter(function (g) { return g.membri.length; });
  });
}

/* Le squadre in gara: i gruppi + ogni presente senza gruppo (gruppo da uno) */
function squadre(c) {
  if (!c) return [];
  var byId = {};
  c.alunni.forEach(function (a) { byId[a.id] = a; });
  var inGruppo = {};
  var out = [];
  c.gruppi.forEach(function (g) {
    var membri = g.membri.map(function (id) { return byId[id]; })
      .filter(function (a) { return a && !a.assente; });
    g.membri.forEach(function (id) { inGruppo[id] = true; });
    if (membri.length) out.push({ id: g.id, nome: g.nome, emoji: g.emoji, membri: membri, punti: g.punti, solo: false });
  });
  c.alunni.forEach(function (a) {
    if (a.assente || inGruppo[a.id]) return;
    out.push({ id: 's_' + a.id, nome: a.nome, emoji: '', membri: [a], punti: a.punti, solo: true });
  });
  return out;
}

/* ---------- punteggi ---------- */
/* Assegna i punti a una squadra: +punti alla squadra, a ciascun membro
   (totale e per materia) e alla classe (totale e per materia). */
function assegna(classeId, squadraId, profId, punti) {
  punti = punti == null ? PUNTI_GIUSTO : +punti;
  return modifica(function (db) {
    var c = trova(db, classeId); if (!c) return null;
    var sq = squadre(c).filter(function (s) { return s.id === squadraId; })[0];
    if (!sq) return null;
    sq.membri.forEach(function (m) {
      c.alunni.forEach(function (a) {
        if (a.id !== m.id) return;
        a.punti += punti;
        a.perMateria[profId] = (a.perMateria[profId] || 0) + punti;
      });
    });
    if (!sq.solo) c.gruppi.forEach(function (g) { if (g.id === squadraId) g.punti += punti; });
    c.punti += punti;
    c.perMateria[profId] = (c.perMateria[profId] || 0) + punti;
    return sq;
  });
}
function azzeraPunti(classeId) {
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    c.punti = 0; c.perMateria = {};
    c.alunni.forEach(function (a) { a.punti = 0; a.perMateria = {}; });
    c.gruppi.forEach(function (g) { g.punti = 0; });
  });
}

/* Fotografia dei soli punteggi di una classe (per il tasto "annulla"):
   ripristinarla rimette i punti com'erano, senza toccare alunni, gruppi,
   assenze o nomi cambiati nel frattempo. */
function fotoPunti(classeId) {
  var c = getClasse(classeId); if (!c) return null;
  var f = { punti: c.punti, perMateria: JSON.parse(JSON.stringify(c.perMateria)), alunni: {}, gruppi: {} };
  c.alunni.forEach(function (a) { f.alunni[a.id] = { punti: a.punti, perMateria: JSON.parse(JSON.stringify(a.perMateria)) }; });
  c.gruppi.forEach(function (g) { f.gruppi[g.id] = g.punti; });
  return f;
}
function ripristinaPunti(classeId, f) {
  if (!f) return;
  modifica(function (db) {
    var c = trova(db, classeId); if (!c) return;
    c.punti = f.punti; c.perMateria = f.perMateria;
    c.alunni.forEach(function (a) {
      var x = f.alunni[a.id];
      if (x) { a.punti = x.punti; a.perMateria = x.perMateria; }
    });
    c.gruppi.forEach(function (g) { if (f.gruppi[g.id] != null) g.punti = f.gruppi[g.id]; });
  });
}

/* ---------- esporta / importa ---------- */
function esporta() {
  var db = load();
  return JSON.stringify({ tipo: 'professoracci-classi', v: 1, data: new Date().toISOString(), classi: db.classi }, null, 2);
}
function scaricaEsportazione() {
  var blob = new Blob([esporta()], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'professoracci-classi-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
/* Unisce: le classi con lo stesso id (o, in mancanza, lo stesso nome)
   vengono sostituite da quelle del file; le altre vengono aggiunte. */
function importa(testo) {
  var dati = JSON.parse(testo);
  if (!dati || dati.tipo !== 'professoracci-classi' || !Array.isArray(dati.classi)) {
    throw new Error('Questo file non è un registro dei Professoracci.');
  }
  return modifica(function (db) {
    var nuove = 0, aggiornate = 0;
    dati.classi.forEach(function (c) {
      if (!c || !c.id || !c.nome) return;
      normalizza(c);
      var i = db.classi.findIndex(function (x) { return x.id === c.id; });
      if (i < 0) i = db.classi.findIndex(function (x) { return x.nome.toLowerCase() === String(c.nome).toLowerCase(); });
      if (i >= 0) { db.classi[i] = c; aggiornate++; } else { db.classi.push(c); nuove++; }
    });
    db.classi.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'it', { numeric: true }); });
    if (!db.attiva && db.classi.length) db.attiva = db.classi[0].id;
    return { nuove: nuove, aggiornate: aggiornate };
  });
}

/* ============================================================
   SUONI (Web Audio, niente file): "gneee" e "evviva"
   In modalità tranquilla il volume è più basso.
   ============================================================ */
var ctx = null;
function audio() {
  if (!ctx) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function volume() { return document.body.classList.contains('calma') ? 0.35 : 1; }

/* GNEEE: una "pernacchia" nasale che scende di tono, con vibrato */
function gneee() {
  var a = audio(); if (!a) return;
  var t = a.currentTime, dur = 0.95, vol = 0.28 * volume();
  var osc = a.createOscillator(), osc2 = a.createOscillator();
  var lfo = a.createOscillator(), lfoGain = a.createGain();
  var filtro = a.createBiquadFilter(), g = a.createGain();
  osc.type = 'sawtooth'; osc2.type = 'square';
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(190, t + dur);
  osc2.frequency.setValueAtTime(423, t);
  osc2.frequency.exponentialRampToValueAtTime(188, t + dur);
  lfo.frequency.value = 9; lfoGain.gain.value = 14;
  lfo.connect(lfoGain); lfoGain.connect(osc.frequency); lfoGain.connect(osc2.frequency);
  filtro.type = 'bandpass'; filtro.Q.value = 4;
  filtro.frequency.setValueAtTime(1500, t);
  filtro.frequency.exponentialRampToValueAtTime(700, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.05);
  g.gain.setValueAtTime(vol, t + dur - 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(filtro); osc2.connect(filtro); filtro.connect(g); g.connect(a.destination);
  [osc, osc2, lfo].forEach(function (o) { o.start(t); o.stop(t + dur + 0.05); });
}

/* EVVIVA: arpeggio allegro */
function evviva() {
  var a = audio(); if (!a) return;
  var t = a.currentTime, vol = 0.18 * volume();
  [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
    var o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    var s = t + i * 0.09;
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol, s + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, s + (i === 3 ? 0.6 : 0.25));
    o.connect(g); g.connect(a.destination);
    o.start(s); o.stop(s + 0.65);
  });
}

window.Classi = {
  PUNTI_GIUSTO: PUNTI_GIUSTO,
  LIVELLI: LIVELLI, getLivello: getLivello, setLivello: setLivello, nomeLivello: nomeLivello,
  load: load, elenco: elenco, getClasse: getClasse,
  getAttiva: getAttiva, setAttiva: setAttiva,
  creaClasse: creaClasse, rinominaClasse: rinominaClasse, eliminaClasse: eliminaClasse,
  aggiungiAlunni: aggiungiAlunni, rinominaAlunno: rinominaAlunno, rimuoviAlunno: rimuoviAlunno, setAssente: setAssente,
  gruppiCasuali: gruppiCasuali, tuttiSingoli: tuttiSingoli, spostaAlunno: spostaAlunno, squadre: squadre,
  assegna: assegna, azzeraPunti: azzeraPunti, fotoPunti: fotoPunti, ripristinaPunti: ripristinaPunti,
  esporta: esporta, scaricaEsportazione: scaricaEsportazione, importa: importa,
  suoni: { gneee: gneee, evviva: evviva }
};
})();
