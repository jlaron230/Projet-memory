# 📌 Présentation des composants et de l’organisation du code

## 🌐 Technologie utilisée : Vue.js

Nous avons structuré notre application en respectant une architecture modulaire et organisée afin d’assurer une meilleure maintenabilité et évolutivité.

## 📂 Organisation du code

### 📄 Dossier `pages/`
Ce dossier contient toutes les pages principales de notre **Progressive Web App (PWA)**. Chaque page est reliée à `index.ts` via **Vue Router**.

### 🏗️ Dossier `components/`
Nous avons adopté une approche **atomique** en structurant nos composants de manière modulaire :
- **Sous-dossiers pour chaque entité** : Catégories, Thèmes, Cartes.
- **Importation directe** dans les pages concernées.

### 🏗️ Dossier `public/`
Les différentes fonctionnalités sont découpées en fichiers distincts :
- `cards.js` : Gestion des cartes.
- `categories.js` : Gestion des catégories.
- `themes.js` : Gestion des thèmes.
- `service-worker.js` : Initialisation du cache.
- `Cache.js` : Gestion du cache.
- `Manifest.json` : Permet l'installation en tant que pwa.

### 🛠️ Service Worker (`public/`)
Les **Progressive Web Apps (PWA)** nécessitent un **Service Worker** placé dans le dossier `public/`, accessible à la racine pour :
- **Gérer le cache** et optimiser le chargement hors ligne.
- **Intercepter les requêtes réseau** pour une meilleure performance.

### 🎨 Style avec Tailwind CSS
Nous avons utilisé **Tailwind CSS** pour la mise en page avec :
- Des **classes utilitaires** pour un design épuré et responsive.
- Un **fichier de configuration** pour une personnalisation avancée.

## 🚀 Avantages de cette organisation
✅ **Modularité** : Meilleure réutilisabilité des composants.  
✅ **Performance** : Utilisation de **Vite** pour un build rapide.  
✅ **Optimisation PWA** : Chargement hors ligne via **Service Worker**.  
✅ **Design moderne** : Intégration fluide avec **Tailwind CSS**.

---
💡 **Cette structure permet une application bien organisée, facile à maintenir et évolutive !** 🚀