# 🧳 Conti di viaggio

App web per tenere sotto controllo tutte le spese di un viaggio, dalla benzina all'ultimo caffè.
Funziona da telefono, si installa sulla schermata home e continua a funzionare anche senza connessione.

## Cosa fa

- **24 voci di spesa** già pronte, ognuna con la sua icona e il suo colore: aereo, treno, nave o traghetto, noleggio auto, carburante, pedaggi, parcheggio, taxi e bus, alloggio, ristoranti, spesa e bar, visite e musei, attività, shopping, souvenir, assicurazione, documenti, bagagli, SIM e internet, farmacia, mance, lavanderia, animali, varie ed eventuali.
- **Più importi per ogni voce.** Ogni riga ha importo, descrizione e data; la categoria mostra il subtotale, il numero di voci e la percentuale sul totale.
- **Rientri e rimborsi** (rimborso, quota amici, cashback, rivendita, altro), che vengono sottratti dal totale.
- **Saldo finale** presentato come una carta d'imbarco, con uscite, rientri, quota a testa e giorni di viaggio.
- **Budget facoltativo** con barra di avanzamento: gialla dall'80%, rossa quando sfori.
- **Riepilogo copiabile** da mandare su WhatsApp, e salvataggio del viaggio in un file `.json` da riaprire quando vuoi.

I dati restano nel telefono (`localStorage`): niente account, niente server, niente da configurare.

## File

```
index.html      l'app intera (HTML, CSS e JavaScript in un solo file)
manifest.json   dati per l'installazione sulla schermata home
sw.js           service worker, fa funzionare l'app offline
icon-180.png    icona per iPhone
icon-192.png    icona per Android
icon-512.png    icona grande
```

Tutti i file stanno nella stessa cartella, senza sottocartelle. Nessuna libreria da installare.

## Pubblicarla su GitHub Pages

1. Su **github.com**, tasto **+** in alto → *New repository*.
2. Nome: `conti-viaggio`, lascia **Public**, crea.
3. Nella pagina del repository tocca **Add file → Upload files**.
4. Seleziona tutti e 6 i file insieme e conferma con **Commit changes**.
5. **Settings → Pages**: in *Source* scegli **Deploy from a branch**, ramo `main`, cartella `/ (root)`, salva.
6. Dopo un minuto l'app è online su `https://TUONOME.github.io/conti-viaggio/`.

## Metterla sulla schermata home

- **iPhone:** apri il link con Safari, tocca il tasto Condividi e poi *Aggiungi a Home*.
- **Android:** apri il link con Chrome, menu in alto a destra e poi *Installa app*.

Da quel momento parte a schermo intero come un'app normale e funziona anche in aereo o all'estero senza dati.

## Aggiornarla

Quando modifichi `index.html`, cambia anche il numero di versione dentro `sw.js`
(`var CACHE = 'conti-viaggio-v1';` → `v2`, `v3`…): serve a far scaricare al telefono la versione nuova
invece di riusare quella salvata in memoria.
