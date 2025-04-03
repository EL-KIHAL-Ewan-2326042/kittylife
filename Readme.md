# KittyLife - README

## Résumé de l'application

KittyLife est une application mobile React Native qui permet de simuler l'adoption et le soin d'un chat virtuel. L'utilisateur peut nourrir son chat avec différents types d'aliments, jouer avec lui, et prendre soin de son bien-être.

## Prérequis

- Node.js (v14.0.0 ou supérieur)
- npm ou yarn
- React Native CLI
- Android Studio (pour le développement Android)
- Xcode (pour le développement iOS)
- JDK 11 ou supérieur

## Structure du projet

```
kittylife/
├── assets/             # Images et ressources statiques
│   ├── cat/            # Images des chats
│   ├── food/           # Images de nourriture
│   └── ...
├── components/         # Composants React réutilisables
│   ├── cat/            # Composants liés au chat
│   ├── food/           # Composants de gestion de nourriture
│   └── ...
├── screens/            # Écrans principaux de l'application
├── navigation/         # Configuration de la navigation
├── services/           # Services et logique métier
├── utils/              # Fonctions utilitaires
├── App.js              # Point d'entrée de l'application
├── android/            # Configuration native Android
├── ios/                # Configuration native iOS
└── package.json        # Dépendances du projet
```

## Fichiers importants

- `App.js`: Point d'entrée principal de l'application qui configure la navigation.
- `components/food/FoodItem.js`: Gère l'affichage et le comportement des aliments, notamment la fonctionnalité glisser-déposer pour nourrir le chat.
- `components/cat/Cat.js`: Composant principal pour l'affichage et l'interactivité avec le chat virtuel.
- `screens/HomeScreen.js`: Écran principal où le joueur interagit avec son chat.
- `screens/AdoptionScreen.js`: Écran permettant de sélectionner et adopter un chat.
- `services/CatService.js`: Gestion de l'état du chat, incluant la faim, le bonheur et la santé.

## Comment exécuter le projet

```bash
# Installer les dépendances
yarn install
# ou
npm install

# Démarrer l'application sur Android
yarn android
# ou
npm run android

# Démarrer l'application sur iOS
yarn ios
# ou
npm run ios
```

## Fonctionnalités principales

- Système de nourriture drag-and-drop pour alimenter le chat
- Différents types d'aliments avec des effets variés sur la santé du chat
- Système de statistiques pour suivre le bien-être du chat
- Interface interactive et animations

## Auteur

Projet réalisé par Belz Matteo, Buchmuller Nassim, Ewan El Kihal, Baptiste Turmo dans le cadre de la ressource R4-11.