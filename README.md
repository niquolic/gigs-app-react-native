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
`/getUserByLoginAndPassword`, `/getGigsByUserId`, `/getGigById`, `/addGigToList`,
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

## Choix techniques notables

- **Cartes plutôt que tableau** : sur mobile, un `<table>` HTML façon Angular
  obligerait à scroller horizontalement. La liste de concerts est donc affichée
  en cartes (mêmes informations : groupe, lieu, ville, pays, date, prix).
- **Formulaire mutualisé** (`GigForm.tsx`) entre "Ajouter" et "Modifier", alors
  que le projet Angular dupliquait la logique entre `add-gigs-form` et
  `edit-gig-form`.
- **Responsive** : l'écran Statistiques passe automatiquement de 1 à 2 colonnes
  selon la largeur d'écran (`useWindowDimensions`), pour bien s'adapter des
  petits téléphones aux tablettes/au web.
- **NativeWind partout** : quasiment aucune StyleSheet, tout est en classes
  Tailwind (`className`), pour rester au plus proche de "le moins de spécifique
  possible" demandé.

## Pousser ce repo sur GitHub

Ce projet est déjà initialisé en repo Git local. Pour le publier :

```bash
git remote add origin git@github.com:<ton-compte>/gigs-app-react-native.git
git branch -M main
git push -u origin main
```
