/* La Scuola dei Professoracci — sottofondi d'aula
   Suoni d'ambiente generati dal browser (Web Audio API): niente file audio,
   niente diritti, funziona anche offline.
   Non è musica: sono atmosfere rade e morbide, una per aula.
   Quando il professore parla (speechSynthesis) il sottofondo tace del tutto
   e riparte piano quando ha finito.

   Uso:  Sottofondi.avvia('sgrammaticus')   Sottofondi.ferma()
         Sottofondi.setVolume(0..1)          Sottofondi.attivo()
   Script classico (niente moduli) per funzionare anche aprendo i file da disco. */
(function () {
  'use strict';

  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null, master = null, bus = null, riverbero = null;
  var corrente = null;        // { id, stop() }
  var volume = 0.6;
  var zittito = false, tSilenzio = 0, sorveglianza = null;

  /* ---------- utilità ---------- */
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  function prepara() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;     // parte muto, poi sale piano
      master.connect(ctx.destination);
      bus = ctx.createGain(); bus.gain.value = 1;
      bus.connect(master);
      /* un filo di riverbero per ammorbidire tutto (stanza, non cattedrale) */
      riverbero = ctx.createConvolver();
      riverbero.buffer = rispostaStanza(1.8);
      var wet = ctx.createGain(); wet.gain.value = 0.28;
      bus.connect(riverbero); riverbero.connect(wet); wet.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function rispostaStanza(sec) {
    var n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    }
    return b;
  }
  var bufRumore = null;
  function rumore() {           // rumore "marrone": morbido, senza fruscio acuto
    if (bufRumore) return bufRumore;
    var n = ctx.sampleRate * 4, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), last = 0;
    for (var i = 0; i < n; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    return (bufRumore = b);
  }

  /* ---------- strumenti ---------- */
  /* nota con inviluppo; parziali = [[rapporto, volume, decadimento]] */
  function nota(freq, t, o) {
    o = o || {};
    var out = ctx.createGain(); out.gain.value = 0;
    var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pan) { pan.pan.value = o.pan != null ? o.pan : rnd(-0.4, 0.4); out.connect(pan); pan.connect(o.dest || bus); }
    else out.connect(o.dest || bus);
    var vol = o.vol != null ? o.vol : 0.2, att = o.att || 0.005, dec = o.dec || 1.2;
    var parz = o.parziali || [[1, 1, dec]];
    var fine = t;
    parz.forEach(function (p) {
      var osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = o.tipo || 'sine';
      osc.frequency.value = freq * p[0];
      if (o.detune) osc.detune.value = o.detune;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(p[1], t + att);
      g.gain.exponentialRampToValueAtTime(0.0001, t + att + p[2]);
      osc.connect(g); g.connect(out);
      osc.start(t); osc.stop(t + att + p[2] + 0.05);
      fine = Math.max(fine, t + att + p[2]);
    });
    out.gain.setValueAtTime(vol, t);
    if (o.filtro) {   // passa-basso applicato a valle, se richiesto
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.filtro;
      out.disconnect(); out.connect(f); f.connect(pan || o.dest || bus);
    }
    setTimeout(function () { try { out.disconnect(); } catch (e) {} }, (fine - ctx.currentTime + 0.5) * 1000);
  }
  var carillon = function (f, t, v) {
    nota(f, t, { vol: v || 0.13, att: 0.003, parziali: [[1, 1, 1.8], [2, 0.25, 0.6], [4.01, 0.12, 0.25]] });
  };
  var cembalo = function (f, t, v) {  // pizzico secco e brillante
    nota(f, t, { vol: v || 0.12, tipo: 'sawtooth', att: 0.002, filtro: 2600,
      parziali: [[1, 1, 0.55], [2, 0.35, 0.3], [3, 0.15, 0.18]] });
  };
  var marimba = function (f, t, v) {
    nota(f, t, { vol: v || 0.26, att: 0.004, parziali: [[1, 1, 0.5], [4, 0.2, 0.08], [10, 0.05, 0.03]] });
  };
  var pizzicato = function (f, t, v) {
    nota(f, t, { vol: v || 0.1, tipo: 'triangle', att: 0.004, parziali: [[1, 1, 0.35], [2, 0.3, 0.15]] });
  };
  var tintinnio = function (f, t, v) {  // tazzina / campanellino
    nota(f, t, { vol: v || 0.05, att: 0.001, parziali: [[1, 1, 0.9], [2.32, 0.6, 0.5], [4.25, 0.35, 0.3], [6.8, 0.2, 0.2]] });
  };
  function tic(t, alto, v) {
    var src = ctx.createBufferSource(); src.buffer = rumore();
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = alto ? 3200 : 2300; f.Q.value = 6;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v || 0.5, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(f); f.connect(g); g.connect(bus);
    src.start(t, rnd(0, 3)); src.stop(t + 0.08);
  }
  function uccellino(t) {
    var n = Math.floor(rnd(2, 5)), base = rnd(2600, 3800), pan = rnd(-0.8, 0.8);
    for (var i = 0; i < n; i++) {
      var t0 = t + i * rnd(0.09, 0.16), osc = ctx.createOscillator(), g = ctx.createGain();
      var p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      osc.frequency.setValueAtTime(base * rnd(0.85, 1), t0);
      osc.frequency.exponentialRampToValueAtTime(base * rnd(1.2, 1.5), t0 + 0.05);
      osc.frequency.exponentialRampToValueAtTime(base * rnd(0.8, 1), t0 + 0.09);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.025, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
      osc.connect(g);
      if (p) { p.pan.value = pan; g.connect(p); p.connect(bus); } else g.connect(bus);
      osc.start(t0); osc.stop(t0 + 0.12);
    }
  }
  function bollicina(t) {
    var osc = ctx.createOscillator(), g = ctx.createGain(), f0 = rnd(300, 700);
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f0 * rnd(2.2, 3.2), t + 0.07);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    var p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    osc.connect(g);
    if (p) { p.pan.value = rnd(-0.6, 0.6); g.connect(p); p.connect(bus); } else g.connect(bus);
    osc.start(t); osc.stop(t + 0.12);
  }

  /* ---------- tappeti continui (vento, ronzio, pad) ---------- */
  function tappetoRumore(o) {   // rumore filtrato con respiro lento
    var src = ctx.createBufferSource(); src.buffer = rumore(); src.loop = true;
    var f = ctx.createBiquadFilter(); f.type = o.tipo || 'lowpass'; f.frequency.value = o.freq; f.Q.value = o.q || 0.7;
    var g = ctx.createGain(); g.gain.value = o.vol;
    src.connect(f); f.connect(g); g.connect(bus);
    var lfo = null, lg = null;
    if (o.respiro) {
      lfo = ctx.createOscillator(); lfo.frequency.value = o.respiro;
      lg = ctx.createGain(); lg.gain.value = o.ampiezza || o.freq * 0.4;
      lfo.connect(lg); lg.connect(f.frequency); lfo.start();
      var lfo2 = ctx.createOscillator(), lg2 = ctx.createGain();
      lfo2.frequency.value = o.respiro * 0.61; lg2.gain.value = o.vol * 0.5;
      lfo2.connect(lg2); lg2.connect(g.gain); lfo2.start();
    }
    src.start();
    return function () {
      try { src.stop(); if (lfo) lfo.stop(); if (lfo2) lfo2.stop(); } catch (e) {}
      try { g.disconnect(); } catch (e) {}
    };
  }
  function ronzio(freq, vol) {
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o1.frequency.value = freq; o2.frequency.value = freq * 1.502; o2.detune.value = 7;
    g.gain.value = vol;
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.13; lg.gain.value = vol * 0.6; lfo.connect(lg); lg.connect(g.gain);
    o1.connect(g); o2.connect(g); g.connect(bus);
    o1.start(); o2.start(); lfo.start();
    return function () { try { o1.stop(); o2.stop(); lfo.stop(); g.disconnect(); } catch (e) {} };
  }
  function accordoPad(note, t, dur, vol) {   // accordo che sfuma dentro e fuori
    note.forEach(function (m, i) {
      [-6, 6].forEach(function (det) {
        var osc = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
        osc.type = 'triangle'; osc.frequency.value = mtof(m); osc.detune.value = det;
        f.type = 'lowpass'; f.frequency.value = 1400;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol / note.length, t + dur * 0.4);
        g.gain.linearRampToValueAtTime(0, t + dur);
        osc.connect(f); f.connect(g); g.connect(bus);
        osc.start(t); osc.stop(t + dur + 0.1);
      });
    });
  }

  /* ---------- pianificatore: eventi radi con un po' di anticipo ---------- */
  function ciclo(fn) {
    var prossimo = ctx.currentTime + 0.3, vivo = true;
    var timer = setInterval(function () {
      if (!vivo) return;
      while (prossimo < ctx.currentTime + 0.6) prossimo += Math.max(0.05, fn(prossimo));
    }, 100);
    return function () { vivo = false; clearInterval(timer); };
  }

  /* ---------- le atmosfere ---------- */
  var PENTA_DO = [72, 74, 76, 79, 81, 84, 86, 88];           // do pentatonico acuto
  var DORICO_RE = [62, 64, 65, 67, 69, 71, 72, 74];
  var PENTA_SOL = [67, 69, 71, 74, 76, 79, 81, 83];

  var ATMOSFERE = {
    /* Grammatica — biblioteca silenziosa e un carillon che ogni tanto suona */
    biblioteca: {
      nome: 'Biblioteca col carillon',
      avvia: function () {
        var s1 = tappetoRumore({ freq: 380, vol: 0.05 });
        var s2 = ciclo(function (t) {
          var m = pick(PENTA_DO);
          carillon(mtof(m), t);
          if (Math.random() < 0.3) carillon(mtof(m + pick([3, 4, 5, 7])), t + 0.28, 0.08);
          return rnd(1.6, 3.8);
        });
        return function () { s1(); s2(); };
      }
    },
    /* Storia — un clavicembalo lontano che pizzica frammenti antichi */
    clavicembalo: {
      nome: 'Clavicembalo lontano',
      avvia: function () {
        var s1 = tappetoRumore({ freq: 300, vol: 0.04 });
        var s2 = ciclo(function (t) {
          var i = Math.floor(rnd(0, DORICO_RE.length - 3)), n = Math.floor(rnd(2, 5)), su = Math.random() < 0.6;
          for (var k = 0; k < n; k++) cembalo(mtof(DORICO_RE[su ? i + k : i + n - 1 - k]), t + k * 0.22);
          if (Math.random() < 0.35) cembalo(mtof(DORICO_RE[i] - 12), t, 0.05);
          return rnd(2.4, 4.5);
        });
        return function () { s1(); s2(); };
      }
    },
    /* Matematica — tic-tac regolare e rintocchi di marimba che "contano" */
    tictac: {
      nome: 'Tic-tac e marimba',
      avvia: function () {
        var passo = 0;
        var s = ciclo(function (t) {
          tic(t, passo % 2 === 0, 0.7);
          if (passo % 4 === 0 && Math.random() < 0.55) {
            var base = pick([60, 62, 65, 67]), n = pick([1, 2, 3]);
            for (var k = 0; k < n; k++) marimba(mtof(base + [0, 4, 7][k] + 12), t + k * 0.25);
          }
          passo++;
          return 1;
        });
        return s;
      }
    },
    /* Geografia — vento leggero e uccellini lontani */
    vento: {
      nome: 'Vento e uccellini',
      avvia: function () {
        var s1 = tappetoRumore({ tipo: 'bandpass', freq: 520, q: 0.8, vol: 0.16, respiro: 0.07, ampiezza: 260 });
        var s2 = ciclo(function (t) { uccellino(t); return rnd(2.5, 7); });
        return function () { s1(); s2(); };
      }
    },
    /* Scienze — bollicine di laboratorio e un ronzio morbido di macchinari */
    laboratorio: {
      nome: 'Laboratorio che borbotta',
      avvia: function () {
        var s1 = ronzio(55, 0.035);
        var s2 = ciclo(function (t) {
          var n = Math.random() < 0.4 ? Math.floor(rnd(2, 5)) : 1;
          for (var k = 0; k < n; k++) bollicina(t + k * rnd(0.06, 0.14));
          return rnd(0.5, 2.2);
        });
        return function () { s1(); s2(); };
      }
    },
    /* Arte — un tappeto sognante, un po' sospeso (come la Prof.ssa Storditella) */
    sogno: {
      nome: 'Nuvola sognante',
      avvia: function () {
        var ACCORDI = [[60, 64, 67, 71], [57, 60, 64, 67, 71], [53, 57, 60, 64], [55, 59, 62, 66]];
        var i = 0;
        var s1 = ciclo(function (t) { accordoPad(ACCORDI[i++ % ACCORDI.length], t, 9, 0.09); return 7; });
        var s2 = ciclo(function (t) { carillon(mtof(pick(PENTA_DO) + 12), t, 0.05); return rnd(3, 6); });
        return function () { s1(); s2(); };
      }
    },
    /* Inglese — ora del tè: tazzine che tintinnano e un pizzicato leggero */
    tea: {
      nome: 'Tea time',
      avvia: function () {
        var s1 = tappetoRumore({ freq: 420, vol: 0.045 });
        var s2 = ciclo(function (t) {
          if (Math.random() < 0.3) { tintinnio(rnd(2400, 3000), t); if (Math.random() < 0.5) tintinnio(rnd(2600, 3200), t + 0.12, 0.03); }
          else { var i = Math.floor(rnd(0, 5)); pizzicato(mtof(PENTA_SOL[i]), t); pizzicato(mtof(PENTA_SOL[i + 2]), t + 0.3, 0.07); }
          return rnd(1.8, 3.6);
        });
        return function () { s1(); s2(); };
      }
    }
  };

  /* quale atmosfera per quale aula (i prof creati col builder: in base alla materia) */
  var PER_PROF = {
    sgrammaticus: 'biblioteca', confusione: 'clavicembalo', sbagliotti: 'tictac',
    terranova: 'vento', bubbolo: 'laboratorio', storditella: 'sogno', missspelling: 'tea'
  };
  function atmosferaPer(id, materia) {
    if (ATMOSFERE[id]) return id;
    if (PER_PROF[id]) return PER_PROF[id];
    var m = String(materia || '').toLowerCase();
    if (/ital|gramm|lett|latin/.test(m)) return 'biblioteca';
    if (/stor|filos|relig/.test(m)) return 'clavicembalo';
    if (/mat|geom|fis|tecn|inform/.test(m)) return 'tictac';
    if (/geog|terr|ambient/.test(m)) return 'vento';
    if (/scien|chim|biol|natur/.test(m)) return 'laboratorio';
    if (/arte|disegn|music|immag/.test(m)) return 'sogno';
    if (/ingl|engl|franc|spagn|tedes|lingu/.test(m)) return 'tea';
    return 'biblioteca';
  }

  /* ---------- volume, fade, silenzio quando il prof parla ---------- */
  function sfuma(verso, sec) {
    if (!master) return;
    var t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(verso, t + sec);
  }
  function livello() { return zittito ? 0 : volume * 1.8; }

  function sorveglia() {        // il prof parla? zitti tutti.
    if (sorveglianza) return;
    sorveglianza = setInterval(function () {
      if (!corrente) return;
      var parla = !!(window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending));
      if (parla) {
        tSilenzio = 0;
        if (!zittito) { zittito = true; sfuma(0, 0.12); }
      } else if (zittito) {
        tSilenzio += 150;
        if (tSilenzio >= 700) { zittito = false; sfuma(livello(), 2.2); }   // riparte piano
      }
    }, 150);
  }

  function avvia(id, materia) {
    if (!prepara()) return false;
    var chiave = atmosferaPer(id, materia);
    if (corrente && corrente.chiave === chiave) return true;
    var cambio = !!corrente;
    if (cambio) { var vecchio = corrente; setTimeout(vecchio.stop, 700); sfuma(0, 0.6); }
    var stop = null;
    corrente = { chiave: chiave, stop: function () { if (stop) stop(); } };
    var mio = corrente;
    zittito = !!(window.speechSynthesis && speechSynthesis.speaking);
    /* se si cambia atmosfera, la nuova parte quando la vecchia è sfumata */
    setTimeout(function () {
      if (corrente !== mio) return;
      stop = ATMOSFERE[chiave].avvia();
      sfuma(livello(), 1.8);
    }, cambio ? 720 : 0);
    sorveglia();
    return true;
  }
  function ferma() {
    if (!corrente) return;
    var c = corrente; corrente = null;
    sfuma(0, 0.5);
    setTimeout(c.stop, 600);
  }
  function setVolume(v) {
    volume = Math.max(0, Math.min(1, +v || 0));
    if (corrente && !zittito) sfuma(livello(), 0.2);
  }

  window.Sottofondi = {
    avvia: avvia, ferma: ferma, setVolume: setVolume,
    attivo: function () { return !!corrente; },
    corrente: function () { return corrente ? corrente.chiave : null; },
    atmosferaPer: atmosferaPer,
    elenco: function () { return Object.keys(ATMOSFERE).map(function (k) { return { id: k, nome: ATMOSFERE[k].nome }; }); },
    supportato: !!AC
  };
})();
