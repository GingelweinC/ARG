# Projet ARG — README

## 1. Description du projet

Ce projet est un projet interactif basé sur le web qui prend en charge un ARG (Alternate Reality Game). Le dépôt inclut diverses pages HTML, des scripts JavaScript et des ressources pour créer une expérience immersive pour les utilisateurs. Le projet propose également une API backend pour gérer les sessions utilisateur, le suivi de progression et la gestion sécurisée des fichiers.

Fonctionnalités principales :
- Énigmes et défis basés sur le web
- Mécaniques de jeu inspirées des ARG
- API backend pour la gestion des sessions et le suivi de progression
- Mesures de sécurité minimales pour protéger les données sensibles
- Intégration de ressources multimédia (audio, vidéo et images) pour une expérience utilisateur enrichie

Technologies principales : HTML, CSS, JavaScript, Firebase Firestore et Node.js (API de type serverless).

Objectif : Fournir une plateforme permettant aux utilisateurs de résoudre des énigmes et de progresser dans une histoire inspirée des ARG.

## 2. Résultats d'apprentissage

- **Énigmes Web**
  - **Contexte** : Besoin de concevoir et d'implémenter des énigmes interactives pour les utilisateurs.
  - **Action** : Création de diverses pages HTML avec des scripts JavaScript pour gérer les mécaniques des énigmes et les interactions utilisateur.
  - **Résultat** : Acquisition d'expérience dans la conception et l'implémentation d'énigmes basées sur le web.

- **Compréhension des mécaniques ARG**
  - **Contexte** : Exploration des principes des jeux en réalité alternée pour créer une expérience immersive.
  - **Action** : Intégration d'éléments ARG tels que des indices cachés, une progression narrative et des stratégies d'engagement utilisateur.
  - **Résultat** : Développement d'une compréhension approfondie de la conception des ARG et de leur application dans les projets web.

- **Sécurité basique des fichiers**
  - **Contexte** : Besoin d'assurer une sécurité minimale pour les fichiers sensibles que les utilisateurs ne devraient pas accéder directement.
  - **Action** : Mise en place de mesures telles que la gestion des sessions côté serveur et la restriction d'accès à certains fichiers.
  - **Résultat** : Amélioration des connaissances sur les pratiques de sécurité des fichiers et leur mise en œuvre.

- **Progression en JavaScript**
  - **Contexte** : Amélioration des compétences en programmation JavaScript grâce au développement backend et à l'intégration d'API.
  - **Action** : Travail sur la logique backend basée sur JavaScript pour gérer les sessions utilisateur et le suivi de progression.
  - **Résultat** : Renforcement des compétences en programmation JavaScript et en développement backend.

## 3. Comment exécuter et utiliser

Pour découvrir le projet, ouvrez simplement les fichiers HTML dans un navigateur. Pour une expérience complète, assurez-vous que l'API backend est en cours d'exécution pour gérer les sessions utilisateur et le suivi de progression.

### Variables d'environnement (pour l'API)

Créez un fichier `.env` ou définissez des variables d'environnement dans votre fournisseur d'hébergement avec les valeurs suivantes :

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### Exécution locale (développement)

1. Installez les dépendances :
   ```
   npm install
   ```
2. Démarrez le serveur de développement :
   ```
   npm start
   ```
3. Ouvrez le projet dans votre navigateur.

## 4. Structure du projet

- `index.html`, `page1.html`, `page2.html`, ... — Pages d'énigmes
- `assets/` — Ressources statiques (CSS, JavaScript, images, audio, vidéo)
- `api/` — API backend pour la gestion des sessions et le suivi de progression
- `package.json` — Liste des dépendances et script de démarrage

## 5. Dépannage et notes

- Assurez-vous que toutes les variables d'environnement requises sont définies avant d'exécuter l'API — l'absence de credentials Firebase entraînera l'échec des appels API.
- Pour les tests locaux, utilisez un outil comme `http-server` ou un serveur de développement similaire pour servir les fichiers.
- Si vous déployez sur une plateforme comme Vercel, assurez-vous que le dossier `api/` est traité comme des fonctions serverless.

## 6. Licence et crédits

Voir le fichier LICENSE.