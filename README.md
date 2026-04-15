# CR Deck Viewer App

A React Native iOS app for building, viewing, and managing Clash Royale decks.

## Features

- **Deck Builder** — Tap to add/remove cards from an 8-card deck
- **Card Picker** — Browse all 121 cards with search and filter by type
- **Deck Stats** — Average elixir, 4-card cycle stats, type breakdown
- **Saved Decks** — Persist decks locally, group by win condition
- **Import** — Paste deck share links (compact `d=` or classic `deck=` format)
- **Share** — Share deck URLs or copy directly to Clash Royale
- **Auto-naming** — Decks are auto-named based on win conditions and archetype

## Shared Logic

The `src/shared/` directory contains platform-independent JS modules shared between this app and the web version:
- `constants.js` — Rarity colors, card abbreviations, naming sets
- `deckUrl.js` — Compact base62 URL encoding/decoding
- `deckParser.js` — Input format parsing
- `deckNaming.js` — Auto deck name generation
- `slotUtils.js` — Evo/hero positional slot logic
- `deckStats.js` — Deck statistics computation

## Building

### Prerequisites
- Node.js 22+
- Xcode 16+ (macOS only, for local builds)

### Local Development
```bash
npm install
cd ios && bundle install && bundle exec pod install && cd ..
npx react-native run-ios
```

### CI Build (GitHub Actions)
Push to `main` or trigger the workflow manually. The unsigned IPA will be available as a build artifact.

### Installing the IPA
Use [AltStore](https://altstore.io/), [SideStore](https://sidestore.io/), or [TrollStore](https://github.com/opa334/TrollStore) to sideload the unsigned IPA onto your iPhone.
