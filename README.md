# SavGoSpend (SGO)

A dignity-first smart rewards app for independent New Zealand travellers aged 65+.
Built with React Native (Expo) for iOS and Android.

Early scaffold: boots, onboards a member, navigates, and renders the core screens.
Firebase, Google Maps, and remaining features land incrementally.

## Demo

Click the image for a short walkthrough of the project's functionality.

<a href="https://www.youtube.com/watch?v=8TBIuEFlCmI"><img src="demo.png" alt="Watch the video" width="280"></a>

## Tech stack

- **Expo SDK 56** + **React Native 0.85** + **React 19**, file-based routing (`expo-router`)
- **Firebase** — anonymous auth + Firestore (env-driven, optional)
- **react-native-maps** (native only) + **expo-location** — nearby retailers
- **AsyncStorage** — offline-first local cache

## Getting started

```bash
npm install
cp .env.example .env    # fill in Firebase keys (optional)
npm start               # press i / a / w for iOS / Android / web
```

- `npm run ios` / `android` / `web`
- `npm run typecheck` — strict TypeScript, no emit

### Configuration

- **Firebase** (optional): set `EXPO_PUBLIC_FIREBASE_*` in `.env`. These web keys aren't
  secrets — `firestore.rules` governs access. Enable **Anonymous** sign-in and run
  `firebase deploy --only firestore:rules`. With no `.env`, the app runs local-only.
- **Maps**: iOS uses **Apple Maps** (no key); **Android** needs a Google Maps key in
  `app.json`. Maps render on native builds only; web shows a fallback.

## Project layout

```
app/                  # expo-router routes
  _layout.tsx         # root stack, onboarding/tabs guard, SOS in header
  (onboarding)/       # welcome → about-you → preferences → all-set
  (tabs)/             # Home, Card, Aroha, Settings
  rewards.tsx         # balance, tiers, redeem, activity
  retailers.tsx       # nearby retailers (map, distance list, check-in, directions)
  whats-on.tsx        # upcoming events
  good-to-know.tsx    # articles
src/
  theme/              # colours, typography, a11y-aware ThemeProvider
  components/         # AppText, Screen, Tile, buttons, form controls, Barcode
  hooks/              # useNearbyLocation (consent-gated expo-location)
  providers/          # MemberProvider, VoiceProvider
  lib/                # firebase, authSession, firestore, rewards, geo, events, voice
  constants/          # Aroha copy, sample seed data
  types/              # domain models
```

## Accessibility

A first-class requirement: all text flows through `<AppText>` (honours **Larger Text**
and **High Contrast**), touch targets are ≥56px, colours target WCAG 2.1 AA, and
interactive elements carry roles, labels, and hints.

## Data & sync

The Firebase JS SDK has no Firestore offline persistence on React Native, so the app is
**offline-first**: **AsyncStorage** (`sgo.member.v1`) is the source of truth the UI reads;
**Firestore** (`members/{uid}`) is an optional cloud mirror. `MemberProvider` loads the
cache on boot, then attaches an `onSnapshot` listener (keyed by anonymous-auth uid) that
refines it when online. Mutations update the cache immediately, then sync best-effort.
`firestore.rules` enforces per-member isolation; Settings shows "☁️ Synced" or "📱 Stored
on this device".

## Smart Rewards

`src/lib/rewards.ts` holds the pure tier logic — five tiers (Explorer → Wayfarer →
Voyager → Pathfinder → Kaumatua). Members earn points by checking in at a retailer (once
per day each) and **redeem** them against a catalogue.

Two balances: spendable `points` (redeeming draws down) and `lifetimePoints` (total ever
earned, which drives the tier). Lifetime points never decrease, so spending never demotes
a member — a deliberate, dignity-first choice (a Kaumatua stays a Kaumatua). Tier
thresholds and the catalogue are placeholders.

## Voice Commands

An accessibility opt-in (Settings → "Voice Commands") for members who find tapping small
targets hard. Tap the mic and speak ("open my card", "nearby retailers", "how many points
do I have", "emergency", "what can I say"); the app navigates, answers, and speaks back.

**Requires a dev build** — `expo-speech-recognition` ships native code that doesn't run in
Expo Go. Rebuild whenever the package or its plugin changes:

```bash
npx expo prebuild
npx expo run:ios        # or: npx expo run:android
```

Architecture:

- `src/lib/voiceCommands.ts` — pure core: vocabulary + whole-word, longest-match parsing
  of a transcript to an intent (navigate / emergency / help).
- `src/providers/VoiceProvider.tsx` — runtime (state, execution, `expo-speech` TTS in
  `en-NZ`). Never imports `expo-speech-recognition` directly.
- `src/providers/VoiceRecognitionBridge.tsx` — all `expo-speech-recognition` imports,
  behind a `React.lazy` boundary mounted only when the native module and opt-in are present.
- `src/components/VoiceButton.tsx` — app-wide mic control + status pill.

**Graceful degradation:** `src/lib/speechRecognition.ts` probes with
`requireOptionalNativeModule` (no import, no throw). Where recognition is unavailable
(Expo Go, web), the mic button hides and the toggle disables itself.

## TODO

Retailer profiles, community "Post a Tip" + review queue, catalogue data in Firestore,
SGO admin panel, animated map markers.
