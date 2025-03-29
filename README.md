# 📚 Projet Memory

## Description du projet

**Memory** est une application de mémorisation basée sur la répétition espacée. Elle permet aux utilisateurs de créer des cartes de révision organisées en **thèmes**, eux-mêmes regroupés dans des **catégories**.  
L'objectif est d'améliorer l'apprentissage en affichant des cartes à revoir selon un algorithme de répétition espacée.

L'application fonctionne **hors-ligne** grâce à l'utilisation d'un **Service Worker** et d'un **fichier Manifest**.

---

## 🚀 Fonctionnalités principales

### 🎯 Gestion des catégories et thèmes
- Création de **catégories** pour organiser les révisions.
- Ajout de **thèmes** au sein des catégories.
- Chaque **thème** contient des **cartes de révision**.

### 🃏 Gestion des cartes de révision
- Chaque carte a un **recto** et un **verso** pouvant contenir du **texte, des images**.
- Possibilité d'ajouter, modifier et supprimer des cartes.

### 🔁 Révision avec répétition espacée
- L’utilisateur choisit **le nombre de niveaux** et **le nombre de nouvelles cartes vues par jour**.
- L'algorithme affiche d'abord les cartes les plus anciennes avant d'introduire de nouvelles cartes.
- Possibilité de marquer une carte comme **mémorisée**, ce qui impacte sa fréquence d’apparition.

### 📢 Notifications et rappels
- Option pour configurer un **rappel quotidien** afin de ne pas oublier ses révisions.
- Utilisation des **notifications push** (si acceptées par l'utilisateur).


### 📡 Mode hors-ligne
- **Service Worker** pour la mise en cache des ressources.
- **Fichier Manifest** pour une installation en tant qu'application PWA.

---

## 🛠️ Technologies utilisées

- **Vue.js** avec **Vue Router** et **Pinia/Vuex** pour la gestion des états.
- **Service Worker** pour la gestion du cache et du mode hors-ligne.
- **IndexedDB ou CacheStorage** pour stocker les données de révision.

---
## Retrouve la documentation des composants sur le fichier : 
- **ComponentsListing.md**

## 📌 Déploiement

### 💻 Installation et lancement en local

1. **Cloner le projet**
   ```sh
   git clone git@github.com:jlaron230/Projet-memory.git
   cd Projet-memory

# Documentation : Déploiement sur Vercel

## 1. Prérequis
- Compte GitHub avec le projet.
- Compte Vercel.

## 2. Étapes de déploiement
1. Connectez-vous à Vercel avec GitHub.
2. Cliquez sur **"New Project"** et sélectionnez votre dépôt GitHub.
3. Vercel détecte automatiquement la configuration du projet.
4. Cliquez sur **"Deploy"** pour lancer le déploiement.

## 3. Accès à l'application
- Une fois le déploiement terminé, un lien vers votre application sera fourni.

## 4. Mise à jour automatique
- À chaque push sur GitHub, Vercel déploie automatiquement la nouvelle version.

## Conclusion
Vercel facilite le déploiement automatisé de votre projet "Memory" à partir de GitHub.
-