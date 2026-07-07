# 🏫 La Scuola dei Professoracci

**Dove i professori sbagliano... e tu li correggi!**

App web educativa per bambini e ragazzi (6–13 anni). Professori-personaggi spiegano argomenti scolastici commettendo **un errore deliberato**: chi gioca deve trovarlo e correggerlo. Il gioco inverte il rapporto errore/apprendimento: a sbagliare è l'autorità, non lo studente — trovare l'errore diventa un piacere, non una paura.

Il progetto è nato per l'**inclusione e il sostegno**: il primo professore, Sgrammaticus, è stato inventato per coinvolgere un ragazzo autistico di prima media. Funziona così bene che è diventato una scuola intera.

## ✨ Funzioni

- **6 professori di ruolo** — Sgrammaticus (italiano), Confusione (storia), Sbagliotti (matematica), Terranova (geografia), Bubbolo (scienze), Storditella (arte) — ognuno con la sua aula animata, la sua voce e il suo carattere
- **📎 Materiale della lezione** — dal pannello "Cattedra" l'insegnante incolla un testo o carica un file `.txt`/`.md`/`.pdf`: le spiegazioni (e gli errori da trovare) seguono **esattamente** la lezione fatta in classe
- **🔨 Professoracci custom** — il laboratorio `crea-professore.html` permette di inventare nuovi professori: nome, materia, carattere, voce e aspetto (avatar componibile). Perfetto per creare *il* personaggio giusto per *quel* ragazzo
- **🌿 Modalità tranquilla** — un tocco spegne le animazioni ambientali e riduce gli stimoli visivi (pensata per autismo e ADHD; rispetta anche `prefers-reduced-motion`)
- **3 livelli di difficoltà** — 1ª–2ª, 3ª–4ª, 5ª e medie
- **Voce** — ogni professore legge le sue lezioni con la Web Speech API del browser

## 🚀 Come si usa

1. Scarica o clona il repository
2. Apri `index.html` nel browser (funziona anche in doppio clic, senza server)
3. In segreteria incolla una API key gratuita di [Google AI Studio](https://aistudio.google.com/apikey)
4. Scegli una porta ed entra in aula!

> 🔒 **Privacy**: niente backend, niente account. La chiave, i punteggi, i professori custom e il materiale delle lezioni restano nel `localStorage` del browser, solo sul dispositivo. Le richieste vanno esclusivamente all'API di Google Gemini.

## 🧰 Stack

HTML/CSS/JS puro, senza framework e senza build. Google Gemini (`gemini-2.5-flash-lite`, free tier) via `@google/genai` da esm.sh; pdf.js da CDN per l'estrazione del testo dai PDF; Web Speech API per le voci.

```
index.html                 il corridoio della scuola
crea-professore.html       laboratorio: crea il tuo professoraccio
aule/aula.html             l'aula generica (?prof=<id>)
assets/professoracci.js    configurazione professori, avatar, materiale
assets/aula.css            stile condiviso delle aule
```

## 👥 A chi è rivolto

- **In classe** (primaria e medie): ripasso a squadre alla LIM, caccia all'errore sul materiale appena spiegato
- **Sostegno e inclusione**: il materiale personalizzato e i professori su misura permettono di costruire un'esperienza attorno agli interessi e ai bisogni del singolo ragazzo
- **A casa**: ripasso giocoso senza la pressione del voto

---

*Vietato fidarsi dei professori.* 🍎
