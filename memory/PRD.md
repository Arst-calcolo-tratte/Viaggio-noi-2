# Conti di viaggio — PRD

Mobile Expo (React Native) recreation of the "Conti di viaggio" PWA at
https://arst-calcolo-tratte.github.io/Viaggio-noi-2/ — a delightful boarding-pass style
travel expense tracker in Italian.

## Core Capabilities (MVP)

- **Trip settings** (nome, valuta €/$/£/CHF, persone, budget, date partenza/ritorno) via bottom sheet.
- **Boarding pass hero card** — saldo, uscite, rientri, a testa, giorni, budget bar con l'aereo, timbro con numero voci, perforazione.
- **36 categorie di spesa** + **5 categorie di rientri** con emoji e colori.
- **Categorie personalizzate** con emoji e palette colori.
- **Grafico donut** "Dove vanno i soldi" con legenda.
- **Lista espandibile** per categoria con voci individuali, quota % e barra proporzionale, eliminazione swipe-independente.
- **Strumenti**: Copia riepilogo (Clipboard), Salva backup (JSON share), Apri backup (Document picker), Azzera tutto.
- **Persistenza locale** via `@react-native-async-storage/async-storage`.
- **Toast** notifiche di feedback.

## Tech
- Expo SDK 57, React Native 0.86, expo-router (single stack route `/`).
- `@gorhom/bottom-sheet` per gli sheet, `react-native-reanimated` per animazioni, `react-native-svg` per il donut.
- `expo-blur` per la sticky bottom bar, `expo-linear-gradient` per lo scrim dell'header.
- Backend minimo FastAPI (`/api/health`) — l'app è completamente client-side.

## Design tokens
Tutti i colori sono in `/app/frontend/src/theme.ts`, allineati a `design_guidelines.json`
(personalità Tactile / Playful LIGHT, brand `#0D2237`).
