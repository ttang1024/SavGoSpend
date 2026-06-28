# SavGoSpend (SGO)

A dignity-first smart rewards mobile app for independent New Zealand travellers aged 65+.
Built with React Native (Expo) for iOS and Android.

Early scaffold: the app boots, onboards a member, navigates, and renders the core
screens. Firebase, Google Maps, and remaining features are wired in incrementally.

## Tech stack

- **Expo SDK 56** + **React Native 0.85** + **React 19**, file-based routing (`expo-router`)
- **Firebase** — anonymous auth + Firestore (env-driven, optional)
- **react-native-maps** (native only) + **expo-location** — nearby retailers
- **AsyncStorage** — offline-first local cache

## Getting started

```bash
npm install
cp .env.example .env    # then fill in Firebase keys (optional)
npm start               # press i / a / w for iOS / Android / web
```

- `npm run ios` / `android` / `web`
- `npm run typecheck` — strict TypeScript, no emit

### Configuration

- **Firebase** (optional): set `EXPO_PUBLIC_FIREBASE_*` in `.env` (see `.env.example`).
  These web keys are not secrets — access is governed by `firestore.rules`. Enable
  **Anonymous** sign-in in the Firebase Console and deploy rules with
  `firebase deploy --only firestore:rules`. With no `.env`, the app runs local-only.
- **Maps**: iOS uses **Apple Maps** by default (no key needed); **Android** needs a
  Google Maps key — replace `REPLACE_WITH_ANDROID_GOOGLE_MAPS_API_KEY` in `app.json`.
  To use Google Maps on iOS too, add `ios.config.googleMapsApiKey` with a real key (a
  placeholder there breaks `pod install`, since Expo only injects the Google Maps pod
  when the key is present). Maps render on native builds only; web shows a fallback.

## Project layout

```
app/                  # expo-router routes
  _layout.tsx         # root stack, guards onboarding vs. tabs, SOS in header
  (onboarding)/       # welcome → about-you → preferences → all-set
  (tabs)/             # Home, Card, Aroha, Settings
  rewards.tsx         # Smart Rewards: points, tiers, activity
  retailers.tsx       # Nearby Retailers (map + list, check-in)
  whats-on.tsx        # events
  good-to-know.tsx    # articles
src/
  theme/              # colours, typography, a11y-aware ThemeProvider
  components/         # AppText, Screen, Tile, buttons, form controls, Barcode
  providers/          # MemberProvider (offline-first member state)
  lib/                # firebase init, authSession, firestore, rewards logic
  constants/          # Aroha copy, sample seed data
  types/              # domain models
```

## Accessibility

A first-class requirement: all text flows through `<AppText>` (honours **Larger Text**
and **High Contrast** from Settings), touch targets are ≥56px, colour pairs target WCAG
2.1 AA, and interactive elements carry roles, labels, and hints.

## Data & sync

The card and rewards must work offline, but the Firebase JS SDK has no Firestore offline
persistence on React Native — so the app is **offline-first**:

- **AsyncStorage** (`sgo.member.v1`) is the source of truth the UI reads.
- **Firestore** (`members/{uid}`) is the cloud mirror, used only when configured.
  `MemberProvider` loads the cache on boot, then attaches an `onSnapshot` listener
  (keyed by the anonymous-auth uid) that refines it when online. Mutations update the
  cache immediately, then sync best-effort. `firestore.rules` enforces per-member
  isolation. Settings shows "☁️ Synced" or "📱 Stored on this device".

## Smart Rewards

`src/lib/rewards.ts` holds the pure tier logic — five tiers (Explorer → Wayfarer →
Voyager → Pathfinder → Kaumatua). Members earn points by checking in at a retailer (once
per day each); the Rewards screen shows points, progress, the tier ladder, and recent
activity. Tier names/thresholds are placeholders pending the Build Brief.

## Voice Commands

An accessibility opt-in (Settings → "Voice Commands") that lets members move around
the app by speaking — built for those who find tapping small targets hard. Tap the
mic, speak ("open my card", "nearby retailers", "emergency", "what can I say"), and the
app navigates and speaks a confirmation back.

**Requires a dev build.** `expo-speech-recognition` ships native code that **does not run
in Expo Go** — like `react-native-maps`. Build a dev client and rebuild whenever the
package or its config plugin changes:

```bash
npx expo prebuild
npx expo run:ios        # or: npx expo run:android
```

Architecture:

- `src/lib/voiceCommands.ts` — the pure, testable core: the command vocabulary plus
  whole-word, longest-match parsing of a transcript to an intent (navigate / emergency /
  help). No native imports.
- `src/providers/VoiceProvider.tsx` — the runtime (state, command execution, `expo-speech`
  TTS feedback in `en-NZ`). It never imports `expo-speech-recognition` directly.
- `src/providers/VoiceRecognitionBridge.tsx` — all `expo-speech-recognition` imports and
  event hooks live here, behind a `React.lazy` boundary the provider mounts **only** when
  the native module is present and the member has opted in.
- `src/components/VoiceButton.tsx` — the app-wide mic control + status pill, shown once a
  member opts in. Say "what can I say" (or tap the button in Settings) to hear the list.

**Graceful degradation:** the package throws at import time if its native module is
missing, so `src/lib/speechRecognition.ts` probes with `requireOptionalNativeModule`
(no import, no throw). Where recognition is unavailable (Expo Go, web) the rest of the
app runs normally — the mic button is hidden and the Settings toggle disables itself.

## TODO

- Reconcile placeholder colours/typography/iconography (emoji stand-ins) with Holly
  Riley's *UI Visual Identity Guide* (DSIGN350, 2026) before launch.
- Not yet built: retailer profiles, community "Post a Tip" + review queue, moving
  catalogue data into Firestore, SGO admin panel, animated map markers.
