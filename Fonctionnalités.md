## 🚀 Fonctionnalités principales

### 🔹 Gestion des catégories
- **Créer une catégorie** via un formulaire (`CreateCategories`).
- **Modifier une catégorie** en activant un mode édition (`toggleEdit`, `PutCategories`).
- **Supprimer une catégorie** en la retirant de la liste et du cache (`DeleteCategories`).

### 🔹 Persistance des données
- **Stockage des catégories** via un **Service Worker** (`navigator.serviceWorker.controller.postMessage`).
- **Récupération des catégories** depuis le **cache du navigateur** (`getCategoriesFromCache`).

### 🔹 Interface utilisateur
- **Affichage des catégories** sous forme de liste.
- **Édition en ligne** avec un champ modifiable.
- **Navigation dynamique** via `router-link` pour afficher les thèmes associés à chaque catégorie.

---

# 📌 Gestion des Thèmes (Vue.js + Service Worker)

Permet d'**ajouter, modifier, supprimer et afficher** des thèmes avec **persistance via CacheStorage**.

## 🔧 Fonctionnalités
- **Ajout** d’un thème (nom + description).
- **Modification** et **suppression** d’un thème.
- **Stockage** et **récupération** des thèmes via **Service Worker**.

## 🔄 Fonctionnement
- **Ajout/Modification** : Mise à jour locale et envoi au Service Worker.
- **Suppression** : Retrait du cache et mise à jour de la liste.
- **Récupération** : Chargement des thèmes depuis CacheStorage au démarrage.

## 🖥️ Interface
- Formulaire d’ajout.
- Liste des thèmes avec actions (édition/suppression).
- Navigation entre les thèmes.

---
# 📌 Composant de gestion des cartes – Fonctionnalités détaillées

## ✨ Gestion des cartes de mémorisation
- Création de nouvelles cartes associées à un thème spécifique.
- Modification et suppression des cartes existantes.
- Affichage détaillé d’une carte dans une modal.

## 🖼️ Gestion des médias
- Possibilité d’ajouter une image à une carte.
- Conversion automatique des fichiers en **base64** pour le stockage.

## 📊 Suivi et progression de l’apprentissage
- **Système de répétition espacée** : Gestion du niveau des cartes en fonction des révisions.
- **Quota quotidien** : Limitation du nombre de nouvelles cartes à voir chaque jour.
- **Validation des cartes mémorisées** : Mise à jour du niveau des cartes après révision.

## 💾 Persistance des données
- Stockage des cartes et de leur progression via **CacheStorage** (géré par un Service Worker).
- Récupération des données au chargement de l’application pour assurer la continuité des sessions.

## 🏗️ Navigation et organisation
- Lien entre **Catégories**, **Thèmes** et **Cartes** pour une gestion structurée.
- Système de navigation permettant d’accéder aux différentes entités facilement.

---

# 🔔 Gestion des Notifications – Fonctionnalités détaillées

## 📢 Demande de permission pour les notifications
- Vérifie si l'API Notification est disponible dans le navigateur.
- Vérifie si l'utilisateur a déjà donné son consentement.
- Demande l'autorisation d'afficher des notifications si nécessaire.

## 📅 Planification des notifications quotidiennes
- Vérifie si l'autorisation des notifications est accordée.
- Empêche la planification multiple de notifications simultanées.
- Programme une notification quotidienne à **9h du matin**.
- Gère le délai avant la première notification si l'heure cible est déjà passée.

## 🚀 Envoi de la notification
- Affiche une notification avec :
    - **Titre** : "📖 Temps de révision !"
    - **Message** : "Prenez quelques minutes pour revoir vos cartes !"
    - **Icône** : `/icons/notification-icon.png`

## ⏹️ Arrêt des notifications programmées
- Permet d'arrêter l'envoi automatique des notifications.
- Vérifie si une notification est actuellement active avant de la stopper.

## 🔧 Points techniques
- **`setTimeout`** : Pour déclencher la première notification au bon moment.
- **`setInterval`** : Pour répéter l'envoi toutes les **24 heures**.
- **Gestion des doublons** : Vérification pour éviter les notifications en double.
