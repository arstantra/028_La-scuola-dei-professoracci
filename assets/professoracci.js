/* ============================================================
   LA SCUOLA DEI PROFESSORACCI — configurazione condivisa
   Script classico (no module): funziona anche aprendo i file
   direttamente dal computer (file://).
   Espone window.Professoracci
   ============================================================ */
(function () {
'use strict';

/* ---------- PALETTE per aule custom ---------- */
var PALETTE = [
  { id:'indaco',     c:'#5a4fcf', d:'#463db3', dd:'#37308c', wall:'#bcd9e8' },
  { id:'terracotta', c:'#b3622e', d:'#8f4e24', dd:'#6e3c1b', wall:'#ecd9b5' },
  { id:'blu',        c:'#3b6ea5', d:'#2c4f78', dd:'#223d5c', wall:'#d7dfe8' },
  { id:'verde',      c:'#4d8f4d', d:'#3a6f3a', dd:'#2c552c', wall:'#d8e6cf' },
  { id:'teal',       c:'#2aa198', d:'#1f7d76', dd:'#175f5a', wall:'#d2e9e6' },
  { id:'rosa',       c:'#c75b9b', d:'#a34579', dd:'#7d355d', wall:'#f0dce9' },
  { id:'rosso',      c:'#e2574c', d:'#b03a31', dd:'#8f2d26', wall:'#f0dcd7' },
  { id:'viola',      c:'#8a6a9e', d:'#6d5280', dd:'#523d61', wall:'#e4dcee' }
];

/* ---------- REGOLE COMUNI dei personaggi ---------- */
var REGOLE = 'LINGUA: scrivi SOLO in italiano. Mai una parola in inglese.\n' +
  'PUBBLICO: bambini e ragazzi dai 6 ai 13 anni. Frasi brevi, lessico semplice, tono giocoso, mai spaventoso o umiliante.\n' +
  'REGOLA D\'ORO: rispondi SOLO con il JSON richiesto, senza testo prima o dopo.';

/* ============================================================
   I SEI PROFESSORACCI DI RUOLO
   ============================================================ */
var PROFS = {

  sgrammaticus: {
    id:'sgrammaticus', nome:'Prof. Sgrammaticus', materia:'ITALIANO',
    label:'Aula di Grammatica', roomtitle:'Aula di Grammatica',
    boardtitle:'Grammatica — trova l\'errore!',
    tema:{ wall:'#bcd9e8', c:'#5a4fcf', d:'#463db3', dd:'#37308c' },
    voce:{ pitch:0.75, rate:0.80 },
    teach:{ dur:'3.4s', kf:'0%,100%{transform:rotate(-1deg);} 50%{transform:rotate(2deg) translateY(-3px);}' },
    argomento:'grammatica italiana', tipoErrore:'errore grammaticale',
    stileCompito:'inserito con naturalezza nel tuo discorso da professore convinto di avere ragione.',
    scusaBravo:'una scusa buffa',
    persona:'Sei il Prof. Sgrammaticus, insegnante di grammatica italiana in una scuola immaginaria per bambini.\nCARATTERE: pomposo, solenne, vanitoso. Ti vanti di essere "la grammatica in persona" e NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore, con scuse buffe e teatrali ("la colpa è del gesso!", "colpo di vento grammaticale!").\n' + REGOLE,
    livelli:{
      facile:'bambini di 6-7 anni (classe 1ª-2ª): errori molto evidenti su verbi essere/avere, plurali semplici, articoli (es. "ho andato", "le bambino", "i zaino")',
      media:'bambini di 8-9 anni (classe 3ª-4ª): errori su accordo nome-aggettivo, verbi irregolari, apostrofi e accenti (es. "un’albero" con apostrofo sbagliato, "io dicevo che vengo ieri", "qual è" scritto male)',
      difficile:'ragazzi di 10-13 anni (classe 5ª e scuola media): errori più sottili su congiuntivi, pronomi (gli/le), "c’è/ci sono", doppie, punteggiatura (es. "se lo sapevo venivo", "gli ho detto a Maria")'
    },
    benvenutoBolla:'Benvenuto nella MIA aula. Io sono il Professor Sgrammaticus: la grammatica in persona!',
    benvenutoLavagna:'Premi «NUOVA SPIEGAZIONE» e ascolta bene: da qualche parte mi nasconderò un errore... anzi, IO non sbaglio mai. Sarà la lavagna a sbagliare!',
    placeholder:'Dov\'è l\'errore, professore? Scrivi qui la tua correzione...',
    nokey:'Il Prof. Sgrammaticus non apre l\'aula senza la chiave. Torna in corridoio e consegnala in segreteria.',
    msg:{
      preparo:'Ehm... un attimo, sto preparando una lezione PERFETTA. Come sempre.',
      pronto:'Ecco a voi! Una spiegazione impeccabile. Nessuno trovi errori, perché NON ce ne sono. Ovviamente.',
      noLezione:'Prima chiedimi una spiegazione, giovane impaziente!',
      vuoto:'La casella è vuota! Scrivi dove ho... ehm, dove LA LAVAGNA ha sbagliato.',
      controllo:'Mmm... fammi controllare. Sicuramente hai torto tu...',
      err503:'Uff, troppa gente in sala professori (server pieni). Riprova tra un momento!',
      err429:'Ho parlato troppo! Devo riprendere fiato: aspetta un minutino e riprova.',
      errAltro:'Il gesso si è rotto!',
      lavagnaVuota:'Ops... la lavagna è rimasta vuota. Riprova!',
      registro:'Il registro si è inceppato! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:78px;left:34px;z-index:1;transform:rotate(-3deg);background:#fdf6df;border:3px solid #c94f44;border-radius:6px;padding:8px 14px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Caveat\',cursive;font-weight:700;font-size:24px;color:#c94f44;animation:notewave 5s ease-in-out infinite;}.poster small{display:block;font-size:15px;color:#8a7658;line-height:1;}',
    decorHtml:'<div class="poster">A · B · C<small>l\'alfabeto non si tocca!</small></div>',
    boardExtraHtml:'', profExtraHtml:'', trayExtraHtml:'',
    svgProf:'<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/><rect x="70" y="196" width="18" height="48" rx="8" fill="#4a3b8f"/><rect x="102" y="196" width="18" height="48" rx="8" fill="#4a3b8f"/><rect x="64" y="240" width="30" height="12" rx="6" fill="#2e2645"/><rect x="96" y="240" width="30" height="12" rx="6" fill="#2e2645"/><path d="M52 200 Q50 120 95 116 Q140 120 138 200 Z" fill="#5a4fcf"/><path d="M78 122 l17 16 17-16 -6 34 h-22 Z" fill="#fff"/><path d="M95 130 l-6 16 6 12 6-12 z" fill="#e2574c"/><path d="M40 190 Q30 150 56 132 L66 146 Q48 162 54 188 Z" fill="#5a4fcf"/><path d="M150 190 Q168 140 134 128 L128 144 Q148 156 138 186 Z" fill="#5a4fcf"/><circle cx="148" cy="196" r="9" fill="#ffd9b3"/><rect x="140" y="150" width="7" height="44" rx="3.5" fill="#f2efe4" transform="rotate(14 143 172)"/><circle cx="95" cy="74" r="40" fill="#ffd9b3"/><path d="M58 56 Q95 26 132 56 L132 46 Q95 16 58 46 Z" fill="#8c8c9e"/><circle cx="80" cy="70" r="10" fill="#fff" stroke="#2e2645" stroke-width="3.5"/><circle cx="110" cy="70" r="10" fill="#fff" stroke="#2e2645" stroke-width="3.5"/><line x1="90" y1="70" x2="100" y2="70" stroke="#2e2645" stroke-width="3.5"/><circle cx="80" cy="71" r="3.5" fill="#2e2645"/><circle cx="110" cy="71" r="3.5" fill="#2e2645"/><path d="M70 92 Q82 80 95 92 Q108 80 120 92 Q108 106 95 94 Q82 106 70 92 Z" fill="#8c8c9e"/><path d="M52 42 L95 24 L138 42 L95 60 Z" fill="#2e2645"/><line x1="138" y1="42" x2="138" y2="60" stroke="#ffe14d" stroke-width="3"/><circle cx="138" cy="64" r="4.5" fill="#ffe14d"/>',
    head:'<circle cx="48" cy="52" r="30" fill="#ffd9b3"/><path d="M22 40 Q48 16 74 40 L74 32 Q48 8 22 32 Z" fill="#8c8c9e"/><circle cx="37" cy="49" r="8" fill="#fff" stroke="#2e2645" stroke-width="3"/><circle cx="59" cy="49" r="8" fill="#fff" stroke="#2e2645" stroke-width="3"/><line x1="45" y1="49" x2="51" y2="49" stroke="#2e2645" stroke-width="3"/><circle cx="37" cy="50" r="2.8" fill="#2e2645"/><circle cx="59" cy="50" r="2.8" fill="#2e2645"/><path d="M29 66 Q38 56 48 66 Q58 56 67 66 Q58 78 48 68 Q38 78 29 66 Z" fill="#8c8c9e"/><path d="M16 30 L48 16 L80 30 L48 44 Z" fill="#2e2645"/><line x1="80" y1="30" x2="80" y2="44" stroke="#ffe14d" stroke-width="2.5"/><circle cx="80" cy="47" r="3.5" fill="#ffe14d"/>'
  },

  confusione: {
    id:'confusione', nome:'Prof. Confusione', materia:'STORIA',
    label:'Aula di Storia', roomtitle:'Aula di Storia',
    boardtitle:'Storia — trova l\'errore!',
    tema:{ wall:'#ecd9b5', c:'#b3622e', d:'#8f4e24', dd:'#6e3c1b' },
    voce:{ pitch:1.0, rate:1.3 },
    teach:{ dur:'1.9s', kf:'0%,100%{transform:rotate(-2deg);} 50%{transform:rotate(2.5deg) translateY(-5px);}' },
    argomento:'storia', tipoErrore:'errore storico',
    stileCompito:'inserito con naturalezza nel tuo racconto da professore convinto di avere ragione. Tutto il resto deve essere storicamente corretto.',
    scusaBravo:'una scusa buffa da viaggiatore del tempo',
    persona:'Sei il Prof. Confusione, insegnante di storia in una scuola immaginaria per bambini.\nCARATTERE: frenetico, entusiasta, travolgente. Parli veloce, salti da un\'epoca all\'altra, e sei SICURISSIMO delle tue date anche quando sono assurde. NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore con scuse buffe ("colpa della macchina del tempo!", "i miei appunti erano capovolti!", "quel secolo si è spostato!").\n' + REGOLE,
    livelli:{
      facile:'bambini di 6-7 anni (classe 1ª-2ª): anacronismi evidentissimi e buffi (es. i dinosauri che giocano con i cavalieri, gli uomini primitivi col telefonino, i romani in automobile)',
      media:'bambini di 8-9 anni (classe 3ª-4ª): personaggi, popoli o invenzioni al posto sbagliato (es. le piramidi costruite dai vichinghi, Colombo che parte in aereo, gli egizi che scrivono al computer)',
      difficile:'ragazzi di 10-13 anni (classe 5ª e scuola media): date, sequenze e cause-effetto più sottili (es. ordine sbagliato di epoche o eventi, un personaggio storico nel secolo sbagliato, una scoperta attribuita alla persona sbagliata)'
    },
    benvenutoBolla:'Benvenuto, benvenuto! Io sono il Prof. Confusione: ho vissuto TUTTE le epoche! ...o quasi.',
    benvenutoLavagna:'Premi «NUOVA SPIEGAZIONE»! Vi racconterò la storia ESATTAMENTE com\'è andata... o quasi. Anzi: esattamente quasi!',
    placeholder:'Cosa non torna nella storia? Scrivi qui la tua correzione...',
    nokey:'Il Prof. Confusione non trova la porta... e tu non hai la chiave! Torna in corridoio e consegnala in segreteria.',
    msg:{
      preparo:'Un attimo... dove ho messo i miei appunti? Ah, eccoli! FORSE.',
      pronto:'Eccola! Storia pura, verificata di persona: c’ero anch\'io! Nessun errore, garantito al 99%... anzi 100!',
      noLezione:'Prima chiedimi una spiegazione, giovane viaggiatore del tempo!',
      vuoto:'La casella è vuota! Scrivi cosa non torna nella mia storia... se ci riesci!',
      controllo:'Mmm... fammi controllare sui miei appunti... quelli giusti, stavolta...',
      err503:'Troppa folla nella macchina del tempo (server pieni)! Riprova tra un momento.',
      err429:'Ho viaggiato troppo nel tempo! Devo riposare: aspetta un minutino e riprova.',
      errAltro:'Il gesso si è perso in un’altra epoca!',
      lavagnaVuota:'Ops... la lavagna è rimasta nel Medioevo. Riprova!',
      registro:'Il registro è finito nel 1200! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:76px;left:34px;z-index:1;transform:rotate(-3deg);background:#f5e7c0;border:3px solid var(--accent-d);border-radius:4px 14px 4px 14px;padding:8px 16px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Caveat\',cursive;font-weight:700;font-size:22px;color:var(--accent-d);animation:notewave 5s ease-in-out infinite;}.poster small{display:block;font-size:15px;color:#8a7658;line-height:1;}.paper{position:absolute;width:26px;height:34px;z-index:4;pointer-events:none;background:#fdf6df;border:2px solid #d9bd8a;border-radius:2px;animation:flyaround 6s ease-in-out infinite;}.paper::before{content:"";position:absolute;inset:6px 5px auto;height:2px;background:#d9bd8a;box-shadow:0 6px 0 #d9bd8a,0 12px 0 #d9bd8a;}@keyframes flyaround{0%,100%{transform:translate(0,0) rotate(-8deg);}25%{transform:translate(-14px,-22px) rotate(7deg);}50%{transform:translate(8px,-34px) rotate(-5deg);}75%{transform:translate(16px,-12px) rotate(10deg);}}',
    decorHtml:'<div class="poster">Linea del tempo<small>(più o meno in ordine)</small></div>',
    boardExtraHtml:'',
    profExtraHtml:'<span class="paper" style="top:90px; left:-6px;"></span><span class="paper" style="top:150px; right:-4px; animation-delay:-2s;"></span><span class="paper" style="top:60px; right:26px; animation-delay:-4s; width:20px; height:26px;"></span>',
    trayExtraHtml:'',
    svgProf:'<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/><rect x="70" y="196" width="18" height="48" rx="8" fill="#6e4520"/><rect x="102" y="196" width="18" height="48" rx="8" fill="#6e4520"/><rect x="64" y="240" width="30" height="12" rx="6" fill="#3d2712"/><rect x="96" y="240" width="30" height="12" rx="6" fill="#3d2712"/><path d="M52 200 Q50 120 95 116 Q140 120 138 200 Z" fill="#a06a38"/><path d="M78 122 l17 16 17-16 -6 34 h-22 Z" fill="#f5e7c0"/><path d="M95 130 l-6 16 6 12 6-12 z" fill="#4d8f4d"/><path d="M40 190 Q26 148 58 128 L68 144 Q46 160 54 188 Z" fill="#a06a38"/><path d="M150 190 Q172 138 132 124 L126 142 Q150 154 138 186 Z" fill="#a06a38"/><circle cx="146" cy="192" r="9" fill="#ffd9b3"/><rect x="136" y="146" width="9" height="48" rx="4.5" fill="#f5e7c0" transform="rotate(18 140 170)"/><rect x="132" y="142" width="17" height="8" rx="4" fill="#d9bd8a" transform="rotate(18 140 146)"/><circle cx="95" cy="74" r="40" fill="#ffd9b3"/><path d="M56 54 Q46 30 66 34 Q60 14 82 24 Q88 8 100 22 Q118 10 116 30 Q136 26 128 48 Q140 52 130 62 Q116 44 95 46 Q74 44 60 62 Q50 58 56 54 Z" fill="#d97a2e"/><circle cx="79" cy="70" r="8" fill="#fff"/><circle cx="112" cy="68" r="10" fill="#fff"/><circle cx="81" cy="71" r="3.5" fill="#2e2645"/><circle cx="114" cy="69" r="4.2" fill="#2e2645"/><ellipse cx="95" cy="96" rx="9" ry="6" fill="#7a4a2a"/><path d="M68 58 l10 -7 M124 56 l-10 -6" stroke="#d97a2e" stroke-width="3.5" stroke-linecap="round"/>',
    head:'<circle cx="48" cy="54" r="30" fill="#ffd9b3"/><path d="M20 44 Q12 20 30 26 Q26 8 46 18 Q52 4 62 18 Q80 10 74 28 Q88 26 76 46 Q66 32 48 34 Q30 32 20 44 Z" fill="#d97a2e"/><circle cx="37" cy="52" r="6.5" fill="#fff"/><circle cx="60" cy="50" r="8" fill="#fff"/><circle cx="38" cy="53" r="3" fill="#2e2645"/><circle cx="61" cy="51" r="3.6" fill="#2e2645"/><ellipse cx="48" cy="72" rx="7" ry="5" fill="#7a4a2a"/><path d="M26 40 l8 -6 M70 38 l-8 -5" stroke="#d97a2e" stroke-width="3" stroke-linecap="round"/>'
  },

  sbagliotti: {
    id:'sbagliotti', nome:'Prof. Sbagliotti', materia:'MATEMATICA',
    label:'Aula di Matematica', roomtitle:'Aula di Matematica',
    boardtitle:'Matematica — trova l\'errore!',
    tema:{ wall:'#d7dfe8', c:'#3b6ea5', d:'#2c4f78', dd:'#223d5c' },
    voce:{ pitch:1.3, rate:0.9 },
    teach:{ dur:'3.8s', kf:'0%,100%{transform:rotate(-.6deg);} 50%{transform:rotate(1.4deg) translateY(-2px);}' },
    argomento:'matematica', tipoErrore:'errore matematico',
    stileCompito:'inserito con naturalezza nel tuo discorso da professore convinto di avere ragione. Tutto il resto deve essere matematicamente corretto.',
    scusaBravo:'una scusa buffa da genio incompreso',
    persona:'Sei il Prof. Sbagliotti, insegnante di matematica in una scuola immaginaria per bambini.\nCARATTERE: ti credi un genio infallibile. Parli con voce nasale e tono di superiorità, ti vanti che "i numeri ti obbediscono". NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore con scuse buffe ("la calcolatrice era scarica!", "quel numero si è mosso da solo!", "era matematica sperimentale!").\n' + REGOLE,
    livelli:{
      facile:'bambini di 6-7 anni (classe 1ª-2ª): errori evidentissimi su addizioni e sottrazioni entro il 20, conte semplici, prima/dopo, maggiore/minore (es. 3 + 2 = 6, contare 1-2-3-5)',
      media:'bambini di 8-9 anni (classe 3ª-4ª): errori su tabelline, moltiplicazioni e divisioni semplici, forme geometriche (es. 6 × 7 = 44, il triangolo ha 4 lati, la metà di 10 è 6)',
      difficile:'ragazzi di 10-13 anni (classe 5ª e scuola media): errori più sottili su frazioni, percentuali, perimetri e aree, piccoli problemi con ragionamento (es. 1/2 è più piccolo di 1/4, il 50% di 80 è 30)'
    },
    benvenutoBolla:'Salve. Prof. Sbagliotti, genio matematico. I numeri mi temono e mi rispettano.',
    benvenutoLavagna:'Premi «NUOVA SPIEGAZIONE» e ammira: i numeri mi OBBEDISCONO. Se un conto sembra sbagliato, è il conto che si sbaglia, non io!',
    placeholder:'Quale conto non torna? Scrivi qui la tua correzione...',
    nokey:'Il Prof. Sbagliotti ha contato le chiavi: ne manca UNA, la tua! Torna in corridoio e consegnala in segreteria.',
    msg:{
      preparo:'Silenzio in aula! Un genio sta calcolando...',
      pronto:'Et voilà! Calcoli PERFETTI, verificati tre volte dal sottoscritto. Trovare un errore? Impossibile.',
      noLezione:'Prima chiedimi una spiegazione, piccolo matematico!',
      vuoto:'La casella è vuota! Zero parole = zero punti. Scrivi la tua correzione!',
      controllo:'Vediamo... ricontrollo i MIEI calcoli perfetti...',
      err503:'Troppi calcoli in corso nell’universo (server pieni)! Riprova tra un momento.',
      err429:'Ho calcolato troppo! Il mio cervello fuma: aspetta un minutino e riprova.',
      errAltro:'Il gesso ha sbagliato i conti!',
      lavagnaVuota:'Ops... la lavagna ha fatto zero assoluto. Riprova!',
      registro:'Il registro si è diviso per zero! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:76px;left:34px;z-index:1;transform:rotate(-3deg);background:#fdf6df;border:3px solid var(--accent-d);border-radius:6px;padding:8px 16px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Fredoka\',sans-serif;font-weight:700;font-size:22px;color:var(--accent-d);animation:notewave 5s ease-in-out infinite;}.poster .wrong{position:relative;color:#c94f44;}.poster .wrong::after{content:"";position:absolute;left:-4px;right:-4px;top:50%;height:3px;background:#c94f44;transform:rotate(-8deg);}.poster small{display:block;font-family:\'Caveat\',cursive;font-size:16px;color:#8a7658;line-height:1.1;}.numfloat{position:absolute;z-index:4;pointer-events:none;font-family:\'Fredoka\',sans-serif;font-weight:700;color:var(--accent);opacity:.75;animation:numdrift 5s ease-in-out infinite;}@keyframes numdrift{0%,100%{transform:translate(0,0) rotate(-6deg);}50%{transform:translate(6px,-18px) rotate(8deg);}}',
    decorHtml:'<div class="poster"><span class="wrong">2 + 2 = 5</span><small>matematica d\'avanguardia!</small></div>',
    boardExtraHtml:'',
    profExtraHtml:'<span class="numfloat" style="top:80px; left:-8px; font-size:26px;">7</span><span class="numfloat" style="top:140px; right:-6px; font-size:22px; animation-delay:-1.6s;">÷</span><span class="numfloat" style="top:56px; right:20px; font-size:24px; animation-delay:-3.2s;">π</span>',
    trayExtraHtml:'',
    svgProf:'<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/><rect x="70" y="196" width="18" height="48" rx="8" fill="#37304f"/><rect x="102" y="196" width="18" height="48" rx="8" fill="#37304f"/><rect x="64" y="240" width="30" height="12" rx="6" fill="#1e1a2e"/><rect x="96" y="240" width="30" height="12" rx="6" fill="#1e1a2e"/><path d="M52 200 Q50 120 95 116 Q140 120 138 200 Z" fill="#2c4f78"/><path d="M78 122 l17 16 17-16 -6 34 h-22 Z" fill="#fff"/><path d="M83 128 q12 10 24 0 l-4 10 q-8 6 -16 0 Z" fill="#c94f44"/><path d="M40 190 Q30 150 56 132 L66 146 Q48 162 54 188 Z" fill="#2c4f78"/><path d="M150 190 Q168 140 134 128 L128 144 Q148 156 138 186 Z" fill="#2c4f78"/><circle cx="148" cy="196" r="9" fill="#ffd9b3"/><rect x="141" y="144" width="8" height="52" rx="3" fill="#eeda9a" transform="rotate(12 145 170)"/><path d="M141 152 h8 M141 162 h8 M141 172 h8 M141 182 h8" stroke="#b8923f" stroke-width="2" transform="rotate(12 145 170)"/><circle cx="95" cy="74" r="40" fill="#ffd9b3"/><path d="M55 60 Q52 30 95 28 Q138 30 135 60 L135 48 Q120 30 95 30 Q70 30 55 48 Z" fill="#1e1a2e"/><path d="M57 52 Q75 38 95 38 Q115 38 133 52 Q118 42 95 42 Q72 42 57 52 Z" fill="#2e2645"/><circle cx="79" cy="70" r="7" fill="#2e2645"/><circle cx="112" cy="70" r="11" fill="#fff" stroke="#b8923f" stroke-width="3.5"/><circle cx="112" cy="70" r="4" fill="#2e2645"/><line x1="121" y1="78" x2="126" y2="94" stroke="#b8923f" stroke-width="2.5"/><path d="M70 96 Q82 108 100 98" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M66 58 l12 -5" stroke="#1e1a2e" stroke-width="3.5" stroke-linecap="round"/>',
    head:'<circle cx="48" cy="52" r="30" fill="#ffd9b3"/><path d="M22 38 Q30 22 48 24 Q66 22 74 38 L74 30 Q60 14 48 16 Q36 14 22 30 Z" fill="#2e2645"/><circle cx="60" cy="48" r="9" fill="#fff" stroke="#b8923f" stroke-width="3"/><circle cx="61" cy="49" r="3" fill="#2e2645"/><line x1="68" y1="54" x2="72" y2="66" stroke="#b8923f" stroke-width="2"/><circle cx="36" cy="48" r="4" fill="#2e2645"/><path d="M32 68 Q48 78 64 66" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M40 40 l-8 -4" stroke="#2e2645" stroke-width="3" stroke-linecap="round"/>'
  },

  terranova: {
    id:'terranova', nome:'Prof. Terranova', materia:'GEOGRAFIA',
    label:'Aula di Geografia', roomtitle:'Aula di Geografia',
    boardtitle:'Geografia — trova l\'errore!',
    tema:{ wall:'#d8e6cf', c:'#4d8f4d', d:'#3a6f3a', dd:'#2c552c' },
    voce:{ pitch:0.6, rate:0.8 },
    teach:{ dur:'4.6s', kf:'0%,100%{transform:rotate(-.8deg);} 50%{transform:rotate(1.2deg) translateY(-2px);}' },
    argomento:'geografia', tipoErrore:'errore geografico',
    stileCompito:'inserito con naturalezza nel tuo racconto da professore convinto di avere ragione. Tutto il resto deve essere geograficamente corretto.',
    scusaBravo:'una scusa buffa da esploratore',
    persona:'Sei il Prof. Terranova, insegnante di geografia in una scuola immaginaria per bambini.\nCARATTERE: esploratore solenne e maestoso. Parli lentamente, con gravità, come chi ha attraversato deserti e scalato montagne. Racconti sempre di "quando sei stato lì di persona". NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore con scuse buffe ("le mappe cambiano in continuazione!", "quel fiume si sarà spostato!", "la bussola era capovolta!").\n' + REGOLE,
    livelli:{
      facile:'bambini di 6-7 anni (classe 1ª-2ª): errori evidentissimi e buffi su mare/montagna, caldo/freddo, animali nel posto sbagliato (es. i pinguini nel deserto, il mare in cima alle montagne, i cammelli al Polo Nord)',
      media:'bambini di 8-9 anni (classe 3ª-4ª): errori su Italia e dintorni: regioni, capoluoghi, fiumi, monti, mari (es. il Po che attraversa la Sicilia, Venezia capitale d’Italia, le Alpi in mezzo al mare)',
      difficile:'ragazzi di 10-13 anni (classe 5ª e scuola media): errori più sottili su capitali del mondo, continenti, climi, oceani e punti cardinali (es. il Cairo capitale del Marocco, l’Australia nell’emisfero nord, il Danubio più lungo del Nilo)'
    },
    benvenutoBolla:'Salve, giovane esploratore. Io sono il Prof. Terranova: ho visto il mondo intero. Due volte. Forse tre.',
    benvenutoLavagna:'Premi «NUOVA SPIEGAZIONE», giovane esploratore. Ti porterò in terre lontane... che conosco come le mie tasche. Tasche molto, molto disordinate.',
    placeholder:'Cosa non torna nel viaggio? Scrivi qui la tua correzione...',
    nokey:'Il Prof. Terranova ha esplorato ogni angolo dell\'aula: la tua chiave non c\'è! Torna in corridoio e consegnala in segreteria.',
    msg:{
      preparo:'Hmm... consulto le mie mappe e i miei diari di viaggio...',
      pronto:'Ecco. Geografia vissuta in prima persona: io c’ero. Ogni parola è scolpita nella roccia. Roccia solidissima.',
      noLezione:'Prima chiedimi una spiegazione, giovane esploratore!',
      vuoto:'La casella è vuota come il deserto dei Gobi! Scrivi la tua correzione.',
      controllo:'Vediamo... riapro il mio diario di bordo...',
      err503:'Tempesta sulle rotte dei server! Riprova tra un momento, giovane esploratore.',
      err429:'Ho camminato troppo! Le mie gambe chiedono tregua: aspetta un minutino e riprova.',
      errAltro:'Il gesso è caduto in un burrone!',
      lavagnaVuota:'Ops... la lavagna si è persa senza bussola. Riprova!',
      registro:'Il registro è finito oltre l’orizzonte! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:76px;left:34px;z-index:1;transform:rotate(-3deg);background:#f5e7c0;border:3px solid var(--accent-d);border-radius:6px;padding:8px 14px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Caveat\',cursive;font-weight:700;font-size:20px;color:var(--accent-d);animation:notewave 5s ease-in-out infinite;}.poster small{display:block;font-size:14px;color:#8a7658;line-height:1.1;}.poster svg{display:block;margin:4px auto 0;}.globe{position:absolute;z-index:4;bottom:-6px;left:-24px;animation:globespin 7s ease-in-out infinite;transform-origin:bottom center;pointer-events:none;}@keyframes globespin{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(5deg);}}',
    decorHtml:'<div class="poster">Il mondo<small>(riveduto e scorretto)</small><svg width="90" height="46" viewBox="0 0 90 46"><rect x="0" y="0" width="90" height="46" rx="4" fill="#cde4f0"/><path d="M12 20 Q20 8 32 14 Q40 6 46 16 Q42 28 30 26 Q18 30 12 20 Z" fill="#7fb37f"/><path d="M56 26 Q66 18 78 24 Q80 34 68 38 Q56 36 56 26 Z" fill="#7fb37f"/><circle cx="70" cy="12" r="5" fill="#f2d98c"/></svg></div>',
    boardExtraHtml:'<svg class="globe" width="86" height="110" viewBox="0 0 86 110"><rect x="38" y="88" width="10" height="14" fill="#6b4423"/><path d="M26 102 h34 l4 8 h-42 Z" fill="#8a5a33"/><circle cx="43" cy="48" r="40" fill="#9fcbe0"/><path d="M18 34 Q30 18 46 26 Q58 16 66 30 Q60 44 46 40 Q30 48 18 34 Z" fill="#7fb37f"/><path d="M36 62 Q50 54 64 62 Q62 76 48 78 Q38 74 36 62 Z" fill="#7fb37f"/><ellipse cx="43" cy="48" rx="40" ry="40" fill="none" stroke="#5a8aa5" stroke-width="2"/><ellipse cx="43" cy="48" rx="16" ry="40" fill="none" stroke="#5a8aa5" stroke-width="1.5" opacity=".6"/><line x1="3" y1="48" x2="83" y2="48" stroke="#5a8aa5" stroke-width="1.5" opacity=".6"/><line x1="43" y1="4" x2="43" y2="10" stroke="#6b4423" stroke-width="4"/></svg>',
    profExtraHtml:'', trayExtraHtml:'',
    svgProf:'<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/><rect x="70" y="196" width="18" height="48" rx="8" fill="#7a6340"/><rect x="102" y="196" width="18" height="48" rx="8" fill="#7a6340"/><path d="M62 238 h32 v14 h-36 Z" fill="#4a3524"/><path d="M96 238 h32 v14 h-36 Z" fill="#4a3524"/><path d="M52 200 Q50 120 95 116 Q140 120 138 200 Z" fill="#b09a6a"/><path d="M78 122 l17 16 17-16 -6 34 h-22 Z" fill="#e8dcc0"/><path d="M62 130 h66 M62 150 h66" stroke="#8a744a" stroke-width="3" opacity=".5"/><rect x="72" y="158" width="16" height="14" rx="3" fill="#8a744a"/><rect x="102" y="158" width="16" height="14" rx="3" fill="#8a744a"/><path d="M40 190 Q30 150 56 132 L66 146 Q48 162 54 188 Z" fill="#b09a6a"/><path d="M150 190 Q168 140 134 128 L128 144 Q148 156 138 186 Z" fill="#b09a6a"/><circle cx="148" cy="196" r="9" fill="#e8b98a"/><path d="M138 168 q10 -6 18 0 l-2 10 q-7 -4 -14 0 Z" fill="#4a3524"/><circle cx="141" cy="184" r="7" fill="none" stroke="#4a3524" stroke-width="3.5"/><circle cx="155" cy="184" r="7" fill="none" stroke="#4a3524" stroke-width="3.5"/><circle cx="95" cy="74" r="40" fill="#e8b98a"/><path d="M60 84 Q60 110 95 112 Q130 110 130 84 Q120 100 95 100 Q70 100 60 84 Z" fill="#8c8c9e"/><circle cx="80" cy="66" r="4" fill="#2e2645"/><circle cx="110" cy="66" r="4" fill="#2e2645"/><path d="M72 58 l14 -4 M118 58 l-14 -4" stroke="#4a3524" stroke-width="4" stroke-linecap="round"/><path d="M48 52 Q95 22 142 52 L136 36 Q95 8 54 36 Z" fill="#8a6f3d"/><rect x="44" y="48" width="102" height="9" rx="4.5" fill="#6e5730"/><path d="M60 53 h70" stroke="#c94f44" stroke-width="4"/>',
    head:'<circle cx="48" cy="52" r="30" fill="#e8b98a"/><path d="M24 62 Q24 88 48 88 Q72 88 72 62 Q64 74 48 74 Q32 74 24 62 Z" fill="#6b4423"/><circle cx="37" cy="48" r="3.5" fill="#2e2645"/><circle cx="59" cy="48" r="3.5" fill="#2e2645"/><path d="M30 40 l12 -3 M66 40 l-12 -3" stroke="#4a3524" stroke-width="3.5" stroke-linecap="round"/><path d="M14 34 Q48 10 82 34 L78 22 Q48 2 18 22 Z" fill="#8a6f3d"/><rect x="12" y="32" width="72" height="7" rx="3.5" fill="#6e5730"/>'
  },

  bubbolo: {
    id:'bubbolo', nome:'Prof. Bubbolo', materia:'SCIENZE',
    label:'Aula di Scienze', roomtitle:'Aula di Scienze',
    boardtitle:'Scienze — trova l\'errore!',
    tema:{ wall:'#d2e9e6', c:'#2aa198', d:'#1f7d76', dd:'#175f5a' },
    voce:{ pitch:1.5, rate:1.1 },
    teach:{ dur:'2.2s', kf:'0%,100%{transform:rotate(-1.6deg) translateY(0);} 50%{transform:rotate(2deg) translateY(-6px);}' },
    argomento:'scienze', tipoErrore:'errore scientifico',
    stileCompito:'annunciato con entusiasmo travolgente da professore convinto di avere ragione. Tutto il resto deve essere scientificamente corretto.',
    scusaBravo:'una scusa buffa da scienziato pasticcione',
    persona:'Sei il Prof. Bubbolo, insegnante di scienze in una scuola immaginaria per bambini.\nCARATTERE: entusiasta esplosivo! Tutto è "STRAORDINARIO!", "INCREDIBILE!", "FANTASCIENTIFICO!". Usi spesso i punti esclamativi e le parole in maiuscolo. NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore con scuse buffe ("era tutto parte dell\'esperimento!", "la provetta mi ha distratto!", "colpa della gravità!").\n' + REGOLE,
    livelli:{
      facile:'bambini di 6-7 anni (classe 1ª-2ª): errori evidentissimi e buffi su animali e piante (es. i pesci che respirano fuori dall’acqua, le piante che mangiano la merenda, i gatti che nascono dalle uova)',
      media:'bambini di 8-9 anni (classe 3ª-4ª): errori su corpo umano, stati dell’acqua, catene alimentari (es. il cuore che serve per pensare, il ghiaccio più caldo dell’acqua, i leoni che mangiano l’erba)',
      difficile:'ragazzi di 10-13 anni (classe 5ª e scuola media): errori più sottili su sistema solare, energia, ecosistemi, fotosintesi (es. il Sole che gira intorno alla Terra, le piante che respirano solo ossigeno, la Luna che brilla di luce propria)'
    },
    benvenutoBolla:'CIAO! Io sono il Prof. Bubbolo e la scienza è STRAORDINARIA! Anche quando esplode. SOPRATTUTTO quando esplode!',
    benvenutoLavagna:'Premi «NUOVA SPIEGAZIONE» e preparati: la scienza è STRAORDINARIA! I miei esperimenti riescono sempre... al novanta percento. Va bene, al settanta.',
    placeholder:'Quale esperimento non torna? Scrivi qui la tua correzione...',
    nokey:'Il Prof. Bubbolo ha analizzato l\'aula al microscopio: la tua chiave non c\'è! Torna in corridoio e consegnala in segreteria.',
    msg:{
      preparo:'ESPERIMENTO IN CORSO! Non toccate NIENTE!',
      pronto:'EUREKA! Lezione pronta! Scienza pura al 100%! Ho controllato con il microscopio! Quello rotto, ma ho controllato!',
      noLezione:'Prima chiedimi una spiegazione, piccolo scienziato!',
      vuoto:'La casella è VUOTA come il vuoto cosmico! Scrivi la tua correzione!',
      controllo:'ANALISI IN CORSO... controllo con tutti i miei strumenti!',
      err503:'Il laboratorio è AFFOLLATISSIMO (server pieni)! Riprova tra un momento!',
      err429:'TROPPI ESPERIMENTI! Il laboratorio fuma: aspetta un minutino e riprova!',
      errAltro:'Il gesso è ESPLOSO!',
      lavagnaVuota:'Ops... la lavagna è evaporata. Riprova!',
      registro:'Il registro si è sciolto nell’acido! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:76px;left:34px;z-index:1;transform:rotate(-3deg);background:#fdf6df;border:3px solid var(--accent-d);border-radius:6px;padding:8px 16px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Caveat\',cursive;font-weight:700;font-size:20px;color:var(--accent-d);text-align:center;animation:notewave 5s ease-in-out infinite;}.poster small{display:block;font-size:14px;color:#8a7658;line-height:1.1;}.poster svg{display:block;margin:2px auto 0;}.poster .orbit{animation:orb 5s linear infinite;transform-origin:30px 22px;}@keyframes orb{to{transform:rotate(360deg);}}.flask{position:absolute;z-index:4;bottom:-8px;left:-20px;pointer-events:none;}.bubbleup{position:absolute;border-radius:50%;border:2px solid var(--accent);opacity:0;animation:rise 3s ease-in infinite;}@keyframes rise{0%{transform:translateY(0) scale(.5);opacity:0;}20%{opacity:.9;}100%{transform:translateY(-70px) scale(1.15);opacity:0;}}',
    decorHtml:'<div class="poster">L\'ATOMO!<svg width="60" height="44" viewBox="0 0 60 44"><circle cx="30" cy="22" r="5" fill="#e2574c"/><g class="orbit"><ellipse cx="30" cy="22" rx="26" ry="10" fill="none" stroke="#2aa198" stroke-width="2"/><circle cx="56" cy="22" r="3.5" fill="#3b6ea5"/></g><ellipse cx="30" cy="22" rx="26" ry="10" fill="none" stroke="#2aa198" stroke-width="1.5" transform="rotate(60 30 22)" opacity=".6"/></svg><small>(più o meno così)</small></div>',
    boardExtraHtml:'<div class="flask"><svg width="80" height="100" viewBox="0 0 80 100"><path d="M34 12 h12 v26 L66 78 q4 10 -6 12 h-40 q-10 -2 -6 -12 L34 38 Z" fill="rgba(42,161,152,.25)" stroke="var(--accent-d)" stroke-width="3"/><path d="M22 74 L58 74 q6 8 -2 12 h-32 q-8 -4 -6 -12 Z" fill="rgba(42,161,152,.55)"/><rect x="30" y="6" width="20" height="8" rx="4" fill="#8a5a33"/></svg><span class="bubbleup" style="left:34px; bottom:26px; width:8px; height:8px;"></span><span class="bubbleup" style="left:44px; bottom:22px; width:6px; height:6px; animation-delay:-1s;"></span><span class="bubbleup" style="left:26px; bottom:20px; width:10px; height:10px; animation-delay:-2s;"></span></div>',
    profExtraHtml:'', trayExtraHtml:'',
    svgProf:'<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/><rect x="70" y="196" width="18" height="48" rx="8" fill="#546e7a"/><rect x="102" y="196" width="18" height="48" rx="8" fill="#546e7a"/><rect x="64" y="240" width="30" height="12" rx="6" fill="#2e3d45"/><rect x="96" y="240" width="30" height="12" rx="6" fill="#2e3d45"/><path d="M50 202 Q48 118 95 114 Q142 118 140 202 L126 202 L122 140 L68 140 L64 202 Z" fill="#f2efe8"/><path d="M68 140 h54 l-4 62 h-46 Z" fill="#e3ded2"/><path d="M95 128 l-7 14 7 12 7-12 z" fill="#2aa198"/><circle cx="86" cy="168" r="3" fill="#8a8a7a"/><circle cx="86" cy="184" r="3" fill="#8a8a7a"/><rect x="100" y="158" width="14" height="18" rx="2" fill="#fff" stroke="#8a8a7a" stroke-width="2"/><path d="M103 162 h8 M103 167 h8 M103 172 h5" stroke="#2aa198" stroke-width="1.5"/><path d="M38 192 Q26 148 58 130 L68 146 Q46 160 52 190 Z" fill="#f2efe8"/><path d="M152 192 Q172 140 132 126 L126 144 Q152 154 140 188 Z" fill="#f2efe8"/><circle cx="146" cy="198" r="10" fill="#7fd4cc"/><rect x="138" y="140" width="10" height="46" rx="5" fill="rgba(42,161,152,.35)" stroke="#1f7d76" stroke-width="2.5" transform="rotate(16 143 163)"/><circle cx="95" cy="74" r="40" fill="#ffd9b3"/><path d="M60 52 Q66 40 74 44 M130 52 Q124 40 116 44" stroke="#bdbdbd" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M62 34 Q95 20 128 34 L128 26 Q95 12 62 26 Z" fill="#e5b93c"/><circle cx="74" cy="30" r="8" fill="#cfeef0" stroke="#546e7a" stroke-width="3"/><circle cx="116" cy="30" r="8" fill="#cfeef0" stroke="#546e7a" stroke-width="3"/><circle cx="79" cy="68" r="11" fill="#cfeef0" stroke="#546e7a" stroke-width="3.5"/><circle cx="112" cy="68" r="11" fill="#cfeef0" stroke="#546e7a" stroke-width="3.5"/><line x1="90" y1="68" x2="101" y2="68" stroke="#546e7a" stroke-width="3.5"/><circle cx="80" cy="69" r="3.5" fill="#2e2645"/><circle cx="113" cy="69" r="3.5" fill="#2e2645"/><path d="M74 94 Q95 112 118 92" stroke="#2e2645" stroke-width="4" fill="none" stroke-linecap="round"/>',
    head:'<circle cx="48" cy="54" r="30" fill="#ffd9b3"/><path d="M22 42 Q26 30 34 30 Q28 40 30 46 Z M74 42 Q70 30 62 30 Q68 40 66 46 Z" fill="#bdbdbd"/><circle cx="37" cy="50" r="10" fill="#cfeef0" stroke="#546e7a" stroke-width="3.5"/><circle cx="61" cy="50" r="10" fill="#cfeef0" stroke="#546e7a" stroke-width="3.5"/><line x1="47" y1="50" x2="51" y2="50" stroke="#546e7a" stroke-width="3.5"/><circle cx="38" cy="51" r="3" fill="#2e2645"/><circle cx="62" cy="51" r="3" fill="#2e2645"/><path d="M34 70 Q48 82 62 70" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="76" cy="30" r="5" fill="none" stroke="#2aa198" stroke-width="2.5"/><circle cx="84" cy="18" r="3.5" fill="none" stroke="#2aa198" stroke-width="2"/>'
  },

  storditella: {
    id:'storditella', nome:'Prof.ssa Storditella', materia:'ARTE',
    label:'Aula di Arte', roomtitle:'Aula di Arte',
    boardtitle:'Arte — trova l\'errore!',
    tema:{ wall:'#f0dce9', c:'#c75b9b', d:'#a34579', dd:'#7d355d' },
    voce:{ pitch:1.2, rate:0.95 },
    teach:{ dur:'5s', kf:'0%,100%{transform:rotate(-1.4deg);} 40%{transform:rotate(1deg) translateY(-4px);} 60%{transform:rotate(.4deg) translateY(-1px);}' },
    argomento:'arte', tipoErrore:'errore',
    stileCompito:'inserito con naturalezza nel tuo racconto da professoressa convinta di avere ragione. Tutto il resto deve essere corretto.',
    scusaBravo:'una scusa buffa da artista distratta',
    gongola:'gongola con dolcezza',
    persona:'Sei la Prof.ssa Storditella, insegnante di arte in una scuola immaginaria per bambini.\nCARATTERE: sognante, dolce e distrattissima. Ti incanti a metà frase, usi spesso i puntini di sospensione, ti perdi in dettagli poetici ("che meraviglia quel blu..."). Sei convinta di ricordare tutto perfettamente. NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore con scuse buffe ("ero distratta da quel tramonto...", "il pennello ha deciso da solo!", "i colori si sono confusi tra loro!").\n' + REGOLE,
    livelli:{
      facile:'bambini di 6-7 anni (classe 1ª-2ª): errori evidentissimi e buffi sui colori e sulle forme (es. mescolando blu e giallo viene il rosso, il sole si colora di verde, il cerchio ha gli angoli)',
      media:'bambini di 8-9 anni (classe 3ª-4ª): errori su colori primari e secondari, materiali e tecniche (es. l’arcobaleno ha due colori, si dipinge sulla tela con la scopa, la creta si scolpisce con la gomma)',
      difficile:'ragazzi di 10-13 anni (classe 5ª e scuola media): errori più sottili su artisti, opere famose e tecniche (es. la Gioconda dipinta da Picasso, Van Gogh famoso per i cerchi neri, gli affreschi dipinti sui vetri)'
    },
    benvenutoBolla:'Oh, ciao caro... io sono la Prof.ssa Storditella. Amo l\'arte, i colori e... oh, guarda che bella nuvola!',
    benvenutoLavagna:'Premi «NUOVA SPIEGAZIONE», tesoro. Ti racconterò dell\'arte, dei colori, dei grandi pittori... se non mi distraggo. Cosa stavo dicendo?',
    placeholder:'Cosa non torna nel quadro? Scrivi qui la tua correzione...',
    nokey:'La Prof.ssa Storditella stava per aprirti... poi si è distratta. E comunque manca la tua chiave! Torna in corridoio e consegnala in segreteria.',
    msg:{
      preparo:'Un momento, caro... stavo pensando a... com’era? Ah sì, la lezione!',
      pronto:'Ecco, tesoro... una lezione dipinta con cura. È tutta giusta, me la ricordo... benissimo. Credo.',
      noLezione:'Prima chiedimi una spiegazione, piccolo artista!',
      vuoto:'La casella è bianca come una tela nuova! Scrivi la tua correzione, caro.',
      controllo:'Vediamo... dove ho messo gli occhiali? Ah, li ho in testa...',
      err503:'Oh cielo, l’atelier è affollatissimo (server pieni)... riprova tra un momento, caro.',
      err429:'Ho dipinto troppo! La mia tavolozza è stanca: aspetta un minutino e riprova.',
      errAltro:'Il gesso si è... oh, dov’è finito?',
      lavagnaVuota:'Ops... la lavagna è rimasta un quadro bianco. Riprova!',
      registro:'Il registro è finito sotto un barattolo di tempera! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:76px;left:34px;z-index:1;transform:rotate(-3deg);background:#fdf6df;border:6px solid #b8923f;border-radius:4px;padding:6px 12px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Caveat\',cursive;font-weight:700;font-size:19px;color:var(--accent-d);text-align:center;animation:notewave 5s ease-in-out infinite;}.poster small{display:block;font-size:14px;color:#8a7658;line-height:1.1;}.poster svg{display:block;margin:2px auto 0;}.easel{position:absolute;z-index:4;bottom:-8px;left:-26px;pointer-events:none;animation:easelwob 6s ease-in-out infinite;transform-origin:bottom center;}@keyframes easelwob{0%,100%{transform:rotate(-1deg);}50%{transform:rotate(1.2deg);}}.drip{position:absolute;width:7px;height:10px;border-radius:50% 50% 60% 60%;opacity:0;animation:dripfall 4.5s ease-in infinite;pointer-events:none;}@keyframes dripfall{0%,60%{transform:translateY(0);opacity:0;}65%{opacity:.9;}100%{transform:translateY(46px);opacity:0;}}.chalkpiece.p{background:#e8b3d1;width:36px;transform:rotate(-2deg);}',
    decorHtml:'<div class="poster"><svg width="70" height="42" viewBox="0 0 70 42"><rect width="70" height="42" rx="3" fill="#cde4f0"/><circle cx="52" cy="12" r="7" fill="#f2d98c"/><path d="M0 34 Q18 18 34 30 Q50 40 70 26 L70 42 L0 42 Z" fill="#7fb37f"/></svg><small>capolavoro... di chi?</small></div>',
    boardExtraHtml:'<div class="easel"><svg width="100" height="130" viewBox="0 0 100 130"><line x1="20" y1="126" x2="50" y2="16" stroke="#6b4423" stroke-width="6" stroke-linecap="round"/><line x1="80" y1="126" x2="50" y2="16" stroke="#6b4423" stroke-width="6" stroke-linecap="round"/><line x1="50" y1="70" x2="50" y2="126" stroke="#6b4423" stroke-width="5" stroke-linecap="round"/><rect x="22" y="26" width="56" height="44" rx="3" fill="#fdf6df" stroke="#b8923f" stroke-width="3"/><path d="M30 58 Q42 40 52 52 Q62 62 72 48" stroke="#c75b9b" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="38" cy="38" r="5" fill="#f2d98c"/><rect x="26" y="72" width="48" height="6" rx="3" fill="#8a5a33"/></svg><span class="drip" style="left:34px; top:64px; background:#c75b9b;"></span><span class="drip" style="left:56px; top:64px; background:#3b6ea5; animation-delay:-2.2s;"></span></div>',
    profExtraHtml:'',
    trayExtraHtml:'<div class="chalkpiece p"></div>',
    svgProf:'<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/><path d="M60 196 Q60 244 70 252 h14 Q80 224 84 200 Z" fill="#8a6a9e"/><path d="M130 196 Q130 244 120 252 h-14 Q110 224 106 200 Z" fill="#8a6a9e"/><ellipse cx="77" cy="252" rx="16" ry="7" fill="#c75b9b"/><ellipse cx="113" cy="252" rx="16" ry="7" fill="#c75b9b"/><path d="M50 204 Q48 122 95 118 Q142 122 140 204 Q118 214 95 214 Q72 214 50 204 Z" fill="#a486b8"/><path d="M62 148 h66 l-6 58 q-27 10 -54 0 Z" fill="#e8dcc0"/><circle cx="80" cy="168" r="5" fill="#c75b9b"/><circle cx="104" cy="186" r="7" fill="#3b6ea5" opacity=".8"/><circle cx="92" cy="176" r="4" fill="#e5b93c"/><path d="M38 192 Q28 150 56 132 L66 146 Q46 162 52 190 Z" fill="#a486b8"/><path d="M152 192 Q170 142 132 128 L126 146 Q150 156 140 188 Z" fill="#a486b8"/><circle cx="146" cy="198" r="9" fill="#ffd9b3"/><path d="M128 186 q-4 -18 12 -22 q18 -2 20 12 q2 12 -12 16 q-16 2 -20 -6 Z" fill="#c8a86a"/><circle cx="138" cy="176" r="3.5" fill="#c94f44"/><circle cx="148" cy="172" r="3.5" fill="#3b6ea5"/><circle cx="156" cy="178" r="3.5" fill="#e5b93c"/><circle cx="95" cy="74" r="40" fill="#ffd9b3"/><path d="M56 62 Q52 26 95 24 Q138 26 134 62 Q126 40 95 38 Q64 40 56 62 Z" fill="#7a4a2a"/><circle cx="95" cy="18" r="14" fill="#7a4a2a"/><rect x="102" y="0" width="6" height="26" rx="3" fill="#c75b9b" transform="rotate(28 105 13)"/><path d="M54 30 Q72 12 95 14 L95 26 Q72 24 58 40 Z" fill="#c75b9b"/><circle cx="58" cy="32" r="7" fill="#c75b9b"/><path d="M70 66 q6 -7 12 0 M108 66 q6 -7 12 0" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M74 60 q6 -4 10 -1 M116 59 q-6 -4 -10 -1" stroke="#7a4a2a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M84 94 Q95 102 108 92" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="70" cy="82" r="5" fill="rgba(199,91,155,.35)"/><circle cx="121" cy="82" r="5" fill="rgba(199,91,155,.35)"/>',
    head:'<circle cx="48" cy="54" r="30" fill="#ffd9b3"/><path d="M20 46 Q16 18 48 18 Q80 18 76 46 Q70 30 48 30 Q26 30 20 46 Z" fill="#7a4a2a"/><circle cx="48" cy="16" r="12" fill="#7a4a2a"/><rect x="54" y="2" width="5" height="22" rx="2.5" fill="#c75b9b" transform="rotate(24 56 13)"/><path d="M33 50 q4 -5 8 0 M55 50 q4 -5 8 0" stroke="#2e2645" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M40 68 Q48 74 56 68" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="30" cy="60" r="4" fill="rgba(199,91,155,.4)"/><circle cx="66" cy="60" r="4" fill="rgba(199,91,155,.4)"/>'
  }
};

/* ============================================================
   PROFESSORACCI CUSTOM (creati dall'insegnante/educatore)
   ============================================================ */
var LS_CUSTOM = 'professoracci_custom';
var LS_MATERIALE = 'professoracci_materiale';

function getCustomList() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]'); }
  catch (e) { return []; }
}
function saveCustomProf(p) {
  var list = getCustomList();
  var i = list.findIndex(function (x) { return x.id === p.id; });
  if (i >= 0) list[i] = p; else list.push(p);
  localStorage.setItem(LS_CUSTOM, JSON.stringify(list));
}
function deleteCustomProf(id) {
  localStorage.setItem(LS_CUSTOM, JSON.stringify(
    getCustomList().filter(function (x) { return x.id !== id; })
  ));
  clearMateriale(id);
}

/* Trasforma un prof custom salvato in una config completa da aula */
function buildCustomConfig(p) {
  var pal = PALETTE.find(function (x) { return x.id === p.colore; }) || PALETTE[0];
  var mat = p.materia || 'la mia materia';
  var matUp = mat.toUpperCase();
  return {
    id: p.id, nome: p.nome, materia: matUp, custom: true, raw: p,
    label: 'Aula di ' + capitalizza(mat), roomtitle: 'Aula di ' + capitalizza(mat),
    boardtitle: capitalizza(mat) + ' — trova l\'errore!',
    tema: { wall: pal.wall, c: pal.c, d: pal.d, dd: pal.dd },
    voce: { pitch: p.voce && p.voce.pitch != null ? p.voce.pitch : 1.0,
            rate:  p.voce && p.voce.rate  != null ? p.voce.rate  : 1.0 },
    teach: { dur:'3.4s', kf:'0%,100%{transform:rotate(-1deg);} 50%{transform:rotate(2deg) translateY(-3px);}' },
    argomento: mat, tipoErrore: 'errore',
    stileCompito: 'inserito con naturalezza nel tuo discorso da insegnante convinto di avere ragione. Tutto il resto deve essere corretto.',
    scusaBravo: 'una scusa buffa nel tuo stile',
    persona: 'Sei ' + p.nome + ', insegnante di ' + mat + ' in una scuola immaginaria per bambini e ragazzi.\n' +
      'CARATTERE: ' + (p.carattere || 'simpatico e un po\' pasticcione') + '. NON ammetti mai spontaneamente di sbagliare. Quando un bambino ti corregge giustamente, ammetti l\'errore a malincuore, con scuse buffe e teatrali.\n' + REGOLE,
    livelli: {
      facile: 'bambini di 6-7 anni (classe 1ª-2ª): errori molto evidenti e buffi su ' + mat + ', riconoscibili anche da chi ha appena iniziato',
      media: 'bambini di 8-9 anni (classe 3ª-4ª): errori chiari ma meno vistosi su ' + mat,
      difficile: 'ragazzi di 10-13 anni (classe 5ª e scuola media): errori più sottili su ' + mat + ', che richiedono attenzione'
    },
    benvenutoBolla: 'Benvenuto nella MIA aula! Io sono ' + p.nome + ': ' + mat + ' non ha segreti per me. Nessuno. Quasi.',
    benvenutoLavagna: 'Premi «NUOVA SPIEGAZIONE» e ascolta bene: le mie lezioni sono perfette... quasi sempre. Trova tu quello che non torna!',
    placeholder: 'Dov\'è l\'errore, professore? Scrivi qui la tua correzione...',
    nokey: p.nome + ' non apre l\'aula senza la chiave. Torna in corridoio e consegnala in segreteria.',
    msg: {
      preparo:'Un attimo... sto preparando una lezione PERFETTA. Come sempre.',
      pronto:'Ecco fatto! Una lezione impeccabile. Trovare errori? Impossibile. Ovviamente.',
      noLezione:'Prima chiedimi una spiegazione!',
      vuoto:'La casella è vuota! Scrivi qui dove ho... ehm, dove LA LAVAGNA ha sbagliato.',
      controllo:'Mmm... fammi controllare. Sicuramente hai torto tu...',
      err503:'La scuola è affollatissima (server pieni)! Riprova tra un momento.',
      err429:'Ho parlato troppo! Devo riprendere fiato: aspetta un minutino e riprova.',
      errAltro:'Il gesso si è rotto!',
      lavagnaVuota:'Ops... la lavagna è rimasta vuota. Riprova!',
      registro:'Il registro si è inceppato! Riprova a consegnarmi la risposta.'
    },
    decorCss:'.poster{position:absolute;top:78px;left:34px;z-index:1;transform:rotate(-3deg);background:#fdf6df;border:3px solid var(--accent-d);border-radius:6px;padding:8px 14px;box-shadow:0 6px 14px rgba(0,0,0,.2);font-family:\'Caveat\',cursive;font-weight:700;font-size:22px;color:var(--accent-d);animation:notewave 5s ease-in-out infinite;}.poster small{display:block;font-size:15px;color:#8a7658;line-height:1;}',
    decorHtml:'<div class="poster">' + escapeHtml(capitalizza(mat)) + '<small>lezione in corso!</small></div>',
    boardExtraHtml:'', profExtraHtml:'', trayExtraHtml:'',
    svgProf: buildProfSvg(p.avatar || {}),
    head: buildHeadSvg(p.avatar || {})
  };
}

function getProf(id) {
  if (PROFS[id]) return PROFS[id];
  var c = getCustomList().find(function (x) { return x.id === id; });
  return c ? buildCustomConfig(c) : null;
}

function capitalizza(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   MATERIALE DELLA LEZIONE (per prof) — resta sul dispositivo
   ============================================================ */
var MAX_MATERIALE = 15000; // caratteri conservati

function getAllMateriale() {
  try { return JSON.parse(localStorage.getItem(LS_MATERIALE) || '{}'); }
  catch (e) { return {}; }
}
function getMateriale(profId) { return getAllMateriale()[profId] || null; }
function setMateriale(profId, m) {
  var all = getAllMateriale();
  all[profId] = {
    titolo: (m.titolo || 'Materiale della lezione').slice(0, 120),
    testo: (m.testo || '').slice(0, MAX_MATERIALE),
    fonte: m.fonte || 'testo',
    data: new Date().toISOString().slice(0, 10)
  };
  try { localStorage.setItem(LS_MATERIALE, JSON.stringify(all)); return true; }
  catch (e) { return false; } // quota piena
}
function clearMateriale(profId) {
  var all = getAllMateriale();
  delete all[profId];
  localStorage.setItem(LS_MATERIALE, JSON.stringify(all));
}

/* ============================================================
   AVATAR COMPONIBILE (per i prof custom)
   Stesse proporzioni dei prof di ruolo: viewBox 0 0 190 260
   ============================================================ */
var AVATAR_OPZIONI = {
  pelle:    ['#ffd9b3', '#e8b98a', '#c68863', '#8d5a3a'],
  vestito:  ['#5a4fcf', '#a06a38', '#2c4f78', '#3a6f3a', '#2aa198', '#c75b9b', '#c94f44', '#8a6a9e'],
  capelli:  ['nessuno', 'corti', 'spettinati', 'lunghi', 'chignon'],
  colcap:   ['#2e2645', '#7a4a2a', '#d97a2e', '#8c8c9e', '#e5b93c'],
  occhiali: ['nessuno', 'tondi', 'quadrati', 'monocolo'],
  cappello: ['nessuno', 'tocco', 'berretto', 'fiore'],
  baffi:    ['nessuno', 'baffi', 'barba'],
  oggetto:  ['nessuno', 'libro', 'righello', 'provetta', 'pennello', 'mappamondo']
};
var AVATAR_DEFAULT = {
  pelle:'#ffd9b3', vestito:'#5a4fcf', capelli:'corti', colcap:'#2e2645',
  occhiali:'tondi', cappello:'nessuno', baffi:'nessuno', oggetto:'libro'
};

function scuro(hex, f) { // scurisce un colore hex di un fattore 0-1
  var n = parseInt(hex.slice(1), 16);
  var r = Math.round(((n >> 16) & 255) * (1 - f));
  var g = Math.round(((n >> 8) & 255) * (1 - f));
  var b = Math.round((n & 255) * (1 - f));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function avatarParts(a) {
  a = Object.assign({}, AVATAR_DEFAULT, a || {});
  var v = a.vestito, vd = scuro(v, 0.35), vdd = scuro(v, 0.6), pelle = a.pelle, cc = a.colcap;
  var s = [];

  /* ombra, gambe, scarpe, toga, colletto+cravatta, braccia, mano */
  s.push('<ellipse cx="95" cy="250" rx="60" ry="9" fill="rgba(0,0,0,.25)"/>');
  s.push('<rect x="70" y="196" width="18" height="48" rx="8" fill="' + vd + '"/>');
  s.push('<rect x="102" y="196" width="18" height="48" rx="8" fill="' + vd + '"/>');
  s.push('<rect x="64" y="240" width="30" height="12" rx="6" fill="' + vdd + '"/>');
  s.push('<rect x="96" y="240" width="30" height="12" rx="6" fill="' + vdd + '"/>');
  s.push('<path d="M52 200 Q50 120 95 116 Q140 120 138 200 Z" fill="' + v + '"/>');
  s.push('<path d="M78 122 l17 16 17-16 -6 34 h-22 Z" fill="#fff"/>');
  s.push('<path d="M95 130 l-6 16 6 12 6-12 z" fill="#e2574c"/>');
  s.push('<path d="M40 190 Q30 150 56 132 L66 146 Q48 162 54 188 Z" fill="' + v + '"/>');
  s.push('<path d="M150 190 Q168 140 134 128 L128 144 Q148 156 138 186 Z" fill="' + v + '"/>');
  s.push('<circle cx="148" cy="196" r="9" fill="' + pelle + '"/>');

  /* oggetto in mano */
  var ogg = {
    libro:'<rect x="134" y="150" width="22" height="30" rx="2" fill="#c94f44" transform="rotate(10 145 165)"/><rect x="137" y="153" width="16" height="24" rx="1" fill="#fdf6df" transform="rotate(10 145 165)"/><path d="M140 158 h10 M140 163 h10 M140 168 h7" stroke="#b3a27f" stroke-width="1.5" transform="rotate(10 145 165)"/>',
    righello:'<rect x="141" y="144" width="8" height="52" rx="3" fill="#eeda9a" transform="rotate(12 145 170)"/><path d="M141 152 h8 M141 162 h8 M141 172 h8 M141 182 h8" stroke="#b8923f" stroke-width="2" transform="rotate(12 145 170)"/>',
    provetta:'<rect x="138" y="140" width="10" height="46" rx="5" fill="rgba(42,161,152,.35)" stroke="#1f7d76" stroke-width="2.5" transform="rotate(16 143 163)"/>',
    pennello:'<rect x="140" y="150" width="7" height="40" rx="3.5" fill="#c8a86a" transform="rotate(14 143 170)"/><path d="M136 146 q7 -8 14 0 l-2 8 q-5 -4 -10 0 Z" fill="#c75b9b" transform="rotate(14 143 150)"/>',
    mappamondo:'<circle cx="146" cy="160" r="16" fill="#9fcbe0" stroke="#5a8aa5" stroke-width="2"/><path d="M136 154 Q142 148 148 152 Q154 148 156 156 Q150 162 144 158 Q138 162 136 154 Z" fill="#7fb37f"/><rect x="143" y="176" width="6" height="10" fill="#6b4423"/>'
  };
  if (ogg[a.oggetto]) s.push(ogg[a.oggetto]);

  /* testa */
  s.push('<circle cx="95" cy="74" r="40" fill="' + pelle + '"/>');

  /* capelli */
  var cap = {
    nessuno:'<path d="M62 50 Q68 40 76 44 M128 50 Q122 40 114 44" stroke="' + cc + '" stroke-width="4" stroke-linecap="round" fill="none"/>',
    corti:'<path d="M58 56 Q95 26 132 56 L132 46 Q95 16 58 46 Z" fill="' + cc + '"/>',
    spettinati:'<path d="M56 54 Q46 30 66 34 Q60 14 82 24 Q88 8 100 22 Q118 10 116 30 Q136 26 128 48 Q140 52 130 62 Q116 44 95 46 Q74 44 60 62 Q50 58 56 54 Z" fill="' + cc + '"/>',
    lunghi:'<path d="M56 62 Q52 26 95 24 Q138 26 134 62 Q126 40 95 38 Q64 40 56 62 Z" fill="' + cc + '"/><path d="M55 58 Q48 92 58 110 L70 100 Q60 84 62 60 Z" fill="' + cc + '"/><path d="M135 58 Q142 92 132 110 L120 100 Q130 84 128 60 Z" fill="' + cc + '"/>',
    chignon:'<path d="M56 62 Q52 26 95 24 Q138 26 134 62 Q126 40 95 38 Q64 40 56 62 Z" fill="' + cc + '"/><circle cx="95" cy="18" r="14" fill="' + cc + '"/>'
  };
  s.push(cap[a.capelli] || cap.corti);

  /* occhi / occhiali */
  var occ = {
    nessuno:'<circle cx="80" cy="68" r="4" fill="#2e2645"/><circle cx="110" cy="68" r="4" fill="#2e2645"/>',
    tondi:'<circle cx="80" cy="70" r="10" fill="#fff" stroke="#2e2645" stroke-width="3.5"/><circle cx="110" cy="70" r="10" fill="#fff" stroke="#2e2645" stroke-width="3.5"/><line x1="90" y1="70" x2="100" y2="70" stroke="#2e2645" stroke-width="3.5"/><circle cx="80" cy="71" r="3.5" fill="#2e2645"/><circle cx="110" cy="71" r="3.5" fill="#2e2645"/>',
    quadrati:'<rect x="70" y="61" width="20" height="17" rx="3" fill="#cfeef0" stroke="#546e7a" stroke-width="3.5"/><rect x="100" y="61" width="20" height="17" rx="3" fill="#cfeef0" stroke="#546e7a" stroke-width="3.5"/><line x1="90" y1="68" x2="100" y2="68" stroke="#546e7a" stroke-width="3.5"/><circle cx="80" cy="70" r="3.2" fill="#2e2645"/><circle cx="110" cy="70" r="3.2" fill="#2e2645"/>',
    monocolo:'<circle cx="80" cy="68" r="5" fill="#2e2645"/><circle cx="110" cy="70" r="11" fill="#fff" stroke="#b8923f" stroke-width="3.5"/><circle cx="110" cy="70" r="4" fill="#2e2645"/><line x1="119" y1="78" x2="124" y2="94" stroke="#b8923f" stroke-width="2.5"/>'
  };
  s.push(occ[a.occhiali] || occ.tondi);

  /* bocca / baffi / barba */
  if (a.baffi === 'baffi') {
    s.push('<path d="M70 92 Q82 80 95 92 Q108 80 120 92 Q108 106 95 94 Q82 106 70 92 Z" fill="' + cc + '"/>');
  } else if (a.baffi === 'barba') {
    s.push('<path d="M60 84 Q60 110 95 112 Q130 110 130 84 Q120 100 95 100 Q70 100 60 84 Z" fill="' + cc + '"/>');
    s.push('<path d="M84 92 Q95 98 106 92" stroke="#2e2645" stroke-width="3" fill="none" stroke-linecap="round"/>');
  } else {
    s.push('<path d="M76 92 Q95 106 114 92" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/>');
  }

  /* cappello */
  var hat = {
    tocco:'<path d="M52 42 L95 24 L138 42 L95 60 Z" fill="#2e2645"/><line x1="138" y1="42" x2="138" y2="60" stroke="#ffe14d" stroke-width="3"/><circle cx="138" cy="64" r="4.5" fill="#ffe14d"/>',
    berretto:'<path d="M55 46 Q60 22 95 22 Q130 22 135 46 Q95 34 55 46 Z" fill="' + v + '"/><path d="M95 22 Q100 12 110 14" stroke="' + vd + '" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="112" cy="13" r="4" fill="' + vd + '"/>',
    fiore:'<circle cx="63" cy="42" r="7" fill="#e2574c"/><circle cx="56" cy="36" r="5" fill="#e2574c"/><circle cx="70" cy="36" r="5" fill="#e2574c"/><circle cx="63" cy="35" r="4" fill="#ffe14d"/>'
  };
  if (hat[a.cappello]) s.push(hat[a.cappello]);

  return s.join('');
}

function buildProfSvg(avatar) { return avatarParts(avatar); }

/* Testa per l'oblò della porta (viewBox 0 0 96 96) */
function buildHeadSvg(a) {
  a = Object.assign({}, AVATAR_DEFAULT, a || {});
  var cc = a.colcap, pelle = a.pelle, v = a.vestito, vd = scuro(v, 0.35);
  var s = [];
  s.push('<circle cx="48" cy="52" r="30" fill="' + pelle + '"/>');
  var cap = {
    nessuno:'',
    corti:'<path d="M22 40 Q48 16 74 40 L74 32 Q48 8 22 32 Z" fill="' + cc + '"/>',
    spettinati:'<path d="M20 44 Q12 20 30 26 Q26 8 46 18 Q52 4 62 18 Q80 10 74 28 Q88 26 76 46 Q66 32 48 34 Q30 32 20 44 Z" fill="' + cc + '"/>',
    lunghi:'<path d="M20 46 Q16 18 48 18 Q80 18 76 46 Q70 30 48 30 Q26 30 20 46 Z" fill="' + cc + '"/><path d="M19 44 Q14 66 20 78 L30 70 Q24 58 25 46 Z" fill="' + cc + '"/><path d="M77 44 Q82 66 76 78 L66 70 Q72 58 71 46 Z" fill="' + cc + '"/>',
    chignon:'<path d="M20 46 Q16 18 48 18 Q80 18 76 46 Q70 30 48 30 Q26 30 20 46 Z" fill="' + cc + '"/><circle cx="48" cy="12" r="10" fill="' + cc + '"/>'
  };
  s.push(cap[a.capelli] != null ? cap[a.capelli] : cap.corti);
  var occ = {
    nessuno:'<circle cx="37" cy="48" r="3.5" fill="#2e2645"/><circle cx="59" cy="48" r="3.5" fill="#2e2645"/>',
    tondi:'<circle cx="37" cy="49" r="8" fill="#fff" stroke="#2e2645" stroke-width="3"/><circle cx="59" cy="49" r="8" fill="#fff" stroke="#2e2645" stroke-width="3"/><line x1="45" y1="49" x2="51" y2="49" stroke="#2e2645" stroke-width="3"/><circle cx="37" cy="50" r="2.8" fill="#2e2645"/><circle cx="59" cy="50" r="2.8" fill="#2e2645"/>',
    quadrati:'<rect x="29" y="42" width="16" height="14" rx="2.5" fill="#cfeef0" stroke="#546e7a" stroke-width="3"/><rect x="51" y="42" width="16" height="14" rx="2.5" fill="#cfeef0" stroke="#546e7a" stroke-width="3"/><line x1="45" y1="48" x2="51" y2="48" stroke="#546e7a" stroke-width="3"/><circle cx="37" cy="49" r="2.6" fill="#2e2645"/><circle cx="59" cy="49" r="2.6" fill="#2e2645"/>',
    monocolo:'<circle cx="36" cy="48" r="4" fill="#2e2645"/><circle cx="60" cy="48" r="9" fill="#fff" stroke="#b8923f" stroke-width="3"/><circle cx="61" cy="49" r="3" fill="#2e2645"/><line x1="68" y1="54" x2="72" y2="66" stroke="#b8923f" stroke-width="2"/>'
  };
  s.push(occ[a.occhiali] || occ.tondi);
  if (a.baffi === 'baffi') {
    s.push('<path d="M29 66 Q38 56 48 66 Q58 56 67 66 Q58 78 48 68 Q38 78 29 66 Z" fill="' + cc + '"/>');
  } else if (a.baffi === 'barba') {
    s.push('<path d="M24 62 Q24 88 48 88 Q72 88 72 62 Q64 74 48 74 Q32 74 24 62 Z" fill="' + cc + '"/>');
  } else {
    s.push('<path d="M34 66 Q48 78 62 66" stroke="#2e2645" stroke-width="3.5" fill="none" stroke-linecap="round"/>');
  }
  var hat = {
    tocco:'<path d="M16 30 L48 16 L80 30 L48 44 Z" fill="#2e2645"/><line x1="80" y1="30" x2="80" y2="44" stroke="#ffe14d" stroke-width="2.5"/><circle cx="80" cy="47" r="3.5" fill="#ffe14d"/>',
    berretto:'<path d="M22 36 Q26 16 48 16 Q70 16 74 36 Q48 26 22 36 Z" fill="' + v + '"/><circle cx="58" cy="10" r="3.5" fill="' + vd + '"/>',
    fiore:'<circle cx="26" cy="32" r="5.5" fill="#e2574c"/><circle cx="21" cy="27" r="4" fill="#e2574c"/><circle cx="31" cy="27" r="4" fill="#e2574c"/><circle cx="26" cy="26" r="3" fill="#ffe14d"/>'
  };
  if (hat[a.cappello]) s.push(hat[a.cappello]);
  return s.join('');
}

/* ============================================================
   PREFERENZE ACCESSIBILITÀ — modalità tranquilla
   ============================================================ */
var LS_CALMA = 'professoracci_calma';
function isCalma() { return localStorage.getItem(LS_CALMA) === '1'; }
function setCalma(on) {
  localStorage.setItem(LS_CALMA, on ? '1' : '0');
  document.body.classList.toggle('calma', on);
}
function applicaCalma() { document.body.classList.toggle('calma', isCalma()); }

/* ---------- esporta ---------- */
window.Professoracci = {
  PROFS: PROFS,
  PALETTE: PALETTE,
  AVATAR_OPZIONI: AVATAR_OPZIONI,
  AVATAR_DEFAULT: AVATAR_DEFAULT,
  getProf: getProf,
  getCustomList: getCustomList,
  saveCustomProf: saveCustomProf,
  deleteCustomProf: deleteCustomProf,
  buildCustomConfig: buildCustomConfig,
  buildProfSvg: buildProfSvg,
  buildHeadSvg: buildHeadSvg,
  getMateriale: getMateriale,
  setMateriale: setMateriale,
  clearMateriale: clearMateriale,
  isCalma: isCalma,
  setCalma: setCalma,
  applicaCalma: applicaCalma,
  escapeHtml: escapeHtml,
  capitalizza: capitalizza
};
})();
