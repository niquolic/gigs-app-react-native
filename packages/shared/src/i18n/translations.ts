export type AppLanguage = "fr" | "en";

const dictionaries = {
  fr: {
    profileTitle: "Mon profil", profileSubtitle: "Tes préférences Gigs", preferences: "Préférences",
    language: "Langue", currency: "Devise", logout: "Se déconnecter", chooseLanguage: "Choisir une langue",
    chooseCurrency: "Choisir une devise", saveError: "Impossible d'enregistrer tes préférences. Réessaie.",
    home: "Accueil", stats: "Stats", newGig: "Nouveau concert", addToCollection: "Ajoute-le à ta collection",
    editGig: "Modifier le concert", submit: "Valider", save: "Enregistrer", artists: "Groupes / artistes",
    bandPlaceholder: "Nom du groupe puis Entrée", city: "Ville", venue: "Salle", country: "Pays",
    date: "Date", price: "Prix", keyboardDone: "Valider", greeting: "Salut 👋", yourGigs: "Tes concerts",
    gigCounter: "concerts au compteur", next: "Prochain", noGigs: "Aucun concert pour l'instant",
    emptyGigs: "Ajoute ton premier concert pour commencer à construire ton historique.",
    addGig: "Ajouter un concert", deleteGig: "Supprimer ce concert ?", irreversible: "Cette action est irréversible.",
    cancel: "Annuler", delete: "Supprimer", error: "Erreur", addFailed: "L'ajout du concert a échoué.",
    deleteFailed: "La suppression a échoué.", updateFailed: "La modification a échoué.",
    loadFailed: "Impossible de charger ce concert.", highlights: "Ton palmarès", statistics: "Statistiques",
    gigsSeen: "Concerts vus", thisYear: "Cette année", totalSpent: "Dépensé au total",
    spentThisYear: "Dépensé cette année", topBands: "Groupes les plus vus",
    countries: "Pays visités", noStats: "Aucun concert renseigné pour l'instant.", seeMore: "Voir +",
    tagline: "Tous tes concerts, au même endroit", login: "Se connecter", registerPrompt: "Pas encore de compte ?",
    createAccount: "Créer un compte", identifier: "Identifiant", password: "Mot de passe",
    loginPlaceholder: "ton login", loginFailed: "Impossible de se connecter. Réessaie.",
    registerSubtitle: "Rejoins Gigs en quelques secondes", registerPlaceholder: "choisis un login",
    currencyOptional: "Devise · optionnel", languageOptional: "Langue · optionnel",
    confirmPassword: "Confirmer le mot de passe", passwordMismatch: "Les mots de passe ne correspondent pas.",
    create: "Créer mon compte", alreadyAccount: "Déjà un compte ?", registerFailed: "Impossible de créer le compte. Réessaie.",
    registerSuccess: "Compte créé avec succès. Connecte-toi pour continuer."
  },
  en: {
    profileTitle: "My profile", profileSubtitle: "Your Gigs preferences", preferences: "Preferences",
    language: "Language", currency: "Currency", logout: "Log out", chooseLanguage: "Choose a language",
    chooseCurrency: "Choose a currency", saveError: "Could not save your preferences. Please try again.",
    home: "Home", stats: "Stats", newGig: "New gig", addToCollection: "Add it to your collection",
    editGig: "Edit gig", submit: "Submit", save: "Save", artists: "Bands / artists",
    bandPlaceholder: "Enter a band name, then press Enter", city: "City", venue: "Venue", country: "Country",
    date: "Date", price: "Price", keyboardDone: "Done", greeting: "Hey 👋", yourGigs: "Your gigs",
    gigCounter: "gigs and counting", next: "Next", noGigs: "No gigs yet",
    emptyGigs: "Add your first gig to start building your history.",
    addGig: "Add a gig", deleteGig: "Delete this gig?", irreversible: "This action cannot be undone.",
    cancel: "Cancel", delete: "Delete", error: "Error", addFailed: "Could not add the gig.",
    deleteFailed: "Could not delete the gig.", updateFailed: "Could not update the gig.",
    loadFailed: "Could not load this gig.", highlights: "Your highlights", statistics: "Statistics",
    gigsSeen: "Gigs attended", thisYear: "This year", totalSpent: "Total spent",
    spentThisYear: "Spent this year", topBands: "Most-seen bands",
    countries: "Countries visited", noStats: "No gigs recorded yet.", seeMore: "See more",
    tagline: "All your gigs, in one place", login: "Log in", registerPrompt: "Don't have an account yet?",
    createAccount: "Create an account", identifier: "Username", password: "Password",
    loginPlaceholder: "your username", loginFailed: "Could not log in. Please try again.",
    registerSubtitle: "Join Gigs in seconds", registerPlaceholder: "choose a username",
    currencyOptional: "Currency · optional", languageOptional: "Language · optional",
    confirmPassword: "Confirm password", passwordMismatch: "Passwords do not match.",
    create: "Create my account", alreadyAccount: "Already have an account?", registerFailed: "Could not create your account. Please try again.",
    registerSuccess: "Account created successfully. Log in to continue."
  }
} satisfies Record<AppLanguage, Record<string, string>>;

export type TranslationKey = keyof typeof dictionaries.fr;
export function translate(language: AppLanguage, key: TranslationKey): string {
  return dictionaries[language][key] ?? dictionaries.fr[key] ?? key;
}
