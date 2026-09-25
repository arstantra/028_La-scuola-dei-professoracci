# La Scuola dei Professoracci — Contesto di progetto

> Obiettivo dichiarato: grafica di livello altissimo, non da prototipo.
> **Direzione visiva scelta: C · AULA VIVA** (vedi `direzione-visiva.html`)

## Concept

App web educativa e ludica per bambini e ragazzi 6–13 anni (primaria + secondaria di primo grado). Professori-personaggi spiegano argomenti curricolari commettendo **errori deliberati e vistosi**. Il bambino ascolta (testo + voce sintetizzata), individua l'errore e lo corregge. Il sistema valuta e dà feedback divertente. Inverte il rapporto errore/apprendimento: sbaglia l'autorità, non lo studente.

Il progetto nasce anche (soprattutto) per **inclusione, disabilità e sostegno**: il primo prototipo di Prof. Sgrammaticus è nato per coinvolgere un ragazzo autistico di prima media. Da qui due funzioni chiave: il **materiale della lezione** caricato dall'insegnante (il gioco segue esattamente la lezione fatta in classe) e i **professoracci custom** (il personaggio giusto per quel ragazzo).

## Stack tecnico

- HTML/CSS/JS puro, niente framework, niente backend: tutto resta sul dispositivo
- Google Gemini via SDK `@google/genai@0.14.1` da esm.sh (`type="module"`)
- API key Google AI Studio inserita dall'utente a runtime, mai hardcoded (`localStorage['professoracci_apikey']`)
- Modello: `gemini-2.5-flash-lite` (free tier)
- Pattern API: `new GoogleGenAI({ apiKey })` → `ai.models.generateContent()` → estrazione JSON con regex `\{[\s\S]*\}` (NO `responseMimeType`)
- Voce: Web Speech API nativa
- PDF: estrazione testo lato client con pdf.js (CDN cdnjs, caricato solo quando serve)
- **Vincolo file://**: gli script condivisi locali sono script classici (no ES module locali, bloccati da CORS su file://); solo l'import di Gemini da esm.sh è module

## Architettura (refactor luglio 2026)

```
index.html                 corridoio: porte generate da config + porte custom + porta "crea" + classe in gioco
registro.html              registro di classe: classi, alunni (pseudonimi), presenze, gruppi, punteggi, esporta/importa
crea-professore.html       builder dei professoracci custom (avatar componibile, voce, carattere)
aule/aula.html             UNICA aula generica: ?prof=<id> (es. ?prof=sgrammaticus, ?prof=c_...)
assets/professoracci.js    config dei 7 prof (persona, livelli, voce, tema, SVG, decorazioni, messaggi)
                           + storage prof custom + generatore avatar + storage materiale + mod. tranquilla
assets/classi.js           registro classi (localStorage 'professoracci_classi') + suoni Web Audio (gneee / evviva)
assets/aula.css            stile Aula Viva condiviso, tematizzato con --wall/--accent/--accent-d/--accent-dd
assets/orologio.js         orologio da parete a lancette: ora, cronometro, timer visivo (stato in sessionStorage)
assets/app.js              PWA (service worker, pulsante installa), schermo intero, zoom automatico per il monitor di classe
manifest.webmanifest, sw.js   app installabile (sw "prima la rete"); icone in assets/icone/
_archivio/aule-standalone-v1/   le vecchie 6 aule standalone (superate dal refactor)
```

## I sette professori di ruolo

| Professore | Materia | Voce (pitch / rate) |
|---|---|---|
| Prof. Sgrammaticus | Italiano/Grammatica | grave e lenta — 0.75 / 0.80 |
| Prof. Confusione | Storia | frenetica — 1.0 / 1.3 |
| Prof. Sbagliotti | Matematica | nasale e sicura — 1.3 / 0.9 |
| Prof. Terranova | Geografia | solenne — 0.6 / 0.8 |
| Prof. Bubbolo | Scienze | entusiasta — 1.5 / 1.1 |
| Prof.ssa Storditella | Arte | distratta — 1.2 / 0.95 |
| Miss Spelling | Inglese (CLIL, tutto in inglese, voce en-GB) | snob e precisa — 1.25 / 0.9 |

## Funzioni chiave

### Materiale della lezione (pannello "Cattedra" in ogni aula)
- L'insegnante incolla testo o carica `.txt`/`.md`/`.pdf` (pdf.js estrae il testo lato client)
- Salvato per-professore in `localStorage['professoracci_materiale']` (max 15.000 caratteri)
- Se presente, il prompt di generazione impone: spiegazione basata ESCLUSIVAMENTE sul materiale, errore riferito al contenuto del materiale
- Badge 📎 sulla lavagna quando il materiale è attivo; senza materiale il prof inventa come prima

### Professoracci custom (`crea-professore.html`)
- Nome, materia libera, carattere (testo libero + preset), voce (preset + slider pitch/rate con prova), colore aula (8 palette), avatar componibile SVG (pelle, vestito, capelli, occhiali, cappello, baffi/barba, oggetto in mano)
- Salvati in `localStorage['professoracci_custom']` con id `c_<timestamp>`; modifica ed eliminazione dalla stessa pagina
- La config completa da aula viene generata da `buildCustomConfig()` (persona, livelli, messaggi generici)
- Nel corridoio compaiono con targhetta verde "CREATA DA TE"

### Classi, squadre e punteggio personale (settembre 2026)
- `registro.html`: si creano le classi (1D, 1C…), si aggiungono gli alunni con **pseudonimi** (minori), si segnano gli assenti
- Gruppi che cambiano ogni volta: casuali da 2-5 tra i presenti, oppure a mano; chi non è in un gruppo gioca come **gruppo da uno**
- In aula, pannello "Squadre in gara": l'insegnante preme ✅ (+10 alla squadra, a ogni membro e alla classe, per materia) o ❌ (suono "gneee", il prof gongola, si continua; nessun registro degli errori)
- La casella di risposta resta: se l'AI dice "bravo", il prof chiede all'insegnante di premere ✅ sulla squadra che ha risposto
- Senza classe scelta si gioca in modalità libera con il vecchio punteggio unico
- Esporta/Importa: file JSON per portare le classi su un altro computer (unione per id o nome della classe)
- I nomi degli alunni non entrano MAI nei prompt di Gemini

### Modalità tranquilla (accessibilità)
- Pulsante 🌿 in corridoio e nelle aule: spegne animazioni ambientali e riduce gli stimoli visivi (pensata per autismo/ADHD)
- Salvata in `localStorage['professoracci_calma']`; rispettato anche `prefers-reduced-motion`

### UX aula (settembre 2026)
- **Impianto «palco e telecomando»** (scelto il 23/9 tra 3 proposte): il MURO è della classe (orologio, lavagna, professore), il PAVIMENTO dell'insegnante (tabellone + telecomando). Barra in alto: solo «Corridoio», titolo e 3 icone (cattedra, tranquilla, schermo intero). Unico pulsante rosso: Nuova spiegazione
- Il professore sta in piedi sul pavimento; il suo nome è in cima alla nuvoletta. Il suolo (`--suolo`) lo calcola app.js dalla posizione del tabellone
- Tabellone: fino a 8 squadre → schede (nome, componenti, punti grandi); più di 8 (es. tutti singoli) → targhette alfabetiche 8 per riga (10 oltre i 24). ✓ ✗ compaiono solo sulla squadra che risponde, che si alza sopra le altre
- Telecomando (barra scura in basso): Nuova spiegazione, Ascolta, Stop, [🔍/💬 solo in gioco libero], casella, 🎤, Chiedi/Ho trovato l'errore
- Classe, gruppi e **livello** (per classe, o per il gioco libero) si scelgono SOLO nel registro; l'aula mostra solo le squadre con ✅/❌ e il link «classe, gruppi e livello» (torna all'aula con ?torna=)
- Orologio a lancette appeso sopra la lavagna; clic → cronometro o timer 1-10′ con campanella
- `.wrap[data-adatta]`: l'aula si ingrandisce da sola fino a riempire il monitor (zoom 1–2.4)
- Palco largo (schermi 16:9 con una classe in gioco, `html.largo`): squadre in colonna a destra della lavagna
- **Lavagna toccabile** (con una classe): l'insegnante tocca la squadra che risponde (🙋) e poi la parola sbagliata sulla lavagna → se è un errore noto (dichiarato o trovato dal correttore) punti alla squadra e correzione in gesso azzurro; se no «gneee». Toccando prima la parola, il prof chiede «chi è stato?» e si tocca la squadra. ✅/❌ restano per gli errori non toccabili
- **Chat con il prof** nella nuvoletta: con una classe la casella sotto la lavagna diventa «Chiedete qualcosa al professore» (+ 🎤 dettatura Web Speech, invio automatico). Il prof resta nel personaggio ma dice solo cose vere, breve, adatto all'età; non svela gli errori ancora nascosti (al massimo l'indizio). Storia: ultime 6 battute. Gioco libero: interruttore 🔍 risposta / 💬 chat
- Cattedra in finestra (pulsante 🍎 in alto, 📎 se c'è materiale): materiale della lezione + velocità voce/scrittura
- Timer automatico (opzione nel pannello dell'orologio, `localStorage['professoracci_timer']`): parte quando il prof finisce di scrivere, si ferma quando gli errori sono tutti trovati; a tempo scaduto il prof gongola e dà l'indizio

### Professoracci in buona fede + casella delle domande (settembre 2026)
- **I prof non sanno di sbagliare**: non dicono mai che ci sono errori da trovare, non ammiccano, non danno indizi. Sulla lavagna niente "trova l'errore": il titolo è "Lezione di <materia>" o l'argomento della lezione (campo `titolo` del JSON). Regola `BUONA_FEDE` in tutti i prompt di generazione.
- Il contatore "errori trovati" resta (è il gioco, non il prof); quando ne restano altri pulsa, invece del vecchio "si nasconde ancora un errore" detto dal prof.
- Gli indizi (risposta "quasi"/"sbagliato", tempo scaduto) compaiono su un **foglietto giallo** attaccato alla lavagna (`#postit`), mai in bocca al prof.
- **Casella = domanda vera** (modo 💬, predefinito; con una classe sempre): "Parlaci di Giotto" → il prof spiega alla lavagna esattamente Giotto (anche fuori materia), con il suo errore in buona fede (`promptDomanda`). Saluti/chiacchiere/domande personali → risposta solo a voce, la lavagna resta com'è. In gioco libero, dopo la lezione la casella passa da sola a 🔍 risposta e torna alle domande quando la lavagna è risolta.

## Sistema di gioco

- Persona nel prompt: MAI ammette errori spontaneamente, solo italiano, JSON-only
- Generazione: JSON `{spiegazione, errore, correzione, indizio}`, temperatura 1.0, anti-ripetizione con lista errori recenti in sessionStorage (`recenti_<profId>`)
- Valutazione: JSON `{esito: bravo|quasi|sbagliato, commento}`, temperatura 0.7 — bravo +10, quasi +2
- Livelli: facile (6-7 anni), media (8-9), difficile (10-13, "5ª e medie")
- Punteggio: per classe/gruppo/alunno e per materia (`professoracci_classi`); in gioco libero `localStorage['professoracci_punti']`
- Aule in lingua straniera: campi opzionali `lang`, `notaLingua`, `ui`, `msg.gnee/bravi/chi` nella config del prof

## Identità visiva — C · AULA VIVA

- Tutta l'aula è il palcoscenico; professore full-body SVG (viewBox 190×260) accanto alla lavagna
- Ogni professore ha la SUA aula tematica (decorazioni via `decorCss`/`decorHtml`/`boardExtraHtml`/`profExtraHtml` nella config)
- Lavagna verde ardesia con cornice legno, testo in gesso (font Caveat) con typewriter
- UI: Fredoka + Nunito, bottoni con ombre solide, palette calda (legno, ardesia, rosso #e2574c, blu #3b6ea5)

## Da costruire / rifinire

1. Test sul campo con bambini veri e taratura dei prompt (difficoltà, tono, lunghezza)
2. Taratura del prompt "materiale": verificare che gli errori restino ancorati al testo caricato
3. Possibili evoluzioni: modalità dialogo multi-turno, pagella/traguardi, suoni, versione tablet/touch, più pezzi per l'avatar
4. Valutare export/import dei prof custom (file JSON) per condividerli tra dispositivi

## Note operative

- La cartella è sincronizzata OneDrive: possibile latenza tra modifiche e copia locale
