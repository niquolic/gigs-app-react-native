# Gigs App — React Native (Expo)

Portage mobile du front Angular [`gigs-app-angular`](https://github.com/niquolic/gigs-app-angular).
Même backend, mêmes endpoints, aucune modification côté serveur.

- **Framework** : Expo + React Native + TypeScript
- **Style** : NativeWind (Tailwind CSS pour React Native) — quasiment aucun style "en dur", tout passe par des classes utilitaires (`className="..."`), comme demandé.
- **Navigation** : React Navigation (barre d'onglets Accueil / Ajouter / Statistiques + écran de modification empilé)
- **Stockage local** : AsyncStorage (équivalent mobile de `localStorage`)

## Correspondance avec le projet Angular

| Angular | React Native |
|---|---|
| `environment.ts` / `environment.prod.ts` | `src/config/env.ts` |
| `services/get-gigs`, `get-stats`, `spotifyService` | `src/api/gigs.ts`, `src/api/stats.ts`, `src/api/auth.ts` |
| `services/tokenService` | `src/utils/jwt.ts` |
| `localStorage` | `src/utils/storage.ts` (AsyncStorage) |
| `AuthGuard` (app-routing.module.ts) | `src/context/AuthContext.tsx` + `RootNavigator.tsx` |
| `components/menu` | `src/navigation/MainTabs.tsx` (barre d'onglets native) |
| `components/login` | `src/screens/LoginScreen.tsx` |
| `pages/dashboard` + `components/gigs-list` | `src/screens/DashboardScreen.tsx` + `src/components/GigCard.tsx` |
| `pages/add-gigs` + `components/add-gigs-form` | `src/screens/AddGigScreen.tsx` |
| `pages/edit-gig` + `components/edit-gig-form` | `src/screens/EditGigScreen.tsx` |
| `pages/stats-gigs` + `components/stats-component` | `src/screens/StatsScreen.tsx` |

**Endpoints appelés (identiques à l'original)** :
`/login`, `/register`, `/getGigsByUserId`, `/getGigById`, `/addGigToList`,
`/editGig`, `/deleteGig`, `/getStatsOfUser`, `/getTotalNumberOfGigs`,
`/getTotalNumberOfGigsThisYear`, `/getCountryStatsOfUser`, `/getTotalPrice`, `/getPriceThisYear`.

**Non repris** : l'intégration Spotify OAuth (code présent mais commenté/non branché
dans l'app Angular d'origine, aucune fonctionnalité réelle n'était perdue).

## Installation

```bash
npm install
```

## Lancer l'app

```bash
npx expo start
```

Puis scanne le QR code avec l'app **Expo Go** (Android/iOS), ou appuie sur `w` pour
lancer la version web, `a` pour un émulateur Android, `i` pour un simulateur iOS.

## Backend

Par défaut (`__DEV__` à `false`, build de prod), l'app pointe vers le même backend
Spring Boot que le front Angular en prod :

```
https://springboot-backend-513726246973.europe-west1.run.app
```

En développement (`npx expo start`), elle pointe vers `http://127.0.0.1:8080`
(voir `src/config/env.ts`). **Un simulateur/téléphone ne peut pas résoudre
`localhost` vers ton PC** :

- Émulateur Android → remplace par `http://10.0.2.2:8080`
- Téléphone physique / simulateur iOS → remplace par l'IP locale de ta machine
  (ex. `http://192.168.1.42:8080`), ou utilise un tunnel type `ngrok`.

## Dépannage

Si tu rencontres une erreur du type `Cannot find module 'react-native-worklets/plugin'`
au lancement (`npx expo start`), c'est un souci connu de résolution de dépendances
avec NativeWind. Il suffit de supprimer complètement `node_modules` et de
réinstaller :

```bash
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

Toutes les versions du projet (Expo SDK 57, React 19, React Native 0.86,
NativeWind 4.2.6, Reanimated/Worklets, React Navigation 7...) sont épinglées
dans `package.json` pour être mutuellement compatibles — inutile d'en changer
une isolément.

## Structure

```
App.tsx
src/
  api/            appels HTTP (axios) vers le backend
  components/     GigCard, GigForm (formulaire partagé add/edit), StatBlock
  config/         env.ts (URL du backend selon dev/prod)
  context/        AuthContext (état d'authentification global)
  navigation/      RootNavigator (stack) + MainTabs (onglets)
  screens/        Login, Dashboard, AddGig, EditGig, Stats
  types/          types TypeScript (Gig, stats, ...)
  utils/          storage.ts (AsyncStorage), jwt.ts (décodage/expiration)
```

## Design

Redesign complet façon "app à sortir demain sur l'App Store" plutôt qu'un
simple portage fonctionnel :

- **Palette bleu-nuit** (`#0B1120` → `#080B14`) avec un accent indigo
  électrique (`#6366F1`, esprit éclairage de scène) et un doré chaud
  (`#F5B942`) pour les prix — clin d'œil aux tickets de concert.
- **Police Sora** (`@expo-google-fonts/sora`) pour les titres et les gros
  chiffres, police système pour le reste — cohérent avec `tailwind.config.js`
  (`font-display`, `font-display-semibold`, `font-display-medium`).
- **`GigCard`** : la liste de concerts prend la forme d'un vrai ticket
  (souche date à gauche, ligne pointillée de "déchirure", encoches sur les
  bords) plutôt qu'une carte générique.
- **`CustomTabBar`** : barre d'onglets flottante avec un bouton "+" central
  surélevé en dégradé, façon app musicale, plutôt qu'un 3ᵉ onglet plat.
- **`StatTile` / `RankedList`** : l'écran Stats mélange tuiles à icônes
  (2×2) et classements façon leaderboard (médailles or/argent/bronze) pour
  les groupes et pays les plus vus.
- **`GigForm`** : les groupes se saisissent en chips (tags) plutôt qu'en
  inputs répétés.

## Choix techniques notables

- **Cartes plutôt que tableau** : sur mobile, un `<table>` HTML façon Angular
  obligerait à scroller horizontalement. La liste de concerts est donc affichée
  en cartes (mêmes informations : groupe, lieu, ville, pays, date, prix).
- **Formulaire mutualisé** (`GigForm.tsx`) entre "Ajouter" et "Modifier", alors
  que le projet Angular dupliquait la logique entre `add-gigs-form` et
  `edit-gig-form`.
- **NativeWind partout** : quasiment aucune StyleSheet, tout est en classes
  Tailwind (`className`).

## Pousser ce repo sur GitHub

Ce projet est déjà initialisé en repo Git local. Pour le publier :

```bash
git remote add origin git@github.com:<ton-compte>/gigs-app-react-native.git
git branch -M main
git push -u origin main
```
